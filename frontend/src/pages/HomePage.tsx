/**
 * HomePage Component
 *
 * The main landing page that displays all subjects.
 * Allows users to create, edit, and delete subjects.
 *
 * Features:
 * - Grid of subject cards
 * - Create new subject button
 * - Edit/delete subject functionality
 * - Loading and error states
 */

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubjectGrid } from "@/components/subject/SubjectGrid"
import { CreateSubjectDialog } from "@/components/subject/CreateSubjectDialog"
import { useSubjects } from "@/hooks/useSubjects"
import type { Subject, SubjectCreate } from "@/types/subject.types"

export function HomePage() {
  const {
    subjects,
    isLoading,
    isError,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjects()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  // Handle create/update subject
  const handleSubmit = async (data: SubjectCreate) => {
    if (editingSubject) {
      // Update existing subject
      await updateSubject({ id: editingSubject.id, data })
      setEditingSubject(null)
    } else {
      // Create new subject
      await createSubject(data)
    }
  }

  // Handle edit button click
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setDialogOpen(true)
  }

  // Handle delete button click
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      await deleteSubject(id)
    }
  }

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingSubject(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Subjects</h2>
          <p className="text-gray-600 mt-1">
            Manage your learning subjects and resources
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading subjects...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600">
            Failed to load subjects. Please try again.
          </p>
        </div>
      )}

      {/* Subject Grid */}
      {!isLoading && !isError && (
        <SubjectGrid
          subjects={subjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit Dialog */}
      <CreateSubjectDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleSubmit}
        editingSubject={editingSubject}
      />
    </div>
  )
}
