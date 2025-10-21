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

    const waitlistId = event.pathParameters?.id
    if (!waitlistId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Waitlist ID is required' })
      }
    }

    const getResult = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: waitlistId, SK: 'WAITLIST' }
    }))

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Waitlist not found' })
      }
    }

    if (getResult.Item.ownerEmail !== userEmail) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Forbidden' })
      }
    }

    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: waitlistId, SK: 'WAITLIST' }
    }))

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Waitlist deleted successfully' })
    }
  } catch (error) {
    console.error('Delete waitlist error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
