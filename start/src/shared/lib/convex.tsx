import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!)
const convexQueryClient = new ConvexQueryClient(convexClient)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
            staleTime: Infinity,
        },
    },
})
convexQueryClient.connect(queryClient)

export function AppProviders({ children }: { children: ReactNode }) {
    return <ConvexProvider client={convexClient}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></ConvexProvider>
}
