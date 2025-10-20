// Simple test script for authentication endpoints
const API_URL = 'https://your-api-gateway-url.amazonaws.com/prod' // Replace with actual URL

async function testAuth() {
  console.log('Testing authentication system...\n')
  
  // Test login
  console.log('1. Testing login...')
  try {
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
      console.log('Token:', loginData.token.substring(0, 20) + '...')
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
    } else {
      console.log('❌ Login failed')
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
  
  // Test invalid credentials
  console.log('\n3. Testing invalid credentials...')
  try {
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
  }
}

// Update API_URL above with your actual API Gateway URL and run:
// node test-auth.js
console.log('Update API_URL in this file with your actual API Gateway URL and run: node test-auth.js')