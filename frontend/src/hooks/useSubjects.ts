/**
 * useSubjects Hook
 *
 * Custom hook for managing subject data with React Query.
 * Provides methods for CRUD operations with automatic caching and revalidation.
 *
 * React Query Benefits:
 * - Automatic caching: Data is cached and reused
 * - Background updates: Refreshes data when window regains focus
 * - Optimistic updates: UI updates immediately, then syncs with server
 * - Loading/error states: Built-in state management
 * - Automatic refetching: Keeps data fresh
 *
 * Usage:
 * ```tsx
 * const { subjects, isLoading, createSubject } = useSubjects()
 * ```
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import subjectsService from "@/services/subjects.service"
import type { SubjectCreate, SubjectUpdate } from "@/types/subject.types"

// Query keys for React Query cache
const QUERY_KEYS = {
  subjects: ["subjects"] as const,
  subject: (id: number) => ["subjects", id] as const,
}

/**
 * Hook for fetching and managing subjects
 */
export function useSubjects() {
  const queryClient = useQueryClient()

  // Fetch all subjects
  const {
    data: subjectsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.subjects,
    queryFn: subjectsService.getAll,
    // Refetch every 5 minutes
    staleTime: 5 * 60 * 1000,
  })

  // Create subject mutation
  const createMutation = useMutation({
    mutationFn: subjectsService.create,
    onSuccess: () => {
      // Invalidate and refetch subjects list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects })
    },
  })

  // Update subject mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectUpdate }) =>
      subjectsService.update(id, data),
    onSuccess: () => {
      // Invalidate subjects list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects })
    },
  })

  // Delete subject mutation
  const deleteMutation = useMutation({
    mutationFn: subjectsService.remove,
    onSuccess: () => {
      // Invalidate subjects list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects })
    },
  })

  return {
    // Data
    subjects: subjectsData?.subjects ?? [],
    total: subjectsData?.total ?? 0,

    // Loading states
    isLoading,
    isError,
    error,

    // Mutations
    createSubject: createMutation.mutateAsync,
    updateSubject: updateMutation.mutateAsync,
    deleteSubject: deleteMutation.mutateAsync,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
