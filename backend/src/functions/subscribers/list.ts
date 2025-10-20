import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodb } from '../../lib/dynamodb'
import { createResponse } from '../../lib/utils'

const TABLE_NAME = process.env.TABLE_NAME!

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const waitlistId = event.queryStringParameters?.waitlistId || 'test-waitlist-123'
    const limit = parseInt(event.queryStringParameters?.limit || '10')
    const lastKey = event.queryStringParameters?.lastKey

    const queryParams: any = {
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `WAITLIST#${waitlistId}`,
        ':sk': 'SUBSCRIBER#'
      },
      Limit: limit,
      ScanIndexForward: false // Most recent first
    }

    if (lastKey) {
      queryParams.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey))
    }

    const result = await dynamodb.send(new QueryCommand(queryParams))

    const subscribers = result.Items?.map(item => ({
      subscriberId: item.subscriberId,
      email: item.email,
      waitlistId: item.waitlistId,
      createdAt: item.createdAt
    })) || []

    return createResponse(200, {
      subscribers,
      lastKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null,
      count: subscribers.length
    })

  } catch (error: any) {
    console.error('Error listing subscribers:', error)
    return createResponse(500, { error: 'Internal server error' })
  }
}
