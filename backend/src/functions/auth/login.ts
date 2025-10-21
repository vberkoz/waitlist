import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { z } from 'zod'
import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || createHash('sha256').update('admin123').digest('hex')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request body is required' })
      }
    }

    const body = loginSchema.parse(JSON.parse(event.body))
    const passwordHash = createHash('sha256').update(body.password).digest('hex')

    console.log('Login attempt:', { email: body.email, providedHash: passwordHash, expectedHash: ADMIN_PASSWORD_HASH })

    if (body.email !== ADMIN_EMAIL || passwordHash !== ADMIN_PASSWORD_HASH) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    }

    const token = jwt.sign(
      { email: body.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ token, user: { email: body.email, role: 'admin' } })
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}