/**
 * Utility Functions
 *
 * This file contains helper functions used throughout the application.
 *
 * Key Function:
 * - cn(): Merges Tailwind CSS class names intelligently
 *   It handles conditional classes and prevents style conflicts
 *
 * Example usage:
 *   cn("text-red-500", "text-blue-500") → "text-blue-500" (last one wins)
 *   cn("p-4", isActive && "bg-blue-500") → "p-4 bg-blue-500" (if isActive is true)
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and resolves conflicts.
 *
 * Uses clsx to handle conditional classes, then tw Merge to resolve
 * Tailwind CSS conflicts (e.g., multiple text colors, padding values).
 *
 * @param inputs - Class names (strings, objects, arrays, etc.)
 * @returns Merged class name string
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn("text-sm", "font-bold") // → "text-sm font-bold"
 *
 * // Conditional classes
 * cn("p-4", error && "border-red-500") // → "p-4 border-red-500" (if error is true)
 *
 * // Conflict resolution
 * cn("text-red-500", "text-blue-500") // → "text-blue-500" (twMerge removes conflict)
 *
 * // In components
 * <div className={cn("base-class", className, isActive && "active-class")} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
