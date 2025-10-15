# Lambda Functions with CDK NodejsFunction

## Overview
Lambda functions are now configured using the CDK `NodejsFunction` construct, which provides automatic TypeScript bundling and optimized deployment.

## Created Lambda Handlers

### Waitlist Functions
- **Create Waitlist**: `backend/src/functions/waitlists/create.ts`
- **List Waitlists**: `backend/src/functions/waitlists/list.ts`

### Subscriber Functions
- **Create Subscriber**: `backend/src/functions/subscribers/create.ts`
- **List Subscribers**: `backend/src/functions/subscribers/list.ts`

## CDK Configuration

### NodejsFunction Benefits
- Automatic TypeScript compilation and bundling
- Tree-shaking for smaller bundle sizes
- Source map support for debugging
- Automatic dependency resolution

### Compute Stack Updates
The `ComputeStack` now uses `NodejsFunction` instead of inline Lambda functions:

```typescript
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

new NodejsFunction(this, 'CreateWaitlistFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  entry: path.join(__dirname, '../../../backend/src/functions/waitlists/create.ts'),
  handler: 'handler',
  environment: {
    TABLE_NAME: props.table.tableName
  }
})
```

## Dependencies
- `@aws-cdk/aws-lambda-nodejs`: ^1.203.0 (added to infrastructure package)
- `@types/node`: ^20.19.21 (for TypeScript type definitions)

## Build Configuration
Updated `infrastructure/tsconfig.json` to reference root workspace `node_modules` for type definitions in monorepo setup.

## Next Steps
1. Implement business logic in Lambda handlers
2. Add DynamoDB operations using repositories
3. Add input validation with Zod schemas
4. Configure API Gateway routes in API Stack
