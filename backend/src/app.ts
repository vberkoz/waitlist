import express from 'express'
import { handler as createWaitlist } from './functions/waitlists/create'
import { handler as listWaitlists } from './functions/waitlists/list'
import { handler as deleteWaitlist } from './functions/waitlists/delete'
import { handler as getWaitlist } from './functions/public/get-waitlist'
import { handler as createSubscriber } from './functions/subscribers/create'
import { handler as listSubscribers } from './functions/subscribers/list'
import { handler as deleteSubscriber } from './functions/subscribers/delete'
import { handler as exportSubscribers } from './functions/subscribers/export'
import { handler as createApiKey } from './functions/auth/create-apikey'
import { handler as validateApiKey } from './functions/auth/validate-apikey'
import { handler as login } from './functions/auth/login'
import { handler as verifyToken } from './functions/auth/verify'
import { handler as cognitoLogin } from './functions/auth/cognito-login'
import { handler as cognitoVerify } from './functions/auth/cognito-verify'

const app = express()

app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Lambda handler wrapper
const wrapHandler = (handler: any) => async (req: express.Request, res: express.Response) => {
  const event = {
    httpMethod: req.method,
    path: req.path,
    pathParameters: req.params,
    queryStringParameters: req.query,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : null
  }

  const result = await handler(event, {})
  res.status(result.statusCode).json(JSON.parse(result.body))
}

// Waitlist routes
app.post('/waitlists', wrapHandler(createWaitlist))
app.get('/waitlists', wrapHandler(listWaitlists))
app.delete('/waitlists/:id', wrapHandler(deleteWaitlist))

// Subscriber routes
app.post('/subscribers', wrapHandler(createSubscriber))
app.get('/subscribers', wrapHandler(listSubscribers))
app.delete('/subscribers/:id', wrapHandler(deleteSubscriber))
app.post('/subscribers/export', wrapHandler(exportSubscribers))

// Auth routes
app.post('/auth/apikeys', wrapHandler(createApiKey))
app.post('/auth/validate', wrapHandler(validateApiKey))
app.post('/auth/login', wrapHandler(login))
app.get('/auth/verify', wrapHandler(verifyToken))
app.post('/auth/cognito-login', wrapHandler(cognitoLogin))
app.get('/auth/cognito-verify', wrapHandler(cognitoVerify))

// Public waitlist page
app.get('/:slug', wrapHandler(getWaitlist))

export default app
