/**
 * Vite Configuration
 *
 * This file configures the Vite build tool for development and production.
 *
 * Key features:
 * - Fast HMR (Hot Module Replacement) during development
 * - Path aliases (@/ points to src/) for cleaner imports
 * - React plugin for JSX/TSX support
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases - allows importing with @/ instead of relative paths
  // Example: import { Button } from '@/components/ui/button' instead of '../../../components/ui/button'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
