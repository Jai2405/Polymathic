/**
 * Tailwind CSS Configuration
 *
 * This file configures Tailwind CSS for the application.
 * It tells Tailwind which files to scan for class names and
 * allows you to customize colors, spacing, animations, etc.
 *
 * Key concepts:
 * - content: Array of file paths to scan for Tailwind classes
 * - theme.extend: Add custom colors, animations, etc. without removing defaults
 * - plugins: Add additional Tailwind plugins
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Darkmode using class strategy (optional)
  darkMode: ["class"],

  // Files to scan for Tailwind class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // All React components
  ],

  theme: {
    extend: {
      // Custom colors (we'll add more in Phase 2 and Phase 6)
      colors: {
        // Will be extended with shadcn/ui colors
      },

      // Custom animations for smooth UX
      keyframes: {
        // Fade in animation
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Slide up animation
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Slide down animation
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.4s ease-out",
      },
    },
  },

  plugins: [
    // Additional Tailwind plugins can be added here
    // For example: @tailwindcss/forms, @tailwindcss/typography
  ],
}
