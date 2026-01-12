/**
 * useNotes Custom Hook
 *
 * This hook manages note data using React Query.
 * It provides CRUD operations and handles loading/error states.
 *
 * Features:
 * - Fetch notes for a subject
 * - Create new notes
 * - Update notes (used for auto-save)
 * - Delete notes
 * - Automatic cache invalidation and refetching
 *
 * Usage:
 * ```typescript
 * const { notes, isLoading, createNote, updateNote } = useNotes(subjectId)
 * ```
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import notesService from "@/services/notes.service"
import type { Note, NoteCreate, NoteUpdate } from "@/types/note.types"

/**
 * Custom hook for managing notes.
 *
 * @param subjectId - ID of the subject to fetch notes for
 * @returns Object with notes data and CRUD operations
 */
export function useNotes(subjectId: number) {
  const queryClient = useQueryClient()

  // Query key for React Query cache
  // This uniquely identifies the notes for this subject
  const queryKey = ["notes", subjectId]

  /**
   * Fetch notes for the subject.
   *
   * React Query automatically:
   * - Caches the results
   * - Handles loading and error states
   * - Refetches when data becomes stale
   */
  const {
    data: noteList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => notesService.getBySubject(subjectId),
    // Only fetch if we have a valid subject ID
    enabled: !!subjectId && subjectId > 0,
  })

  /**
   * Create a new note.
   *
   * After creating, automatically refetch the notes list.
   */
  const createNoteMutation = useMutation({
    mutationFn: (data: NoteCreate) => notesService.create(data),
    onSuccess: () => {
      // Invalidate and refetch notes for this subject
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      console.error("Failed to create note:", error)
    },
  })

  /**
   * Update an existing note.
   *
   * This is used for both manual edits and auto-save.
   * Uses optimistic updates for better UX.
   */
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoteUpdate }) =>
      notesService.update(id, data),
    // Optimistic update: update the cache immediately before the server responds
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData(queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old

        return {
          ...old,
          notes: old.notes.map((note: Note) =>
            note.id === id ? { ...note, ...data } : note
          ),
        }
      })

      // Return context with previous value
      return { previousNotes }
    },
    // If mutation fails, roll back to previous value
    onError: (err, variables, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(queryKey, context.previousNotes)
      }
      console.error("Failed to update note:", err)
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  /**
   * Delete a note.
   *
   * After deleting, automatically refetch the notes list.
   */
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => notesService.remove(noteId),
    onSuccess: () => {
      // Invalidate and refetch notes for this subject
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      console.error("Failed to delete note:", error)
    },
  })

  return {
    // Data
    notes: noteList?.notes || [],
    total: noteList?.total || 0,
    isLoading,
    isError,
    error,

    // Mutations (CRUD operations)
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,

    // Mutation states
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  }
}
