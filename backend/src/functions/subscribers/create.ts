import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodb } from '../../lib/dynamodb'
import { generateId, createResponse } from '../../lib/utils'
import { createSubscriberSchema } from '../../../../shared/schemas/subscriber'
import { Subscriber } from '../../../../shared/types/subscriber'

const TABLE_NAME = process.env.TABLE_NAME!

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' })
    }

    const body = JSON.parse(event.body)
    const validation = createSubscriberSchema.safeParse(body)
    
    if (!validation.success) {
      return createResponse(400, { 
        error: 'Validation failed', 
        details: validation.error.errors 
      })
    }

    const { email, waitlistId } = validation.data
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
