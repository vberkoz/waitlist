# Authentication System Implementation

## Overview
The waitlist platform supports two authentication methods:
1. **Custom JWT Authentication** - Simple email/password with JWT tokens
2. **AWS Cognito Authentication** - Managed authentication service with custom login UI

## Implementation Details

### 1. Custom JWT Authentication (Default)

**Backend Functions:**
- `backend/src/functions/auth/login.ts` - Email/password login with JWT generation
- `backend/src/functions/auth/verify.ts` - JWT token verification

**Frontend Hooks:**
- `frontend/src/features/auth/hooks/useAuth.ts` - Login, logout, user verification hooks
- `frontend/src/pages/auth/LoginPage.tsx` - Custom login form

**Configuration:**
- Admin email: `admin@waitlist.com`
- Admin password: `admin123` (SHA-256 hashed)
- JWT secret: Configurable via environment variable

### 2. AWS Cognito Authentication

**Backend Functions:**
- `backend/src/functions/auth/cognito-login.ts` - Cognito authentication
- `backend/src/functions/auth/cognito-verify.ts` - Cognito token verification

**Frontend Hooks:**
- `frontend/src/features/auth/hooks/useCognitoAuth.ts` - Cognito-specific auth hooks
- `frontend/src/pages/auth/CognitoLoginPage.tsx` - Custom UI for Cognito login

**Infrastructure:**
- `infrastructure/lib/stacks/cognito-stack.ts` - User Pool and Client setup
- User Pool configured for email sign-in
- Admin user created automatically: `admin@waitlist.com`

## Benefits of Cognito Approach

### Security
- ✅ Managed password policies and encryption
- ✅ Built-in protection against common attacks
- ✅ Automatic token rotation and validation
- ✅ MFA support (can be enabled)
- ✅ Account lockout and rate limiting

### Scalability
- ✅ Handles millions of users without infrastructure management
- ✅ Global availability and performance
- ✅ Automatic scaling based on demand

### Compliance
- ✅ SOC, PCI DSS, ISO 27001 compliant
- ✅ GDPR and HIPAA eligible
- ✅ Built-in audit logging

### Features
- ✅ Password reset flows
- ✅ Email verification
- ✅ Social identity providers (can be added)
- ✅ Custom attributes and user groups
- ✅ Advanced security features (risk-based authentication)

## Custom Login Screen with Cognito

The implementation maintains the custom login UI while using Cognito for authentication:

```typescript
// Custom login form calls Cognito APIs
const loginMutation = useCognitoLogin()

const onSubmit = (data: LoginData) => {
  loginMutation.mutate(data, {
    onSuccess: () => navigate('/')
  })
}
```

**Key Advantages:**
- ✅ Full control over UI/UX
- ✅ Consistent branding
- ✅ Custom validation and error handling
- ✅ Integration with existing design system
- ✅ No redirect to Cognito hosted UI

## Configuration

### Environment Variables

**For Custom JWT:**
```env
VITE_AUTH_PROVIDER=jwt
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

**For Cognito:**
```env
VITE_AUTH_PROVIDER=cognito
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_AWS_REGION=us-east-1
```

## Deployment

### Custom JWT (Current Default)
```bash
npx cdk deploy --all --profile basil
```

### Cognito (Recommended for Production)
```bash
# Deploy Cognito stack first
npx cdk deploy WaitlistCognitoStack --profile basil

# Then deploy other stacks
npx cdk deploy --all --profile basil
```

## Testing

### Local Testing with Mock Server
```bash
# Start mock server
node mock-server.js

# Test authentication
node test-auth-local.js
```

### Production Testing
```bash
# Update API URL in test script
node test-auth.js
```

## Recommendation

**Use AWS Cognito for production** due to:
- Enterprise-grade security
- Compliance certifications
- Managed infrastructure
- Advanced features (MFA, risk detection)
- Cost-effective at scale

The custom JWT approach is suitable for:
- Development and testing
- Simple use cases
- When you need full control over authentication logic