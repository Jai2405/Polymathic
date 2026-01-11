/**
 * Layout Component
 *
 * Main layout wrapper for the entire application.
 * Provides consistent structure across all pages.
 *
 * Structure:
 * - Header (sticky navigation)
 * - Main content area (children)
 * - Footer (optional, can be added later)
 *
 * Usage:
 * ```tsx
 * <Layout>
 *   <HomePage />
 * </Layout>
 * ```
 */

import { ReactNode } from "react"
import { Header } from "./Header"

interface LayoutProps {
  /**
   * Child components to render in the main content area
   */
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - sticky navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="container py-8">
        {children}
      </main>

      {/* Footer - can be added in future phases */}
      {/* <Footer /> */}
    </div>
  )
}
