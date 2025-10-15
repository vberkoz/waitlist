## MVP (Minimum Viable Product) - Core Generator & Basic Data Collection

### Frontend Setup & Infrastructure
- [ ] **Project Initialization**
  - Initialize Vite + React + TypeScript project
  - Configure Tailwind CSS with custom design tokens
  - Setup React Router for SPA navigation
  - Configure TanStack Query for API state management
  - Setup React Hook Form + Zod for form validation

### AWS Infrastructure Setup (CDK)
- [ ] **CDK Project Initialization**
  - Initialize AWS CDK project with TypeScript
  - Configure CDK context and environment variables
  - Setup CDK stack structure (networking, storage, compute, api)

- [ ] **Core AWS Services (CDK)**
  - Define DynamoDB tables with CDK constructs (waitlists, subscribers, features)
  - Create Lambda functions with CDK NodejsFunction construct
  - Configure API Gateway REST API with CDK including CORS and rate limiting
  - Define S3 bucket with CDK for static assets and exports
  - Setup CloudFront distribution with CDK for CDN
  - Configure Route53 hosted zone with CDK for domain management
  - Define IAM roles and policies with least privilege access

### Page Generation System
- [ ] **Static Page Generator**
  - Create React component for waitlist page template
  - Build form component with email validation (Zod schema)
  - Implement basic branding customization (colors, fonts, logo)
  - Create static export functionality (HTML/CSS/JS bundle)
  - Setup Vite build process for optimized static output

### Data Collection & API
- [ ] **Backend API Development**
  - Lambda function for email subscription endpoint
  - DynamoDB integration for storing subscriber data
  - Email validation service integration
  - API key generation and validation system
  - CORS configuration for cross-origin requests

### Basic Dashboard
- [ ] **Admin Dashboard**
  - Dashboard layout with React Router navigation
  - Subscriber list view with TanStack Table
  - Basic sorting and filtering functionality
  - CSV export feature using S3 pre-signed URLs
  - Authentication system for dashboard access

### Hosting & Deployment
- [ ] **Platform Hosting (CDK)**
  - CDK construct for CloudFront distribution with S3 origin
  - S3 bucket deployment with CDK BucketDeployment
  - Lambda@Edge functions defined in CDK if needed
  - CDK pipeline for automated infrastructure deployments
  - Environment-specific CDK stacks (dev, staging, prod)