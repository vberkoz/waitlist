const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const app = express()
const PORT = 3001
const JWT_SECRET = 'test-secret'
const ADMIN_EMAIL = 'admin@waitlist.com'
const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update('admin123').digest('hex')

app.use(cors())
app.use(express.json())

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Waitlist Mock API Server',
    endpoints: {
      'POST /auth/login': 'Login with email/password',
      'GET /auth/verify': 'Verify JWT token',
      'GET /subscribers': 'Get subscribers (requires auth)',
      'POST /waitlists': 'Create waitlist (requires auth)',
      'GET /waitlists': 'List waitlists (requires auth)'
    },
    testCredentials: {
      email: 'admin@waitlist.com',
      password: 'admin123'
    }
  })
})

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }
  
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  
  if (email !== ADMIN_EMAIL || passwordHash !== ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
  
  res.json({
    token,
    user: { email, role: 'admin' }
  })
})

// Verify token endpoint
app.get('/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ user: { email: decoded.email, role: decoded.role } })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Mock subscribers endpoint for testing
app.get('/subscribers', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  res.json({
    subscribers: [
      { id: '1', email: 'test@example.com', createdAt: new Date().toISOString() }
    ]
  })
})

// Mock waitlists storage
let waitlists = []
let waitlistIdCounter = 1

// Create waitlist endpoint
app.post('/waitlists', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const { name, description, primaryColor, logo } = req.body
  
  if (!name || !description || !primaryColor) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  const waitlist = {
    id: `waitlist_${waitlistIdCounter++}`,
    name,
    description,
    primaryColor,
    logo,
    ownerEmail: 'admin@waitlist.com',
    subscriberCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  waitlists.push(waitlist)
  
  res.status(201).json({ waitlist })
})

// List waitlists endpoint
app.get('/waitlists', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  res.json({ waitlists })
})

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`)
  console.log('Test credentials:')
  console.log('Email: admin@waitlist.com')
  console.log('Password: admin123')
})