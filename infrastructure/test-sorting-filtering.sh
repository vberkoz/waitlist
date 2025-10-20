#!/bin/bash

API_URL="https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/"

echo "Testing Sorting and Filtering Functionality"
echo "==========================================="

# Test 1: Default sorting (newest first)
echo "1. Default sorting (newest first)..."
curl -X GET "${API_URL}subscribers?waitlistId=test-waitlist-123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Sort oldest first
echo "2. Sort oldest first..."
curl -X GET "${API_URL}subscribers?waitlistId=test-waitlist-123&sortOrder=asc" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Filter by email search
echo "3. Filter by email search (test)..."
curl -X GET "${API_URL}subscribers?waitlistId=test-waitlist-123&search=test" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Filter by email search (apikey)
echo "4. Filter by email search (apikey)..."
curl -X GET "${API_URL}subscribers?waitlistId=test-waitlist-123&search=apikey" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"