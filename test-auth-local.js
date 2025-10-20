const fetch = require('node-fetch')

const API_URL = 'http://localhost:3001'

async function testAuth() {
  console.log('Testing local authentication...\n')
  
  try {
    // Test login with correct credentials
    console.log('1. Testing login with correct credentials...')
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@waitlist.com',
        password: 'admin123'
      })
    })
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('✅ Login successful')
      console.log('User:', loginData.user)
      
      // Test token verification
      console.log('\n2. Testing token verification...')
      const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${loginData.token}` }
      })
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json()
        console.log('✅ Token verification successful')
        console.log('Verified user:', verifyData.user)
      } else {
        console.log('❌ Token verification failed')
      }
      
      // Test protected endpoint
      console.log('\n3. Testing protected endpoint...')
      const subscribersResponse = await fetch(`${API_URL}/subscribers`, {
        headers: { Authorization: `Bearer ${loginData.token}` }
      })
      
      if (subscribersResponse.ok) {
        console.log('✅ Protected endpoint accessible with token')
      } else {
        console.log('❌ Protected endpoint failed')
      }
      
    } else {
      console.log('❌ Login failed')
    }
    
    // Test invalid credentials
    console.log('\n4. Testing invalid credentials...')
    const invalidResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: 'wrongpassword'
      })
    })
    
    if (invalidResponse.status === 401) {
      console.log('✅ Invalid credentials properly rejected')
    } else {
      console.log('❌ Invalid credentials not properly handled')
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message)
    console.log('Make sure mock server is running: node mock-server.js')
  }
}

testAuth()