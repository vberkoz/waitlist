// Authentication configuration
export const AUTH_CONFIG = {
  // Set to 'cognito' to use AWS Cognito, 'jwt' for custom JWT auth
  provider: (import.meta.env.VITE_AUTH_PROVIDER as 'cognito' | 'jwt') || 'jwt',
  
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
  }
}