/**
 * Notes API Service
 *
 * This file contains all API calls related to notes.
 * It uses the Axios instance configured in api.ts.
 *
 * Functions:
 * - getBySubject: Get all notes for a subject
 * - getById: Get a specific note
 * - create: Create a new note
 * - update: Update a note (used for auto-save)
 * - remove: Delete a note
 */

import { api } from "./api"
import type { Note, NoteCreate, NoteUpdate, NoteList } from "@/types/note.types"

/**
 * Get all notes for a specific subject.
 *
 * @param subjectId - ID of the subject
 * @returns Promise with NoteList containing notes array and metadata
 *
 * Example:
 * ```typescript
 * const noteList = await notesService.getBySubject(1)
 * console.log(`Found ${noteList.total} notes`)
 * ```
 */
export const getBySubject = async (subjectId: number): Promise<NoteList> => {
  const response = await api.get<NoteList>(`/api/v1/subjects/${subjectId}/notes`)
  return response.data
}

/**
 * Get a specific note by its ID.
 *
 * @param noteId - ID of the note
 * @returns Promise with Note data
 *
 * Example:
 * ```typescript
 * const note = await notesService.getById(1)
 * console.log(note.title)
 * ```
 */
export const getById = async (noteId: number): Promise<Note> => {
  const response = await api.get<Note>(`/api/v1/notes/${noteId}`)
  return response.data
}

/**
 * Create a new note in a subject.
 *
 * @param data - Note creation data
 * @returns Promise with created Note (includes ID)
 *
 * Example:
 * ```typescript
 * const newNote = await notesService.create({
 *   subject_id: 1,
 *   title: "My First Note",
 *   content_json: "{}"
 * })
 * console.log(`Created note with ID: ${newNote.id}`)
 * ```
 */
export const create = async (data: NoteCreate): Promise<Note> => {
  const response = await api.post<Note>(
    `/api/v1/subjects/${data.subject_id}/notes`,
    data
  )
  return response.data
}

/**
 * Update an existing note.
 *
 * This is used for auto-save functionality.
 * Only include fields you want to update.
 *
 * @param noteId - ID of the note to update
 * @param data - Note update data (all fields optional)
 * @returns Promise with updated Note
 *
 * Example (update title):
 * ```typescript
 * const updated = await notesService.update(1, {
 *   title: "Updated Title"
 * })
 * ```
 *
 * Example (auto-save content):
 * ```typescript
 * const updated = await notesService.update(1, {
 *   content_json: '{"type":"doc","content":[]}'
 * })
 * ```
 */
export const update = async (
  noteId: number,
  data: NoteUpdate
): Promise<Note> => {
  const response = await api.put<Note>(`/api/v1/notes/${noteId}`, data)
  return response.data
}

/**
 * Delete a note.
 *
 * @param noteId - ID of the note to delete
 * @returns Promise with success message
 *
 * Example:
 * ```typescript
 * const result = await notesService.remove(1)
 * console.log(result.message) // "Note deleted successfully"
 * ```
 */
export const remove = async (noteId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/v1/notes/${noteId}`
  )
  return response.data
}

// Export all functions as a single object
const notesService = {
  getBySubject,
  getById,
  create,
  update,
  remove,
}

export default notesService
