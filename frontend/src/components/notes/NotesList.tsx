/**
 * NotesList Component
 *
 * Displays a list of notes for a subject.
 * Allows selecting a note to edit, creating new notes, and deleting notes.
 *
 * Features:
 * - List of all notes with titles
 * - Click to select and edit a note
 * - Create new note button
 * - Delete note button
 * - Empty state when no notes exist
 */

import { useState } from "react"
import { Plus, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Note, NoteCreate } from "@/types/note.types"

interface NotesListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onCreateNote: (data: NoteCreate) => Promise<void>
  onDeleteNote: (noteId: number) => Promise<void>
  subjectId: number
}

export function NotesList({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  subjectId,
}: NotesListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  /**
   * Handle creating a new note.
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim()) return

    setIsCreating(true)
    try {
      await onCreateNote({
        subject_id: subjectId,
        title: newNoteTitle.trim(),
        content_json: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        }),
      })

      // Reset form and close dialog
      setNewNoteTitle("")
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create note:", error)
    } finally {
      setIsCreating(false)
    }
  }

  /**
   * Handle deleting a note.
   */
  const handleDelete = async (noteId: number, noteTitle: string) => {
    if (confirm(`Are you sure you want to delete "${noteTitle}"?`)) {
      try {
        await onDeleteNote(noteId)
      } catch (error) {
        console.error("Failed to delete note:", error)
      }
    }
  }

  // Empty state when no notes
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No notes yet
        </h3>
        <p className="text-gray-600 mb-4 text-center">
          Create your first note to start learning!
        </p>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Note
        </Button>

        {/* Create Note Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Give your note a title to get started.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Note Title *
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to Calculus"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !newNoteTitle.trim()}
                >
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Create Note Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Notes ({notes.length})
        </h3>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`
              group flex items-center justify-between p-3 rounded-lg border
              transition-all cursor-pointer hover:shadow-sm
              ${
                selectedNote?.id === note.id
                  ? "bg-blue-50 border-blue-300 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }
            `}
            onClick={() => onSelectNote(note)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText
                className={`h-5 w-5 flex-shrink-0 ${
                  selectedNote?.id === note.id
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`font-medium truncate ${
                  selectedNote?.id === note.id
                    ? "text-blue-900"
                    : "text-gray-900"
                }`}
              >
                {note.title}
              </span>
            </div>

            {/* Delete Button (shown on hover or when selected) */}
            <Button
              variant="ghost"
              size="sm"
              className={`
                flex-shrink-0 h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50
                ${selectedNote?.id === note.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
              `}
              onClick={(e) => {
                e.stopPropagation() // Prevent selecting the note
                handleDelete(note.id, note.title)
              }}
              title="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Create Note Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Give your note a title to get started.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Note Title *
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Calculus"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !newNoteTitle.trim()}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
