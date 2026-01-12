/**
 * NoteEditor Component
 *
 * Rich text editor using TipTap for creating and editing notes.
 *
 * Features:
 * - Rich text formatting (bold, italic, headings, lists, etc.)
 * - Auto-save functionality (saves 2 seconds after typing stops)
 * - JSON content storage (TipTap format)
 * - Visual feedback for saving status
 *
 * This is one of the most complex components in the app.
 */

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Typography from "@tiptap/extension-typography"
import Link from "@tiptap/extension-link"
import { useEffect, useCallback, useRef, useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NoteToolbar } from "./NoteToolbar"
import type { Note, NoteUpdate } from "@/types/note.types"

interface NoteEditorProps {
  note: Note
  onUpdate: (id: number, data: NoteUpdate) => Promise<void>
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isLoadingNoteRef = useRef(false)

  /**
   * Auto-save function with debouncing.
   *
   * This saves the content 2 seconds after the user stops typing.
   * If the user keeps typing, the timer resets.
   */
  const autoSave = useCallback(
    async (content: string) => {
      // Mark as having unsaved changes
      setHasUnsavedChanges(true)

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Set new timeout to save after 2 seconds
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true)
          await onUpdate(note.id, { content_json: content })
          setLastSaved(new Date())
          setHasUnsavedChanges(false)
        } catch (error) {
          console.error("Auto-save failed:", error)
        } finally {
          setIsSaving(false)
        }
      }, 2000) // 2 seconds delay
    },
    [note.id, onUpdate]
  )

  /**
   * Initialize TipTap editor with extensions.
   *
   * Extensions add functionality to the editor.
   */
  const editor = useEditor({
    extensions: [
      // StarterKit includes basic formatting (bold, italic, headings, lists, etc.)
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // Only allow H1, H2, H3
        },
      }),
      // Placeholder text when editor is empty
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
      // Typography: automatic smart quotes, dashes, etc.
      Typography,
      // Link support
      Link.configure({
        openOnClick: false, // Don't follow links while editing
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    // Parse the JSON content and set it as editor content
    content: note.content_json ? JSON.parse(note.content_json) : "",
    // Called whenever the content changes
    onUpdate: ({ editor }) => {
      // Don't auto-save if we're loading a new note
      if (isLoadingNoteRef.current) {
        return
      }

      // Get the content as JSON
      const json = editor.getJSON()
      const jsonString = JSON.stringify(json)

      // Trigger auto-save
      autoSave(jsonString)
    },
    // Editor options
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[600px] p-6 w-full",
      },
    },
  })

  /**
   * Update editor content when note changes.
   *
   * This handles switching between different notes.
   */
  useEffect(() => {
    // Mark that we're loading a new note
    isLoadingNoteRef.current = true

    // Reset unsaved changes flag when switching notes
    setHasUnsavedChanges(false)
    setLastSaved(null)

    if (editor && note.content_json) {
      const currentContent = JSON.stringify(editor.getJSON())
      const newContent = note.content_json

      // Only update if content actually changed
      if (currentContent !== newContent) {
        try {
          const parsedContent = JSON.parse(newContent)
          editor.commands.setContent(parsedContent)
        } catch (error) {
          console.error("Failed to parse note content:", error)
          // If parsing fails, set empty content
          editor.commands.setContent("")
        }
      }
    }

    // After a brief delay, mark loading as complete
    // This allows the content to be set before re-enabling auto-save
    setTimeout(() => {
      isLoadingNoteRef.current = false
    }, 100)
  }, [note.id, note.content_json, editor])

  /**
   * Cleanup: clear save timeout when component unmounts.
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Manual save function
   */
  const manualSave = useCallback(async () => {
    if (!editor || !hasUnsavedChanges) return

    try {
      setIsSaving(true)
      const json = editor.getJSON()
      const jsonString = JSON.stringify(json)
      await onUpdate(note.id, { content_json: jsonString })
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }, [editor, note.id, onUpdate, hasUnsavedChanges])

  /**
   * Keyboard shortcut for manual save (Ctrl+S / Cmd+S)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        manualSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [manualSave])

  // Show loading state while editor initializes
  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden w-full h-full flex flex-col">
      {/* Toolbar */}
      {editor && <NoteToolbar editor={editor} />}

      {/* Saving status indicator */}
      <div className="border-b px-4 py-2 bg-gray-50 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {isSaving && (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              Saving...
            </span>
          )}
          {!isSaving && lastSaved && !hasUnsavedChanges && (
            <span className="text-gray-500">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {!isSaving && hasUnsavedChanges && (
            <span className="text-amber-600">Unsaved changes</span>
          )}
          {!isSaving && !lastSaved && !hasUnsavedChanges && (
            <span className="text-gray-400">Ready to edit</span>
          )}
        </span>
        <Button
          size="sm"
          onClick={manualSave}
          disabled={isSaving || !hasUnsavedChanges}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto w-full">
        <EditorContent editor={editor} className="w-full h-full" />
      </div>
    </div>
  )
}
