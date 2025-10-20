import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION })

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing or invalid authorization header' })
      }
    }

    const accessToken = authHeader.substring(7)

    const command = new GetUserCommand({
      AccessToken: accessToken
    })

    const response = await cognitoClient.send(command)

    const email = response.UserAttributes?.find(attr => attr.Name === 'email')?.Value

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: email || response.Username,
          role: 'admin',
          username: response.Username
        }
      })
    }
  } catch (error: any) {
    console.error('Token verification error:', error)
    
    if (error.name === 'NotAuthorizedException') {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid or expired token' })
      }
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}