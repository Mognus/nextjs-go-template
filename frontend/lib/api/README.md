# API Fetching Utilities

This folder contains utilities for data fetching in a Next.js hybrid approach.

## Architecture

We use a **hybrid data fetching strategy** that combines the best of Server Components and Client-Side data fetching:

### 1. Server-Side Fetching (`api-server.ts`)

**Used in:** Server Components (RSC)
**Environment:** Node.js Server (Docker container)
**API URL:** `http://backend:8080/api` (Docker service name)

**Why?**
- Eliminates loading states on initial page load
- SEO-friendly (data is rendered on server)
- Faster First Contentful Paint

**Example:**
```tsx
// app/admin/page.tsx (Server Component)
import { fetchModels } from '@/lib/api/server'

export default async function Page() {
  const models = await fetchModels() // Runs on server
  return <MyComponent initialData={models} />
}
```

### 2. Client-Side Fetching (`fetcher.ts`)

**Used with:** SWR (Client Components)
**Environment:** Browser
**API URL:** `http://localhost:8080/api` (Host machine)

**Why?**
- Smooth user interactions (pagination, filtering, etc.)
- Auto-revalidation on tab focus
- Optimistic UI updates
- Shared cache across components

**Example:**
```tsx
// components/MyComponent.tsx (Client Component)
'use client'
import useSWR from 'swr'
import { fetcher } from '@/lib/api/fetcher'

export function MyComponent({ initialData }) {
  const { data } = useSWR('/admin/api/models', fetcher, {
    fallbackData: initialData, // No loading state!
  })

  return <div>{data.map(...)}</div>
}
```

## Key Benefits

✅ **No Loading States on Initial Load** - Server fetches data before render
✅ **Smooth Client Interactions** - SWR handles pagination, filtering, etc.
✅ **Docker-Compatible** - Different URLs for server/client contexts
✅ **Auto-Revalidation** - Data stays fresh without manual refetching
✅ **Type-Safe** - Full TypeScript support with generics

## Docker Networking

The API URLs differ based on execution context:

| Context | URL | Why |
|---------|-----|-----|
| **Server Components** | `http://backend:8080/api` | Docker internal network |
| **Client (Browser)** | `http://localhost:8080/api` | Host machine port mapping |

This is configured via environment variables in `docker-compose.dev.yml`:
- `API_URL` - Server-side (internal Docker network)
- `NEXT_PUBLIC_API_URL` - Client-side (browser)
