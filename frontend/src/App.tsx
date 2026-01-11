/**
 * App Component
 *
 * Root component of the React application.
 *
 * Phase 1: Basic structure with Layout and HomePage
 * Phase 2: Added React Query provider for API state management
 * Phase 5: Will add React Router for navigation
 *
 * Current Structure:
 * - QueryClientProvider: React Query for server state
 * - Layout wrapper (Header + Main content)
 * - HomePage as the default view
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Layout } from "@/components/layout/Layout"
import { HomePage } from "@/pages/HomePage"

// Create a React Query client
// This manages all API data caching and state
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch data when window regains focus
      refetchOnWindowFocus: false,
      // Retry failed requests 1 time
      retry: 1,
      // Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <HomePage />
      </Layout>
    </QueryClientProvider>
  )
}

export default App
