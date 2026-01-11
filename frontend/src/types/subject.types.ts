/**
 * Subject TypeScript Types
 *
 * These types define the shape of subject data in the frontend.
 * They match the Pydantic schemas from the backend.
 *
 * Why TypeScript types?
 * - Type safety: Catch errors at compile time
 * - Autocomplete: Better developer experience
 * - Documentation: Types serve as inline documentation
 * - Refactoring: Easier to update code when types change
 */

/**
 * Subject - Complete subject object returned from API
 *
 * This matches the SubjectResponse schema from backend.
 */
export interface Subject {
  /** Unique identifier */
  id: number

  /** Subject name (e.g., "Advanced Mathematics") */
  name: string

  /** Optional description */
  description: string | null
}

/**
 * SubjectCreate - Data needed to create a new subject
 *
 * This matches the SubjectCreate schema from backend.
 */
export interface SubjectCreate {
  /** Subject name (required) */
  name: string

  /** Optional description */
  description?: string
}

/**
 * SubjectUpdate - Data for updating an existing subject
 *
 * All fields are optional - only include fields you want to update.
 * This matches the SubjectUpdate schema from backend.
 */
export interface SubjectUpdate {
  /** Updated name */
  name?: string

  /** Updated description */
  description?: string
}

/**
 * SubjectListResponse - Response from GET /api/v1/subjects
 *
 * This matches the SubjectList schema from backend.
 */
export interface SubjectListResponse {
  /** Array of subjects */
  subjects: Subject[]

  /** Total count of subjects */
  total: number
}
