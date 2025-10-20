#!/bin/bash

API_URL="https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/"

echo "Testing API Key Management System"
echo "================================="

# Test 1: Create API key
echo "1. Creating API key..."
RESPONSE=$(curl -s -X POST "${API_URL}auth/apikeys" \
  -H "Content-Type: application/json" \
  -d '{
    "waitlistId": "test-waitlist-123",
    "name": "Test API Key"
  }')

echo "Response: $RESPONSE"

# Extract API key from response
API_KEY=$(echo $RESPONSE | grep -o '"key":"[^"]*' | cut -d'"' -f4)
echo "Generated API Key: $API_KEY"

if [ -z "$API_KEY" ]; then
    echo "Failed to create API key. Exiting."
    exit 1
fi

echo ""

# Test 2: Validate API key
echo "2. Validating API key..."
curl -X POST "${API_URL}auth/validate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Use API key to create subscriber
echo "3. Creating subscriber with API key..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "email": "apikey-test@example.com"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Try with invalid API key
echo "4. Testing with invalid API key..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wl_invalid_key_123" \
  -d '{
    "email": "invalid-test@example.com"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test 5: Try without API key
echo "5. Testing without API key..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "no-key-test@example.com"
  }' \
  -w "\nStatus: %{http_code}\n\n"