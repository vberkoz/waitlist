# API Gateway Configuration

## ✅ Configured Features

### CORS (Cross-Origin Resource Sharing)
- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: 
  - Content-Type
  - X-Amz-Date
  - Authorization
  - X-Api-Key
  - X-Amz-Security-Token
- **Allow Credentials**: true
- **Max Age**: 3600 seconds (1 hour)

### Rate Limiting
- **Rate Limit**: 100 requests/second
- **Burst Limit**: 200 requests
- Applied to all endpoints globally

### Monitoring & Logging
- **Metrics Enabled**: true
- **Logging Level**: INFO
- **Data Trace Enabled**: true
- CloudWatch integration for monitoring

### Method Responses
All endpoints configured with standard HTTP status codes:
- **POST endpoints**: 200, 400, 500
- **GET endpoints**: 200, 500

## API Endpoints

**Base URL**: `https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/`

### Waitlists
- `POST /waitlists` - Create waitlist
- `GET /waitlists` - List waitlists

### Subscribers
- `POST /subscribers` - Create subscriber
- `GET /subscribers` - List subscribers

## Testing

Run the test script:
```bash
cd infrastructure
./test-api.sh
```

## Rate Limiting Details

The API Gateway throttles requests at:
- **Steady-state**: 100 requests per second
- **Burst capacity**: 200 requests

When limits are exceeded, API Gateway returns:
- Status Code: `429 Too Many Requests`
- Response: `{"message":"Too Many Requests"}`

## Next Steps
1. Implement API key authentication
2. Add request validation
3. Configure custom domain
4. Set up usage plans for different tiers
