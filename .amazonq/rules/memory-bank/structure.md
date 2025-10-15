# Project Structure

## Workspace Organization
Monorepo structure with npm workspaces containing four main packages:

```
waitlist/
├── frontend/          # React + Vite admin dashboard
├── backend/           # Lambda functions and business logic
├── infrastructure/    # AWS CDK infrastructure definitions
└── shared/           # Shared types and schemas
```

## Frontend Structure
**Location**: `/frontend/`

React-based admin dashboard with TypeScript:
- `src/app/` - Application root and routing configuration
- `src/pages/` - Page-level components (dashboard, waitlist management)
- `src/features/` - Feature-specific modules with hooks and components
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and API clients
- `src/styles/` - Global styles and Tailwind configuration

**Key Technologies**:
- Vite for build tooling and dev server
- React Router for SPA navigation
- TanStack Query for API state management
- React Hook Form + Zod for form validation
- Tailwind CSS for styling

## Backend Structure
**Location**: `/backend/`

Serverless Lambda functions with TypeScript:
- `src/functions/` - Lambda function handlers
- `src/services/` - Business logic layer
- `src/repositories/` - Data access layer (DynamoDB)
- `src/lib/` - Shared utilities and helpers
- `src/types/` - TypeScript type definitions
- `src/constants/` - Application constants

**Architecture Pattern**: Layered architecture with separation of concerns
- Functions handle HTTP requests/responses
- Services contain business logic
- Repositories manage data persistence

## Infrastructure Structure
**Location**: `/infrastructure/`

AWS CDK infrastructure as code:
- `bin/app.ts` - CDK app entry point
- `lib/stacks/` - CloudFormation stack definitions
  - Storage Stack (DynamoDB, S3)
  - Compute Stack (Lambda functions)
  - API Stack (API Gateway)
- `lib/config/` - Environment-specific configurations

**Stack Organization**:
- Modular stacks for independent deployment
- Shared constructs for reusable patterns
- Environment-based configuration (dev, staging, prod)

## Shared Structure
**Location**: `/shared/`

Common code shared across packages:
- `schemas/` - Zod validation schemas
- `types/` - TypeScript interfaces and types

**Purpose**: Single source of truth for data contracts between frontend and backend

## Core Components & Relationships

### Data Flow Architecture
```
Admin Dashboard (React) → API Gateway → Lambda Functions → DynamoDB
                                                         → S3
Generated Pages → API Gateway → Lambda Functions → DynamoDB
```

### Key Relationships
- Frontend consumes backend APIs via TanStack Query
- Backend functions use shared types/schemas for validation
- Infrastructure CDK stacks deploy backend Lambda functions
- Shared package provides type safety across all layers

## Architectural Patterns

### Frontend Patterns
- Feature-based organization (features contain hooks, components, types)
- Custom hooks for data fetching and state management
- Component composition with reusable UI primitives
- Route-based code splitting

### Backend Patterns
- Serverless microservices architecture
- Repository pattern for data access abstraction
- Service layer for business logic encapsulation
- Dependency injection for testability

### Infrastructure Patterns
- Infrastructure as Code with AWS CDK
- Stack separation by concern (storage, compute, api)
- Environment-specific configuration management
- Resource tagging for cost allocation

## Database Schema (DynamoDB)

### Tables
- **Waitlists**: PK=waitlistId - Configuration, branding, domain settings
- **Subscribers**: PK=subscriberId, GSI=waitlistId - Email, metadata, hot score, referral code
- **Features**: PK=featureId, GSI=waitlistId - Title, description, votes, demand index
- **Comments**: PK=commentId, GSI=featureId - Content, author, moderation status
- **Referrals**: PK=referralId, GSI=referrerId - Referred email, tier, rewards

### Access Patterns
- Query subscribers by waitlist (GSI on waitlistId)
- Query features by waitlist (GSI on waitlistId)
- Query comments by feature (GSI on featureId)
- Query referrals by referrer (GSI on referrerId)
