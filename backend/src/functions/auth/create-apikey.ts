import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodb } from '../../lib/dynamodb'
import { generateId, createResponse } from '../../lib/utils'
import { generateApiKey } from '../../lib/apikey'
import { createApiKeySchema } from '../../../../shared/schemas/apikey'
import { ApiKey } from '../../../../shared/types/apikey'

const TABLE_NAME = process.env.TABLE_NAME!

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' })
    }

    const body = JSON.parse(event.body)
    const validation = createApiKeySchema.safeParse(body)
    
    if (!validation.success) {
      return createResponse(400, { 
        error: 'Validation failed', 
        details: validation.error.errors 
      })
    }

    const { waitlistId, name } = validation.data
    const apiKeyId = generateId()
    const { key, hash, prefix } = generateApiKey()
    const now = new Date().toISOString()

    const apiKey: ApiKey = {
      PK: `APIKEY#${apiKeyId}`,
      SK: `APIKEY#${apiKeyId}`,
      GSI1PK: `WAITLIST#${waitlistId}`,
      GSI1SK: `APIKEY#${now}`,
      apiKeyId,
      waitlistId,
      name,
      keyHash: hash,
      keyPrefix: prefix,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: apiKey,
      ConditionExpression: 'attribute_not_exists(PK)'
    }))

    return createResponse(201, {
      apiKeyId,
      name,
      waitlistId,
      key, // Only returned once during creation
      prefix,
      isActive: true,
      createdAt: now
    })

  } catch (error: any) {
    console.error('Error creating API key:', error)
    
    if (error.name === 'ConditionalCheckFailedException') {
      return createResponse(409, { error: 'API key already exists' })
    }
    
    return createResponse(500, { error: 'Internal server error' })
  }
}