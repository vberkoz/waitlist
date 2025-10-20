#!/bin/bash

API_URL="https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/"

echo "Testing CSV Export Functionality"
echo "================================"

# Test 1: Export subscribers for test waitlist
echo "1. Exporting subscribers for test-waitlist-123..."
RESPONSE=$(curl -s -X POST "${API_URL}subscribers/export?waitlistId=test-waitlist-123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}")

echo "Response: $RESPONSE"

# Extract download URL from response
DOWNLOAD_URL=$(echo "$RESPONSE" | grep -o '"downloadUrl":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$DOWNLOAD_URL" ]; then
    echo ""
    echo "2. Testing download URL..."
    curl -s -I "$DOWNLOAD_URL" | head -5
    
    echo ""
    echo "3. Downloading CSV content (first 200 chars)..."
    curl -s "$DOWNLOAD_URL" | head -c 200
    echo ""
else
    echo "No download URL found in response"
fi