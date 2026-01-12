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
import { NoteToolbar } from "./NoteToolbar"
import type { Note, NoteUpdate } from "@/types/note.types"

interface NoteEditorProps {
  note: Note
  onUpdate: (id: number, data: NoteUpdate) => Promise<void>
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Auto-save function with debouncing.
   *
   * This saves the content 2 seconds after the user stops typing.
   * If the user keeps typing, the timer resets.
   */
  const autoSave = useCallback(
    async (content: string) => {
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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4",
      },
    },
  })

  /**
   * Update editor content when note changes.
   *
   * This handles switching between different notes.
   */
  useEffect(() => {
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

  // Show loading state while editor initializes
  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
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
          {!isSaving && lastSaved && (
            <span className="text-gray-500">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {!isSaving && !lastSaved && (
            <span className="text-gray-400">Ready to edit</span>
          )}
        </span>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  )
}
