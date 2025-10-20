const fetch = require('node-fetch')

const API_URL = 'http://localhost:3001'

async function testWaitlists() {
  console.log('Testing waitlist functionality...\n')
  
  try {
    // First login to get token
    console.log('1. Logging in...')
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@waitlist.com',
        password: 'admin123'
      })
    })
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed')
      return
    }
    
    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log('✅ Login successful')
    
    // Test creating a waitlist
    console.log('\n2. Creating a waitlist...')
    const createResponse = await fetch(`${API_URL}/waitlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Product Launch',
        description: 'This is a test waitlist for our amazing new product',
        primaryColor: '#3b82f6',
        logo: 'https://example.com/logo.png'
      })
    })
    
    if (createResponse.ok) {
      const createData = await createResponse.json()
      console.log('✅ Waitlist created successfully')
      console.log('Waitlist ID:', createData.waitlist.id)
      console.log('Name:', createData.waitlist.name)
    } else {
      console.log('❌ Failed to create waitlist')
      console.log('Status:', createResponse.status)
    }
    
    // Test listing waitlists
    console.log('\n3. Listing waitlists...')
    const listResponse = await fetch(`${API_URL}/waitlists`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (listResponse.ok) {
      const listData = await listResponse.json()
      console.log('✅ Waitlists retrieved successfully')
      console.log('Count:', listData.waitlists.length)
      listData.waitlists.forEach((waitlist, index) => {
        console.log(`  ${index + 1}. ${waitlist.name} (${waitlist.subscriberCount} subscribers)`)
      })
    } else {
      console.log('❌ Failed to list waitlists')
    }
    
    // Test unauthorized access
    console.log('\n4. Testing unauthorized access...')
    const unauthorizedResponse = await fetch(`${API_URL}/waitlists`)
    
    if (unauthorizedResponse.status === 401) {
      console.log('✅ Unauthorized access properly blocked')
    } else {
      console.log('❌ Unauthorized access not properly handled')
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message)
    console.log('Make sure mock server is running: node mock-server.js')
  }
}

testWaitlists()