/**
 * CreateSubjectDialog Component
 *
 * Modal dialog for creating and editing subjects.
 * Includes form validation and handles both create and update operations.
 */

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Subject, SubjectCreate, SubjectUpdate } from "@/types/subject.types"

interface CreateSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SubjectCreate | SubjectUpdate) => Promise<void>
  editingSubject?: Subject | null
}

export function CreateSubjectDialog({
  open,
  onOpenChange,
  onSubmit,
  editingSubject,
}: CreateSubjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name)
      setDescription(editingSubject.description || "")
    } else {
      setName("")
      setDescription("")
    }
  }, [editingSubject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      // Reset form
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save subject:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingSubject ? "Edit Subject" : "Create New Subject"}
          </DialogTitle>
          <DialogDescription>
            {editingSubject
              ? "Update the subject details below."
              : "Add a new subject to your learning journey."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Subject Name *
              </label>
              <Input
                id="name"
                placeholder="e.g., Advanced Mathematics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                id="description"
                placeholder="e.g., Calculus and linear algebra"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting
                ? "Saving..."
                : editingSubject
                ? "Update"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
