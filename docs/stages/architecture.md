# Waitlist Platform - System Architecture

## Overview
A serverless, high-performance waitlist management platform built with React frontend and AWS serverless backend, enabling instant page generation, visitor engagement, and viral growth features.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Admin Dashboard (React)    │    Generated Waitlist Pages       │
│  - Vite + TypeScript        │    - Static HTML/CSS/JS           │
│  - TanStack Query           │    - Embedded data collection     │
│  - React Router             │    - Optimized for Core Web Vitals│
└──────────────┬──────────────┴────────────────┬──────────────────┘
               │                                │
               │ HTTPS                          │ HTTPS
               ▼                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                      CDN & Edge Layer                             │
├──────────────────────────────────────────────────────────────────┤
│  CloudFront Distribution                                          │
│  - Global edge locations                                          │
│  - SSL/TLS termination                                           │
│  - Caching strategy                                              │
│  - Custom domain support (Route53)                               │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                            │
├──────────────────────────────────────────────────────────────────┤
│  API Gateway REST API                                             │
│  - Request validation                                             │
│  - Rate limiting & throttling                                     │
│  - API key authentication                                         │
│  - CORS configuration                                             │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Compute Layer                                │
├──────────────────────────────────────────────────────────────────┤
│  Lambda Functions (Node.js/TypeScript)                            │
│  ┌────────────────┬────────────────┬─────────────────┐          │
│  │ Waitlist API   │ Subscriber API │ Feature API     │          │
│  │ - CRUD ops     │ - Email collect│ - Voting system │          │
│  │ - Page gen     │ - Validation   │ - Comments      │          │
│  └────────────────┴────────────────┴─────────────────┘          │
│  ┌────────────────┬────────────────┬─────────────────┐          │
│  │ Referral API   │ Analytics API  │ Integration API │          │
│  │ - Tracking     │ - Metrics      │ - Webhooks      │          │
│  │ - Rewards      │ - Reporting    │ - 3rd party     │          │
│  └────────────────┴────────────────┴─────────────────┘          │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Data Layer                                   │
├──────────────────────────────────────────────────────────────────┤
│  DynamoDB Tables                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Waitlists: PK=waitlistId                                │    │
│  │ - config, domain, branding, created_at                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Subscribers: PK=subscriberId, GSI=waitlistId            │    │
│  │ - email, metadata, hot_score, referral_code             │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Features: PK=featureId, GSI=waitlistId                  │    │
│  │ - title, description, votes, status, demand_index       │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Comments: PK=commentId, GSI=featureId                   │    │
│  │ - content, author, timestamp, moderation_status         │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Referrals: PK=referralId, GSI=referrerId                │    │
│  │ - referred_email, tier, rewards, conversion_status      │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      Storage Layer                                │
├──────────────────────────────────────────────────────────────────┤
│  S3 Buckets                                                       │
│  - Static assets (logos, images)                                 │
│  - Generated page exports                                         │
│  - CSV exports                                                    │
│  - Template library                                               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   Monitoring & Logging                            │
├──────────────────────────────────────────────────────────────────┤
│  CloudWatch                                                       │
│  - Lambda logs & metrics                                          │
│  - API Gateway metrics                                            │
│  - Custom dashboards                                              │
│  - Alarms & notifications                                         │
└──────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Deployment**: S3 + CloudFront

### Backend
- **Runtime**: Node.js (AWS Lambda)
- **Language**: TypeScript
- **API**: API Gateway REST API
- **Database**: DynamoDB
- **Storage**: S3
- **CDN**: CloudFront
- **DNS**: Route53
- **IaC**: AWS CDK (TypeScript)

### Infrastructure as Code
- **AWS CDK Stacks**:
  - InfrastructureStack: VPC, security groups
  - StorageStack: DynamoDB, S3
  - ComputeStack: Lambda functions, layers
  - ApiStack: API Gateway, authorizers
  - FrontendStack: CloudFront, Route53
  - MonitoringStack: CloudWatch dashboards

## Data Flow

### 1. Waitlist Page Generation Flow
```
Admin Dashboard → API Gateway → Lambda (Page Generator)
                                    ↓
                              DynamoDB (Save Config)
                                    ↓
                              S3 (Store Static Files)
                                    ↓
                              CloudFront (Distribute)
```

### 2. Visitor Subscription Flow
```
Waitlist Page → API Gateway → Lambda (Subscriber Handler)
                                    ↓
                              Email Validation Service
                                    ↓
                              DynamoDB (Store Subscriber)
                                    ↓
                              Response (Success/Error)
```

### 3. Feature Voting Flow
```
Visitor Action → API Gateway → Lambda (Vote Handler)
                                    ↓
                              DynamoDB (Update Vote Count)
                                    ↓
                              TanStack Query (Cache Update)
```

### 4. Referral Tracking Flow
```
Referral Link → CloudFront → Lambda (Referral Tracker)
                                    ↓
                              DynamoDB (Track Referral)
                                    ↓
                              Lambda (Reward Calculator)
                                    ↓
                              DynamoDB (Update Tier/Rewards)
```

## API Architecture

### REST API Endpoints

**Waitlist Management**
- `POST /api/waitlists` - Create new waitlist
- `GET /api/waitlists/{id}` - Get waitlist details
- `PUT /api/waitlists/{id}` - Update waitlist config
- `DELETE /api/waitlists/{id}` - Delete waitlist

**Subscriber Management**
- `POST /api/subscribers` - Add subscriber
- `GET /api/subscribers?waitlistId={id}` - List subscribers
- `GET /api/subscribers/{id}` - Get subscriber details
- `DELETE /api/subscribers/{id}` - Remove subscriber
- `GET /api/subscribers/export?waitlistId={id}` - Export CSV

**Feature Management**
- `POST /api/features` - Create feature
- `GET /api/features?waitlistId={id}` - List features
- `POST /api/features/{id}/vote` - Vote on feature
- `DELETE /api/features/{id}/vote` - Remove vote

**Comments**
- `POST /api/comments` - Add comment
- `GET /api/comments?featureId={id}` - List comments
- `PUT /api/comments/{id}/moderate` - Moderate comment

**Referrals**
- `POST /api/referrals` - Track referral
- `GET /api/referrals/{referrerId}` - Get referral stats
- `GET /api/referrals/{referrerId}/rewards` - Get rewards

**Analytics**
- `GET /api/analytics/waitlist/{id}` - Waitlist metrics
- `GET /api/analytics/features/{id}` - Feature engagement
- `GET /api/analytics/referrals/{id}` - Referral performance

**Integrations**
- `POST /api/integrations/mailchimp` - Sync with Mailchimp
- `POST /api/integrations/convertkit` - Sync with ConvertKit
- `POST /api/integrations/webhooks` - Custom webhooks

## Security Architecture

### Authentication & Authorization
- API key-based authentication for all endpoints
- JWT tokens for admin dashboard sessions
- IAM roles with least privilege for Lambda functions
- Resource-based policies for S3 and DynamoDB

### Data Protection
- Encryption at rest (DynamoDB, S3)
- Encryption in transit (TLS 1.2+)
- API Gateway request validation
- Input sanitization with Zod schemas
- Rate limiting and throttling

### Network Security
- CloudFront with AWS WAF integration
- API Gateway with resource policies
- VPC endpoints for private AWS service access
- Security groups and NACLs

## Scalability & Performance

### Auto-Scaling
- Lambda concurrent execution limits
- DynamoDB on-demand capacity mode
- CloudFront edge caching
- API Gateway throttling limits

### Optimization Strategies
- DynamoDB GSI for efficient queries
- S3 pre-signed URLs for direct uploads
- CloudFront cache behaviors
- Lambda function optimization (cold starts, memory)
- TanStack Query caching strategy

### Performance Targets
- Page load time: < 2s (Core Web Vitals)
- API response time: < 200ms (p95)
- Lambda cold start: < 1s
- DynamoDB read/write latency: < 10ms

## Monitoring & Observability

### Metrics
- Lambda invocations, duration, errors
- API Gateway requests, latency, 4xx/5xx errors
- DynamoDB consumed capacity, throttles
- CloudFront cache hit ratio, requests

### Logging
- CloudWatch Logs for all Lambda functions
- API Gateway access logs
- Structured logging with correlation IDs
- Log retention policies

### Alerting
- Lambda error rate threshold
- API Gateway 5xx error rate
- DynamoDB throttling events
- CloudFront origin errors

## Deployment Strategy

### CI/CD Pipeline
```
Code Push → GitHub Actions → CDK Synth → CDK Deploy
                                    ↓
                              CloudFormation Stack Update
                                    ↓
                              Automated Testing
                                    ↓
                              Production Deployment
```

### Environments
- **Development**: Feature testing, rapid iteration
- **Staging**: Pre-production validation
- **Production**: Live customer-facing environment

### Rollback Strategy
- CloudFormation stack rollback on failure
- Lambda function versioning and aliases
- Blue-green deployment for zero downtime
- Feature flags for gradual rollout

## Cost Optimization

### Strategies
- DynamoDB on-demand for variable workloads
- Lambda memory optimization
- CloudFront caching to reduce origin requests
- S3 lifecycle policies for old exports
- Reserved capacity for predictable workloads

### Cost Monitoring
- AWS Cost Explorer integration
- Budget alerts and thresholds
- Resource tagging for cost allocation
- Regular cost optimization reviews
