/**
 * PostCSS Configuration
 *
 * PostCSS is a tool that transforms CSS with JavaScript plugins.
 * Tailwind CSS uses PostCSS to process utility classes.
 *
 * Plugins:
 * - tailwindcss: Processes Tailwind utility classes
 * - autoprefixer: Adds vendor prefixes (-webkit-, -moz-, etc.) for browser compatibility
 */

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
