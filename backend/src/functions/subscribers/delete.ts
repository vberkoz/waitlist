import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import jwt from 'jsonwebtoken'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)
const TABLE_NAME = process.env.TABLE_NAME!
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production'

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
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
    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid token' })
      }
    }

    const subscriberId = event.pathParameters?.id
    if (!subscriberId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Subscriber ID is required' })
      }
    }

    const pk = `SUBSCRIBER#${subscriberId}`
    const sk = `SUBSCRIBER#${subscriberId}`
    
    const getResult = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk }
    }))

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Subscriber not found' })
      }
    }

    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk }
    }))

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Subscriber deleted successfully' })
    }
  } catch (error) {
    console.error('Delete subscriber error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
