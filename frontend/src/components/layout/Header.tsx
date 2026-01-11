/**
 * Header Component
 *
 * The main navigation header for the application.
 * Displays the app name and will later include navigation links and breadcrumbs.
 *
 * This is a presentational component that focuses on the UI.
 * In Phase 5, we'll add navigation functionality with React Router.
 */

import { GraduationCap } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Be a Polymath
            </h1>
            <p className="text-xs text-gray-500">
              Master Multiple Subjects
            </p>
          </div>
        </div>

        {/* Navigation - will be added in Phase 5 */}
        <nav className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Phase 1: Foundation
          </span>
        </nav>
      </div>
    </header>
  )
}
