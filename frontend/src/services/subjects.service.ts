/**
 * Subjects Service
 *
 * This file contains all API calls related to subjects.
 * Each function makes an HTTP request to the backend and returns typed data.
 *
 * Why separate service files?
 * - Organization: All subject-related API calls in one place
 * - Reusability: Can be used from hooks, components, etc.
 * - Type safety: All requests/responses are typed
 * - Easy to test: Can mock these functions
 */

import { api } from "./api"
import type {
  Subject,
  SubjectCreate,
  SubjectUpdate,
  SubjectListResponse,
} from "@/types/subject.types"

// API endpoints (all prefixed with /api/v1)
const ENDPOINTS = {
  subjects: "/api/v1/subjects",
  subject: (id: number) => `/api/v1/subjects/${id}`,
}

/**
 * Get all subjects
 *
 * @returns Promise with list of subjects
 *
 * Example:
 * ```ts
 * const response = await subjectsService.getAll()
 * console.log(response.subjects) // Array of subjects
 * console.log(response.total) // Total count
 * ```
 */
export const getAll = async (): Promise<SubjectListResponse> => {
  const response = await api.get<SubjectListResponse>(ENDPOINTS.subjects)
  return response.data
}

/**
 * Get a single subject by ID
 *
 * @param id - Subject ID
 * @returns Promise with subject data
 *
 * Example:
 * ```ts
 * const subject = await subjectsService.getById(1)
 * console.log(subject.name) // "Mathematics"
 * ```
 */
export const getById = async (id: number): Promise<Subject> => {
  const response = await api.get<Subject>(ENDPOINTS.subject(id))
  return response.data
}

/**
 * Create a new subject
 *
 * @param data - Subject data (name is required, description optional)
 * @returns Promise with created subject
 *
 * Example:
 * ```ts
 * const newSubject = await subjectsService.create({
 *   name: "Advanced Mathematics",
 *   description: "Calculus and linear algebra"
 * })
 * console.log(newSubject.id) // Newly assigned ID
 * ```
 */
export const create = async (data: SubjectCreate): Promise<Subject> => {
  const response = await api.post<Subject>(ENDPOINTS.subjects, data)
  return response.data
}

/**
 * Update an existing subject
 *
 * @param id - Subject ID to update
 * @param data - Fields to update (all optional)
 * @returns Promise with updated subject
 *
 * Example:
 * ```ts
 * const updated = await subjectsService.update(1, {
 *   name: "Advanced Calculus"
 * })
 * console.log(updated.name) // "Advanced Calculus"
 * ```
 */
export const update = async (
  id: number,
  data: SubjectUpdate
): Promise<Subject> => {
  const response = await api.put<Subject>(ENDPOINTS.subject(id), data)
  return response.data
}

/**
 * Delete a subject
 *
 * @param id - Subject ID to delete
 * @returns Promise with success message
 *
 * Example:
 * ```ts
 * const result = await subjectsService.remove(1)
 * console.log(result.message) // "Subject deleted successfully"
 * ```
 */
export const remove = async (
  id: number
): Promise<{ message: string; subject_id: number }> => {
  const response = await api.delete<{ message: string; subject_id: number }>(
    ENDPOINTS.subject(id)
  )
  return response.data
}

// Export as default object for convenience
const subjectsService = {
  getAll,
  getById,
  create,
  update,
  remove,
}

export default subjectsService
