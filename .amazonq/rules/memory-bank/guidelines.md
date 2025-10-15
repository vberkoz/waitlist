# Development Guidelines

## Code Quality Standards

### File Naming & Structure
- Use PascalCase for React component files: `DashboardPage.tsx`, `Layout.tsx`
- Use camelCase for hooks and utilities: `useWaitlist.ts`, `router.tsx`
- Co-locate related files in feature directories
- Export default for page components and main App component
- Use named exports for hooks, utilities, and providers

### Import Organization
- Group imports by category: external libraries, internal modules, styles
- Use path aliases consistently: `@/app`, `@/components`, `@/features`, `@/lib`, `@/pages`, `@/styles`
- Import types and interfaces inline with implementation imports

Example:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '@/components/layout/Layout'
import '@/styles/index.css'
```

### TypeScript Standards
- Enable strict mode in all TypeScript configurations
- Define explicit return types for functions and hooks
- Use `z.infer<typeof schema>` to derive types from Zod schemas
- Prefer interfaces for object shapes, types for unions/intersections
- Use TypeScript's non-null assertion (`!`) sparingly and only when certain

Example:
```typescript
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
})

type FormData = z.infer<typeof formSchema>
```

## Form Handling Patterns

### React Hook Form + Zod Integration
- Always use Zod schemas for form validation
- Use `zodResolver` to integrate Zod with React Hook Form
- Define validation messages inline with schema rules
- Destructure only needed form methods: `register`, `handleSubmit`, `formState`, `reset`
- Display error messages conditionally below inputs

Example:
```typescript
const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
  resolver: zodResolver(formSchema)
})

const onSubmit = (data: FormData) => {
  // Handle submission
  reset()
}
```

### Form UI Patterns
- Use semantic HTML: `<label>`, `<input>`, `<textarea>`, `<button type="submit">`
- Apply consistent spacing with Tailwind: `space-y-6` for form sections
- Use consistent input styling: `w-full px-4 py-2 border border-neutral-300 rounded-lg`
- Add focus states: `focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
- Display errors with: `text-error-500 text-sm mt-1`

## Data Fetching Patterns

### TanStack Query Usage
- Use `useQuery` for GET requests with explicit `queryKey` and `queryFn`
- Use `useMutation` for POST/PUT/DELETE requests
- Invalidate queries after mutations using `queryClient.invalidateQueries()`
- Define query keys as arrays: `['users']`, `['waitlists', id]`
- Type query functions with explicit return types: `Promise<User[]>`

Example:
```typescript
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    }
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      if (!response.ok) throw new Error('Failed to create user')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
```

### API Error Handling
- Check `response.ok` before parsing JSON
- Throw descriptive errors for failed requests
- Let TanStack Query handle error states in components

## Component Architecture

### Page Components
- Export default function for page components
- Use descriptive names ending with "Page": `DashboardPage`, `WaitlistsPage`
- Keep pages focused on layout and composition
- Delegate data fetching to custom hooks
- Use Tailwind utility classes for styling

### Layout Patterns
- Use nested routing with React Router's `children` property
- Wrap routes with shared `<Layout />` component
- Define routes in separate `router.tsx` file using `createBrowserRouter`

Example:
```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/waitlists', element: <WaitlistsPage /> }
    ]
  }
])
```

### Provider Pattern
- Create centralized `Providers` component for app-wide context
- Initialize QueryClient once at module level
- Wrap children with all necessary providers
- Keep provider component minimal and focused

Example:
```typescript
const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Styling Guidelines

### Tailwind CSS Conventions
- Use utility classes directly in JSX
- Follow design system color tokens:
  - Primary: `primary-500`, `primary-600`, `primary-700`
  - Neutral: `neutral-200`, `neutral-300`, `neutral-700`, `neutral-900`
  - Error: `error-500`
- Use consistent spacing scale: `space-y-6`, `p-8`, `px-4 py-2`, `mb-2`, `mt-1`
- Apply consistent border radius: `rounded-lg` for cards and inputs
- Use shadow utilities: `shadow-sm` for subtle elevation

### Component Styling Patterns
- Cards: `bg-white p-8 rounded-lg shadow-sm border border-neutral-200`
- Buttons: `bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium`
- Inputs: `w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500`
- Labels: `block text-sm font-medium text-neutral-700 mb-2`
- Headings: `text-4xl font-bold text-neutral-900`

## Project Configuration

### Vite Configuration
- Use path aliases for clean imports
- Configure aliases for all major directories: `@/app`, `@/components`, `@/features`, `@/lib`, `@/pages`, `@/styles`
- Include React plugin: `@vitejs/plugin-react`
- Include Tailwind plugin: `@tailwindcss/vite`

Example:
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app')
    }
  }
})
```

### Application Entry Point
- Use React StrictMode in production
- Import global styles before App component
- Use non-null assertion for root element (guaranteed by index.html)

Example:
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

## Feature Organization

### Custom Hooks Location
- Place hooks in `features/{feature-name}/hooks/` directory
- Name hooks with `use` prefix: `useWaitlist`, `useUsers`, `useCreateUser`
- Export multiple related hooks from same file
- Keep hooks focused on single responsibility

### Hook Composition
- Separate read operations (useQuery) from write operations (useMutation)
- Return query/mutation objects directly without additional wrapping
- Use TypeScript generics for type safety
- Access queryClient via `useQueryClient()` hook in mutations

## Best Practices

### Performance
- Use React.StrictMode for development checks
- Leverage TanStack Query caching to minimize API calls
- Invalidate queries strategically after mutations
- Use Vite's fast refresh for development

### Type Safety
- Derive form types from Zod schemas using `z.infer`
- Type all API responses explicitly
- Use TypeScript strict mode
- Avoid `any` type - use `unknown` if type is truly unknown

### Code Organization
- Group related functionality in feature directories
- Keep components small and focused
- Extract reusable logic into custom hooks
- Separate routing configuration from component definitions

### Error Handling
- Provide user-friendly validation messages in Zod schemas
- Display form errors inline below inputs
- Let TanStack Query handle loading and error states
- Throw descriptive errors in API functions
