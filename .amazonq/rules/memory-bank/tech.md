# Technology Stack

## Programming Languages
- **TypeScript**: Primary language across all packages (~5.6.2)
- **Node.js**: Runtime for backend Lambda functions and build tools

## Frontend Technologies

### Core Framework
- **React**: 18.3.1 - UI library
- **React DOM**: 18.3.1 - DOM rendering
- **Vite**: 6.0.1 - Build tool and dev server

### Routing & State
- **React Router DOM**: 7.1.3 - SPA routing and navigation
- **TanStack Query**: 5.62.14 - Server state management and caching

### Forms & Validation
- **React Hook Form**: 7.54.2 - Form state management
- **@hookform/resolvers**: 3.9.1 - Validation resolver integration
- **Zod**: 3.24.1 - Schema validation

### Styling
- **Tailwind CSS**: 4.1.14 - Utility-first CSS framework
- **@tailwindcss/vite**: 4.1.14 - Vite plugin for Tailwind

### Build Tools
- **@vitejs/plugin-react**: 4.3.4 - React support for Vite
- **TypeScript**: ~5.6.2 - Type checking and compilation

## Backend Technologies

### Runtime & Language
- **AWS Lambda**: Serverless compute (Node.js runtime)
- **TypeScript**: ~5.6.2 - Type-safe backend development

### AWS Services
- **DynamoDB**: NoSQL database for all data storage
- **S3**: Object storage for static assets and exports
- **API Gateway**: REST API management
- **CloudFront**: CDN for global content delivery
- **Route53**: DNS management for custom domains
- **CloudWatch**: Logging and monitoring

## Infrastructure Technologies

### Infrastructure as Code
- **AWS CDK**: 2.133.0 - Cloud Development Kit for TypeScript
- **aws-cdk-lib**: 2.133.0 - CDK construct library
- **constructs**: 10.3.0 - CDK constructs framework

### Build Tools
- **TypeScript**: ~5.6.2 - CDK code compilation
- **ts-node**: 10.9.2 - TypeScript execution for CDK
- **source-map-support**: 0.5.21 - Stack trace support

## Development Commands

### Workspace Level
```bash
npm run dev                 # Start frontend dev server
npm run build              # Build all workspaces
npm run frontend:dev       # Start frontend dev server
npm run frontend:build     # Build frontend only
```

### Frontend Package
```bash
npm run dev --workspace=frontend        # Start Vite dev server
npm run build --workspace=frontend      # Build for production
npm run preview --workspace=frontend    # Preview production build
```

### Infrastructure Package
```bash
npm run build --workspace=infrastructure    # Compile TypeScript
npm run watch --workspace=infrastructure    # Watch mode compilation
npm run cdk --workspace=infrastructure      # Run CDK CLI commands
```

## Build System
- **Monorepo**: npm workspaces for multi-package management
- **Module Type**: ESM (type: "module" in frontend)
- **TypeScript Configs**: Separate configs for app and node code
  - `tsconfig.app.json` - Application code configuration
  - `tsconfig.node.json` - Build tool configuration
  - `tsconfig.json` - Base configuration

## Development Environment

### Required Tools
- Node.js (compatible with npm workspaces)
- npm (workspace support)
- AWS CLI (for CDK deployments)
- AWS credentials configured

### Environment Variables
- Frontend: `.env.example` template provided
- Infrastructure: `.env.example` template provided

## Deployment Architecture

### Frontend Deployment
- Build: Vite production build
- Host: S3 bucket with CloudFront distribution
- CDN: Global edge locations via CloudFront

### Backend Deployment
- Package: Lambda functions bundled with dependencies
- Deploy: AWS CDK CloudFormation stacks
- Runtime: Node.js Lambda environment

### Infrastructure Deployment
- Tool: AWS CDK CLI
- Method: CloudFormation stack updates
- Environments: Dev, staging, production stacks

## Performance Targets
- Page load time: < 2s (Core Web Vitals)
- API response time: < 200ms (p95)
- Lambda cold start: < 1s
- DynamoDB latency: < 10ms

## Security Features
- TLS 1.2+ encryption in transit
- DynamoDB and S3 encryption at rest
- API key authentication
- Rate limiting and throttling
- Input validation with Zod schemas
- IAM least privilege policies
