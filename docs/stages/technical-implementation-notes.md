### CDK Stack Architecture
- **InfrastructureStack**: Core resources (VPC, security groups if needed)
- **StorageStack**: DynamoDB tables, S3 buckets
- **ComputeStack**: Lambda functions, Lambda layers
- **ApiStack**: API Gateway, authorizers, integrations
- **FrontendStack**: CloudFront, S3 deployment, Route53
- **MonitoringStack**: CloudWatch dashboards, alarms, logs

### CDK Best Practices
- Use CDK constructs for reusable infrastructure patterns
- Implement proper tagging strategy for all resources
- Define removal policies for stateful resources
- Use CDK aspects for cross-cutting concerns
- Implement CDK testing with assertions
- Version control CDK synthesized templates

### Database Schema (DynamoDB)
- **Waitlists Table**: PK: waitlistId, attributes: config, domain, created_at
- **Subscribers Table**: PK: subscriberId, GSI: waitlistId, attributes: email, metadata, hot_score
- **Features Table**: PK: featureId, GSI: waitlistId, attributes: title, votes, status
- **Comments Table**: PK: commentId, GSI: featureId, attributes: content, author, timestamp
- **Referrals Table**: PK: referralId, GSI: referrerId, attributes: referred_email, tier, rewards

### API Endpoints Structure
- `/api/waitlists` - CRUD operations for waitlist management
- `/api/subscribers` - Subscription and subscriber management
- `/api/features` - Feature management and voting
- `/api/comments` - Comment system endpoints
- `/api/referrals` - Referral tracking and management
- `/api/integrations` - Third-party service integrations
- `/api/analytics` - Analytics data endpoints

### Security Considerations
- API key authentication for all endpoints
- Rate limiting on public endpoints
- Input validation using Zod schemas
- CORS configuration for cross-origin requests
- Data encryption at rest and in transit
- Regular security audits and updates