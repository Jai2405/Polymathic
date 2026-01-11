/**
 * Note TypeScript Types
 *
 * These types define the structure of note data in the frontend.
 * They match the backend Pydantic schemas for type safety.
 *
 * Types:
 * - Note: Complete note data from API
 * - NoteCreate: Data needed to create a new note
 * - NoteUpdate: Data that can be updated
 * - NoteList: List of notes with metadata
 */

/**
 * Complete note data as returned by the API.
 *
 * This is what you get when fetching notes from the backend.
 */
export interface Note {
  id: number
  subject_id: number
  title: string
  content_json: string // TipTap JSON content as string
}

/**
 * Data required to create a new note.
 *
 * Used when calling the POST /api/v1/subjects/{subject_id}/notes endpoint.
 *
 * Example:
 * ```typescript
 * const newNote: NoteCreate = {
 *   subject_id: 1,
 *   title: "My First Note",
 *   content_json: "{}"
 * }
 * ```
 */
export interface NoteCreate {
  subject_id: number
  title: string
  content_json?: string // Optional, defaults to "{}" on backend
}

/**
 * Data that can be updated in an existing note.
 *
 * All fields are optional - only include fields you want to update.
 *
 * Used when calling the PUT /api/v1/notes/{note_id} endpoint.
 *
 * Example (update only title):
 * ```typescript
 * const update: NoteUpdate = {
 *   title: "Updated Title"
 * }
 * ```
 *
 * Example (update only content - for auto-save):
 * ```typescript
 * const update: NoteUpdate = {
 *   content_json: '{"type":"doc","content":[]}'
 * }
 * ```
 */
export interface NoteUpdate {
  title?: string
  content_json?: string
}

/**
 * List of notes with metadata.
 *
 * Returned by GET /api/v1/subjects/{subject_id}/notes endpoint.
 *
 * Example:
 * ```typescript
 * const noteList: NoteList = {
 *   notes: [
 *     { id: 1, subject_id: 1, title: "Note 1", content_json: "{}" },
 *     { id: 2, subject_id: 1, title: "Note 2", content_json: "{}" }
 *   ],
 *   total: 2,
 *   subject_id: 1
 * }
 * ```
 */
export interface NoteList {
  notes: Note[]
  total: number
  subject_id?: number
}
