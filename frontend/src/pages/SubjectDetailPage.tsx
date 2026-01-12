/**
 * SubjectDetailPage Component
 *
 * Detail page for a single subject showing notes and resources.
 *
 * Features:
 * - Tabbed interface (Notes, Resources)
 * - Notes: List of notes + TipTap editor with toolbar
 * - Resources: Placeholder for Phase 4
 * - Breadcrumb navigation back to home
 */

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, FileText, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSubjects } from "@/hooks/useSubjects"
import { useNotes } from "@/hooks/useNotes"
import { NotesList } from "@/components/notes/NotesList"
import { NoteEditor } from "@/components/notes/NoteEditor"
import type { Note } from "@/types/note.types"

export function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = parseInt(id || "0")

  // Fetch subject data
  const { subjects, isLoading: isLoadingSubject } = useSubjects()
  const subject = subjects.find((s) => s.id === subjectId)

  // Fetch notes for this subject
  const {
    notes,
    isLoading: isLoadingNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes(subjectId)

  // Selected note state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // Title editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")

  // Auto-select first note when notes load
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0])
    }
  }, [notes, selectedNote])

  // Handle title edit
  const handleStartEditTitle = () => {
    if (selectedNote) {
      setEditedTitle(selectedNote.title)
      setIsEditingTitle(true)
    }
  }

  const handleSaveTitle = async () => {
    if (selectedNote && editedTitle.trim() && editedTitle !== selectedNote.title) {
      await updateNote({ id: selectedNote.id, data: { title: editedTitle.trim() } })
      setSelectedNote({ ...selectedNote, title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false)
    setEditedTitle("")
  }

  // Loading state
  if (isLoadingSubject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Subject not found
  if (!subject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Subject not found
        </h2>
        <p className="text-gray-600 mb-6">
          The subject you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 truncate">
            {subject.name}
          </h1>
          {subject.description && (
            <p className="text-gray-600 mt-1">{subject.description}</p>
          )}
        </div>
      </div>

      {/* Tabs: Notes and Resources */}
      <Tabs defaultValue="notes" className="w-full flex-1 flex flex-col overflow-hidden">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Folder className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="flex-1 overflow-hidden">
          {isLoadingNotes ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full">
              {/* Notes List (Left Sidebar) */}
              <div className="lg:col-span-1 overflow-y-auto">
                <NotesList
                  notes={notes}
                  selectedNote={selectedNote}
                  onSelectNote={setSelectedNote}
                  onCreateNote={async (data) => {
                    const newNote = await createNote(data)
                    setSelectedNote(newNote)
                  }}
                  onDeleteNote={async (noteId) => {
                    await deleteNote(noteId)
                    // If deleted note was selected, clear selection
                    if (selectedNote?.id === noteId) {
                      setSelectedNote(notes.length > 1 ? notes[0] : null)
                    }
                  }}
                  subjectId={subjectId}
                />
              </div>

              {/* Note Editor (Main Content) */}
              <div className="lg:col-span-5 flex flex-col h-full">
                {selectedNote ? (
                  <>
                    {/* Note Title */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm flex-shrink-0 mb-4">
                      {isEditingTitle ? (
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle()
                            if (e.key === "Escape") handleCancelEditTitle()
                          }}
                          onBlur={handleSaveTitle}
                          className="text-2xl font-bold"
                          autoFocus
                        />
                      ) : (
                        <h2
                          className="text-2xl font-bold text-gray-900 cursor-text hover:text-gray-700 transition-colors"
                          onClick={handleStartEditTitle}
                        >
                          {selectedNote.title}
                        </h2>
                      )}
                    </div>

                    {/* Editor */}
                    <div className="flex-1 overflow-hidden">
                      <NoteEditor
                        note={selectedNote}
                        onUpdate={async (id, data) => {
                          await updateNote({ id, data })
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-white rounded-lg border">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Select a note to view and edit
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Resources Tab (Placeholder for Phase 4) */}
        <TabsContent value="resources">
          <div className="flex items-center justify-center py-12 bg-white rounded-lg border">
            <div className="text-center">
              <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Resources Coming Soon
              </h3>
              <p className="text-gray-600">
                File upload and folder management will be available in Phase 4
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
