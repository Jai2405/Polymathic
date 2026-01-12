/**
 * App Component
 *
 * Root component of the React application.
 *
 * Phase 1: Basic structure with Layout and HomePage
 * Phase 2: Added React Query provider for API state management
 * Phase 3: Added React Router for navigation between pages
 *
 * Current Structure:
 * - QueryClientProvider: React Query for server state
 * - BrowserRouter: Client-side routing
 * - Layout wrapper (Header + Main content)
 * - Routes:
 *   - / → HomePage (all subjects)
 *   - /subjects/:id → SubjectDetailPage (notes and resources)
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { HomePage } from "@/pages/HomePage"
import { SubjectDetailPage } from "@/pages/SubjectDetailPage"

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
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Home page: Grid of all subjects */}
            <Route path="/" element={<HomePage />} />

            {/* Subject detail page: Notes and resources for a subject */}
            <Route path="/subjects/:id" element={<SubjectDetailPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
