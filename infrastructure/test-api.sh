#!/bin/bash

API_URL="https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod"

echo "=== Testing CORS Preflight ==="
curl -X OPTIONS "$API_URL/waitlists" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i -s | grep -E "(access-control|HTTP)"

echo -e "\n\n=== Testing GET /waitlists ==="
curl -X GET "$API_URL/waitlists" -s | jq .

echo -e "\n=== Testing GET /subscribers ==="
curl -X GET "$API_URL/subscribers" -s | jq .

echo -e "\n=== Testing POST /waitlists ==="
curl -X POST "$API_URL/waitlists" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Waitlist"}' \
  -s | jq .

echo -e "\n=== Testing POST /subscribers ==="
curl -X POST "$API_URL/subscribers" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -s | jq .

echo -e "\n=== Rate Limiting Configuration ==="
aws apigateway get-stage --rest-api-id jst5vtct18 --stage-name prod --profile basil \
  --query 'methodSettings."*/*".{throttlingBurstLimit:throttlingBurstLimit,throttlingRateLimit:throttlingRateLimit,metricsEnabled:metricsEnabled,loggingLevel:loggingLevel}' \
  --output json | jq .
