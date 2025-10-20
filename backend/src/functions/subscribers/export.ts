import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client } from '@aws-sdk/client-s3'
import { dynamodb } from '../../lib/dynamodb'
import { createResponse, generateId } from '../../lib/utils'

const TABLE_NAME = process.env.TABLE_NAME!
const ASSETS_BUCKET = process.env.ASSETS_BUCKET!
const s3Client = new S3Client({})

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const waitlistId = event.queryStringParameters?.waitlistId || 'test-waitlist-123'

    // Query all subscribers for the waitlist
    const result = await dynamodb.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `WAITLIST#${waitlistId}`,
        ':sk': 'SUBSCRIBER#'
      }
    }))

    const subscribers = result.Items || []

    // Generate CSV content
    const csvHeader = 'Email,Created At,Subscriber ID\n'
    const csvRows = subscribers.map(item => {
      const email = item.email || ''
      const createdAt = item.createdAt || ''
      const subscriberId = item.subscriberId || ''
      return `"${email}","${createdAt}","${subscriberId}"`
    }).join('\n')
    
    const csvContent = csvHeader + csvRows

    // Generate unique filename
    const filename = `exports/subscribers-${waitlistId}-${Date.now()}.csv`

    // Upload CSV to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: ASSETS_BUCKET,
      Key: filename,
      Body: csvContent,
      ContentType: 'text/csv',
      ContentDisposition: `attachment; filename="subscribers-${waitlistId}.csv"`
    }))

    // Generate pre-signed URL (expires in 1 hour)
    const downloadUrl = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: ASSETS_BUCKET,
      Key: filename
    }), { expiresIn: 3600 })

    return createResponse(200, {
      downloadUrl,
      filename,
      count: subscribers.length,
      expiresIn: 3600
    })

  } catch (error: any) {
    console.error('Error exporting subscribers:', error)
    return createResponse(500, { error: 'Internal server error' })
  }
}