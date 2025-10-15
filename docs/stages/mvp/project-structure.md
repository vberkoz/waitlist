# MVP Project Structure

## Repository Layout

```
waitlist/
├── frontend/                      # React Admin Dashboard & Page Generator
│   ├── src/
│   │   ├── app/                  # App configuration
│   │   │   ├── App.tsx
│   │   │   ├── router.tsx        # React Router setup
│   │   │   └── providers.tsx     # TanStack Query provider
│   │   │
│   │   ├── pages/                # Route pages
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── waitlists/
│   │   │   │   ├── WaitlistsPage.tsx
│   │   │   │   ├── CreateWaitlistPage.tsx
│   │   │   │   └── PreviewWaitlistPage.tsx
│   │   │   ├── subscribers/
│   │   │   │   └── SubscribersPage.tsx
│   │   │   └── auth/
│   │   │       └── LoginPage.tsx
│   │   │
│   │   ├── components/           # Reusable components
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── ui/               # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── forms/
│   │   │   │   ├── WaitlistForm.tsx
│   │   │   │   └── BrandingForm.tsx
│   │   │   └── waitlist/
│   │   │       ├── WaitlistPreview.tsx
│   │   │       ├── StatsCard.tsx
│   │   │       └── WaitlistCard.tsx
│   │   │
│   │   ├── features/             # Feature-specific logic
│   │   │   ├── waitlists/
│   │   │   │   ├── api.ts        # API calls
│   │   │   │   ├── hooks.ts      # TanStack Query hooks
│   │   │   │   ├── types.ts
│   │   │   │   └── schema.ts     # Zod schemas
│   │   │   ├── subscribers/
│   │   │   │   ├── api.ts
│   │   │   │   ├── hooks.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── schema.ts
│   │   │   └── auth/
│   │   │       ├── api.ts
│   │   │       ├── hooks.ts
│   │   │       └── types.ts
│   │   │
│   │   ├── lib/                  # Utilities & configs
│   │   │   ├── api-client.ts     # Axios/fetch wrapper
│   │   │   ├── query-client.ts   # TanStack Query config
│   │   │   └── utils.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── tailwind.css
│   │   │
│   │   └── main.tsx              # Entry point
│   │
│   ├── public/
│   │   └── assets/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                       # AWS Lambda Functions
│   ├── src/
│   │   ├── functions/            # Lambda handlers
│   │   │   ├── waitlists/
│   │   │   │   ├── create.ts
│   │   │   │   ├── get.ts
│   │   │   │   ├── update.ts
│   │   │   │   ├── delete.ts
│   │   │   │   └── list.ts
│   │   │   ├── subscribers/
│   │   │   │   ├── create.ts
│   │   │   │   ├── list.ts
│   │   │   │   ├── delete.ts
│   │   │   │   └── export.ts
│   │   │   └── auth/
│   │   │       ├── login.ts
│   │   │       └── validate.ts
│   │   │
│   │   ├── services/             # Business logic
│   │   │   ├── waitlist.service.ts
│   │   │   ├── subscriber.service.ts
│   │   │   ├── email-validation.service.ts
│   │   │   └── export.service.ts
│   │   │
│   │   ├── repositories/         # Data access layer
│   │   │   ├── waitlist.repository.ts
│   │   │   ├── subscriber.repository.ts
│   │   │   └── base.repository.ts
│   │   │
│   │   ├── lib/                  # Shared utilities
│   │   │   ├── dynamodb.ts       # DynamoDB client
│   │   │   ├── s3.ts             # S3 client
│   │   │   ├── api-response.ts   # Response formatter
│   │   │   └── validators.ts     # Input validation
│   │   │
│   │   ├── types/                # TypeScript types
│   │   │   ├── waitlist.types.ts
│   │   │   ├── subscriber.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   └── constants/
│   │       └── index.ts
│   │
│   ├── tsconfig.json
│   └── package.json
│
├── infrastructure/                # AWS CDK
│   ├── bin/
│   │   └── app.ts                # CDK app entry
│   │
│   ├── lib/
│   │   ├── stacks/
│   │   │   ├── storage-stack.ts  # DynamoDB, S3
│   │   │   ├── compute-stack.ts  # Lambda functions
│   │   │   ├── api-stack.ts      # API Gateway
│   │   │   └── frontend-stack.ts # CloudFront, Route53
│   │   │
│   │   ├── constructs/           # Reusable CDK constructs
│   │   │   ├── lambda-function.ts
│   │   │   ├── dynamodb-table.ts
│   │   │   └── api-endpoint.ts
│   │   │
│   │   └── config/
│   │       ├── dev.ts
│   │       ├── staging.ts
│   │       └── prod.ts
│   │
│   ├── cdk.json
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                        # Shared types & utilities
│   ├── types/
│   │   ├── waitlist.ts
│   │   ├── subscriber.ts
│   │   └── api.ts
│   └── schemas/
│       ├── waitlist.schema.ts
│       └── subscriber.schema.ts
│
├── docs/
│   ├── stages/
│   │   └── mvp/
│   │       ├── tasks.md
│   │       ├── wireframes.md
│   │       └── project-structure.md
│   ├── architecture.md
│   └── api.md
│
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       ├── backend-deploy.yml
│       └── infrastructure-deploy.yml
│
├── .gitignore
├── README.md
└── package.json                   # Root workspace config
```

## Frontend Structure Details

### Pages Mapping (React Router)

```typescript
// router.tsx
{
  path: '/',
  element: <Layout />,
  children: [
    { path: '/', element: <DashboardPage /> },           // Dashboard home
    { path: '/waitlists', element: <WaitlistsPage /> },  // List waitlists
    { path: '/waitlists/create', element: <CreateWaitlistPage /> },
    { path: '/waitlists/:id/preview', element: <PreviewWaitlistPage /> },
    { path: '/subscribers', element: <SubscribersPage /> },
  ]
}
```

### Component Hierarchy

```
Layout
├── Sidebar
│   ├── Logo
│   └── Navigation
│       ├── DashboardLink
│       ├── WaitlistsLink
│       ├── SubscribersLink
│       └── SettingsLink
└── Header
    ├── ProfileMenu
    └── LogoutButton

DashboardPage
├── StatsCard (x4)
└── WaitlistCard (list)

CreateWaitlistPage
├── WaitlistForm (Step 1)
│   ├── Input (name)
│   ├── Textarea (description)
│   └── BrandingForm
│       ├── ColorPicker
│       └── FileUpload
└── PreviewWaitlistPage (Step 2)
    ├── WaitlistPreview
    │   ├── DesktopView
    │   └── MobileView
    └── HostingOptions

SubscribersPage
├── SearchBar
├── FilterDropdown
├── ExportButton
└── Table (TanStack Table)
    ├── EmailColumn
    ├── DateColumn
    └── ActionsColumn
```

## Backend Structure Details

### Lambda Functions

```typescript
// functions/waitlists/create.ts
export const handler = async (event: APIGatewayProxyEvent) => {
  // Validate input
  // Call service layer
  // Return response
}

// functions/subscribers/create.ts
export const handler = async (event: APIGatewayProxyEvent) => {
  // Validate email
  // Store in DynamoDB
  // Return success
}
```

### Service Layer Pattern

```typescript
// services/waitlist.service.ts
export class WaitlistService {
  constructor(private repository: WaitlistRepository) {}
  
  async create(data: CreateWaitlistDto): Promise<Waitlist> {}
  async getById(id: string): Promise<Waitlist> {}
  async update(id: string, data: UpdateWaitlistDto): Promise<Waitlist> {}
  async delete(id: string): Promise<void> {}
  async list(): Promise<Waitlist[]> {}
}
```

### Repository Pattern

```typescript
// repositories/waitlist.repository.ts
export class WaitlistRepository {
  constructor(private dynamodb: DynamoDBClient) {}
  
  async create(item: Waitlist): Promise<Waitlist> {}
  async findById(id: string): Promise<Waitlist | null> {}
  async update(id: string, updates: Partial<Waitlist>): Promise<Waitlist> {}
  async delete(id: string): Promise<void> {}
  async findAll(): Promise<Waitlist[]> {}
}
```

## Infrastructure Structure Details

### CDK Stack Organization

```typescript
// bin/app.ts
const app = new cdk.App();

const storageStack = new StorageStack(app, 'StorageStack');
const computeStack = new ComputeStack(app, 'ComputeStack', {
  tables: storageStack.tables
});
const apiStack = new ApiStack(app, 'ApiStack', {
  functions: computeStack.functions
});
const frontendStack = new FrontendStack(app, 'FrontendStack', {
  api: apiStack.api
});
```

### Storage Stack

```typescript
// lib/stacks/storage-stack.ts
export class StorageStack extends cdk.Stack {
  public readonly tables: {
    waitlists: dynamodb.Table;
    subscribers: dynamodb.Table;
  };
  
  public readonly buckets: {
    assets: s3.Bucket;
    exports: s3.Bucket;
  };
}
```

### Compute Stack

```typescript
// lib/stacks/compute-stack.ts
export class ComputeStack extends cdk.Stack {
  public readonly functions: {
    createWaitlist: lambda.Function;
    getWaitlist: lambda.Function;
    createSubscriber: lambda.Function;
    listSubscribers: lambda.Function;
    exportSubscribers: lambda.Function;
  };
}
```

### API Stack

```typescript
// lib/stacks/api-stack.ts
export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    // Create API Gateway
    // Add resources and methods
    // Configure CORS
    // Add rate limiting
  }
}
```

## Data Models

### DynamoDB Tables

```typescript
// Waitlists Table
{
  TableName: 'Waitlists',
  KeySchema: [
    { AttributeName: 'waitlistId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'waitlistId', AttributeType: 'S' }
  ]
}

// Subscribers Table
{
  TableName: 'Subscribers',
  KeySchema: [
    { AttributeName: 'subscriberId', KeyType: 'HASH' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'WaitlistIdIndex',
      KeySchema: [
        { AttributeName: 'waitlistId', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' }
      ]
    }
  ]
}
```

### TypeScript Types

```typescript
// shared/types/waitlist.ts
export interface Waitlist {
  waitlistId: string;
  name: string;
  description: string;
  branding: {
    primaryColor: string;
    logoUrl?: string;
  };
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

// shared/types/subscriber.ts
export interface Subscriber {
  subscriberId: string;
  waitlistId: string;
  email: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
```

## Configuration Files

### Frontend (vite.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/lib': path.resolve(__dirname, './src/lib'),
    }
  }
});
```

### Tailwind (tailwind.config.js)

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
};
```

### Backend (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@/services/*": ["./src/services/*"],
      "@/repositories/*": ["./src/repositories/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

## Environment Variables

### Frontend (.env)

```bash
VITE_API_URL=https://api.waitlist.app
VITE_API_KEY=your-api-key
```

### Backend (Lambda Environment)

```bash
DYNAMODB_WAITLISTS_TABLE=Waitlists
DYNAMODB_SUBSCRIBERS_TABLE=Subscribers
S3_ASSETS_BUCKET=waitlist-assets
S3_EXPORTS_BUCKET=waitlist-exports
EMAIL_VALIDATION_API_KEY=your-key
```

### Infrastructure (CDK Context)

```json
{
  "env": {
    "account": "123456789012",
    "region": "us-east-1"
  },
  "domain": "waitlist.app",
  "certificateArn": "arn:aws:acm:..."
}
```

## Development Workflow

1. **Frontend Development**: `cd frontend && npm run dev`
2. **Backend Development**: `cd backend && npm run build && npm run test`
3. **Infrastructure**: `cd infrastructure && cdk synth && cdk deploy`
4. **Full Stack**: Use workspace commands from root

## Build & Deploy

```bash
# Frontend
cd frontend
npm run build
aws s3 sync dist/ s3://waitlist-frontend

# Backend
cd backend
npm run build
# Deployed via CDK

# Infrastructure
cd infrastructure
cdk deploy --all
```
