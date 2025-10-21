import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodb } from '../../lib/dynamodb'
import { generateId, createResponse } from '../../lib/utils'
import { hashApiKey, validateApiKeyFormat } from '../../lib/apikey'
import { createSubscriberSchema } from '../../../../shared/schemas/subscriber'
import { Subscriber } from '../../../../shared/types/subscriber'

const TABLE_NAME = process.env.TABLE_NAME!

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' })
    }

    const body = JSON.parse(event.body)
    
    // Check if API key is provided (for API usage)
    const apiKey = event.headers['x-api-key'] || event.headers['X-API-Key']
    let waitlistId = body.waitlistId
    
    if (apiKey) {
      // Validate API key and get waitlistId from it
      if (!validateApiKeyFormat(apiKey)) {
        return createResponse(401, { error: 'Invalid API key format' })
      }

      const keyHash = hashApiKey(apiKey)
      const { Items } = await dynamodb.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'keyHash = :hash AND begins_with(PK, :pk)',
        ExpressionAttributeValues: {
          ':hash': keyHash,
          ':pk': 'APIKEY#'
        }
      }))

      if (!Items || Items.length === 0 || !Items[0].isActive) {
        return createResponse(401, { error: 'Invalid or inactive API key' })
      }

      waitlistId = Items[0].waitlistId
    } else if (!waitlistId) {
      return createResponse(400, { error: 'waitlistId is required' })
    }

    const validation = createSubscriberSchema.safeParse({
      email: body.email,
      waitlistId
    })
    
    if (!validation.success) {
      return createResponse(400, { 
        error: 'Validation failed', 
        details: validation.error.errors 
      })
    }

    const { email } = validation.data
    const subscriberId = generateId()
    const now = new Date().toISOString()

    const subscriber: Subscriber = {
      PK: `SUBSCRIBER#${subscriberId}`,
      SK: `SUBSCRIBER#${subscriberId}`,
      GSI1PK: `WAITLIST#${waitlistId}`,
      GSI1SK: `SUBSCRIBER#${now}`,
      subscriberId,
      waitlistId,
      email,
      createdAt: now,
      updatedAt: now
    }

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: subscriber,
      ConditionExpression: 'attribute_not_exists(PK)'
    }))

    return createResponse(201, {
      subscriberId,
      email,
      waitlistId,
      createdAt: now
    })

  } catch (error: any) {
    console.error('Error creating subscriber:', error)
    
    if (error.name === 'ConditionalCheckFailedException') {
      return createResponse(409, { error: 'Subscriber already exists' })
    }
    
    return createResponse(500, { error: 'Internal server error' })
  }
}
