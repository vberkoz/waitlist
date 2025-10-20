#!/bin/bash

# Get the API URL from CDK outputs
API_URL=$(aws cloudformation describe-stacks --stack-name WaitlistApiStack --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)

if [ -z "$API_URL" ]; then
    echo "Error: Could not find API URL. Make sure the stack is deployed."
    exit 1
fi

echo "Testing subscriber creation endpoint: ${API_URL}subscribers"

# Test valid request
echo "Testing valid subscriber creation..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "waitlistId": "test-waitlist-123"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test invalid email
echo "Testing invalid email..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "waitlistId": "test-waitlist-123"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test missing waitlistId
echo "Testing missing waitlistId..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test empty body
echo "Testing empty body..."
curl -X POST "${API_URL}subscribers" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"