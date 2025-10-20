#!/bin/bash

API_URL="https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/"

echo "Testing Subscribers List Functionality"
echo "======================================"

# Test 1: List subscribers for test waitlist
echo "1. Listing subscribers for test-waitlist-123..."
curl -X GET "${API_URL}subscribers?waitlistId=test-waitlist-123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: List subscribers with limit
echo "2. Listing subscribers with limit=2..."
curl -X GET "${API_URL}subscribers?waitlistId=test-waitlist-123&limit=2" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: List subscribers for non-existent waitlist
echo "3. Listing subscribers for non-existent waitlist..."
curl -X GET "${API_URL}subscribers?waitlistId=non-existent-waitlist" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"