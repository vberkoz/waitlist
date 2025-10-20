import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION })
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Request body is required' })
      }
    }

    const body = loginSchema.parse(JSON.parse(event.body))

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: body.email,
        PASSWORD: body.password
      }
    })

    const response = await cognitoClient.send(command)

    if (!response.AuthenticationResult) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Authentication failed' })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        user: {
          email: body.email,
          role: 'admin'
        }
      })
    }
  } catch (error: any) {
    console.error('Cognito login error:', error)
    
    if (error.name === 'NotAuthorizedException') {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}