import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { generateApiKey } from '../../lib/apikey'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)
const TABLE_NAME = process.env.TABLE_NAME!
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production'

const createWaitlistSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+$/),
  description: z.string().min(10),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/i),
  logo: z.string().optional()
})

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unauthorized' })
      }
    }

    const token = authHeader.substring(7)
    let userEmail: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
      userEmail = decoded.email
    } catch {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid token' })
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request body is required' })
      }
    }

    const body = createWaitlistSchema.parse(JSON.parse(event.body))
    
    // Check and generate unique slug
    let slug = body.slug
    let isUnique = false
    let attempts = 0
    
    while (!isUnique && attempts < 10) {
      const existingCheck = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'slug = :slug AND SK = :sk',
        ExpressionAttributeValues: {
          ':slug': slug,
          ':sk': 'WAITLIST'
        }
      }))
      
      if (!existingCheck.Items || existingCheck.Items.length === 0) {
        isUnique = true
      } else {
        // Add 4 random chars
        const randomChars = Math.random().toString(36).substring(2, 6)
        slug = body.slug + randomChars
        attempts++
      }
    }
    
    if (!isUnique) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unable to generate unique slug. Please try a different name.' })
      }
    }
    
    const waitlistId = `waitlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    const publicUrl = `https://project.waitlist.vberkoz.com/${slug}`
    const { key: apiKey, hash: keyHash, prefix: keyPrefix } = generateApiKey()

    const waitlist = {
      PK: waitlistId,
      SK: 'WAITLIST',
      GSI1PK: `USER#${userEmail}`,
      GSI1SK: `WAITLIST#${now}`,
      id: waitlistId,
      name: body.name,
      description: body.description,
      primaryColor: body.primaryColor,
      logo: body.logo,
      slug,
      publicUrl,
      ownerEmail: userEmail,
      subscriberCount: 0,
      createdAt: now,
      updatedAt: now
    }

    const apiKeyRecord = {
      PK: `APIKEY#${keyPrefix}`,
      SK: `APIKEY#${keyPrefix}`,
      keyHash,
      keyPrefix,
      waitlistId,
      isActive: true,
      createdAt: now
    }

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: waitlist
    }))

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: apiKeyRecord
    }))

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ 
        waitlist: {
          ...waitlist,
          apiKey
        }
      })
    }
  } catch (error) {
    console.error('Create waitlist error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
