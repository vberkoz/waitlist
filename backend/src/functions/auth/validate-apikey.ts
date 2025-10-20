import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodb } from '../../lib/dynamodb'
import { createResponse } from '../../lib/utils'
import { hashApiKey, validateApiKeyFormat } from '../../lib/apikey'

const TABLE_NAME = process.env.TABLE_NAME!

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const apiKey = event.headers['x-api-key'] || event.headers['X-API-Key']
    
    if (!apiKey) {
      return createResponse(401, { error: 'API key is required' })
    }

    if (!validateApiKeyFormat(apiKey)) {
      return createResponse(401, { error: 'Invalid API key format' })
    }

    const keyHash = hashApiKey(apiKey)
    
    // We need to scan for the API key by hash since we don't store the hash as PK
    // In a production system, you might want to use a GSI for this
    const { Items } = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'keyHash = :hash AND begins_with(PK, :pk)',
      ExpressionAttributeValues: {
        ':hash': keyHash,
        ':pk': 'APIKEY#'
      }
    }))

    if (!Items || Items.length === 0) {
      return createResponse(401, { error: 'Invalid API key' })
    }

    const apiKeyData = Items[0]


    
    if (!apiKeyData.isActive) {
      return createResponse(401, { error: 'API key is inactive' })
    }

    // Update last used timestamp
    const now = new Date().toISOString()
    await dynamodb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: apiKeyData.PK,
        SK: apiKeyData.SK
      },
      UpdateExpression: 'SET lastUsedAt = :now',
      ExpressionAttributeValues: {
        ':now': now
      }
    }))

    return createResponse(200, {
      valid: true,
      apiKeyId: apiKeyData.apiKeyId,
      waitlistId: apiKeyData.waitlistId,
      name: apiKeyData.name
    })

  } catch (error: any) {
    console.error('Error validating API key:', error)
    return createResponse(500, { error: 'Internal server error' })
  }
}