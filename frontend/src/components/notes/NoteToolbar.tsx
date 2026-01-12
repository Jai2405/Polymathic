/**
 * NoteToolbar Component
 *
 * Formatting toolbar for the TipTap editor.
 * Provides buttons for text formatting, headings, lists, etc.
 *
 * Features:
 * - Text formatting: Bold, Italic, Strike
 * - Headings: H1, H2, H3
 * - Lists: Bullet list, Ordered list
 * - Other: Blockquote, Code block
 * - Active state highlighting (shows which formats are currently applied)
 */

import { type Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo,
  Redo,
} from "lucide-react"
import { useRef } from "react"

interface NoteToolbarProps {
  editor: Editor
}

export function NoteToolbar({ editor }: NoteToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Handle image upload from file picker
   */
  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Only allow images
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Convert to base64 and insert
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      editor.chain().focus().setImage({ src: base64, width: 600 }).run()
    }
    reader.readAsDataURL(file)

    // Reset input
    e.target.value = ''
  }

  /**
   * Resize selected image
   */
  const resizeImage = (action: 'smaller' | 'larger' | 'full') => {
    if (!editor.isActive('image')) return

    const attrs = editor.getAttributes('image')
    const currentWidth = attrs.width || 600
    let newWidth: number | null = null

    switch (action) {
      case 'smaller':
        newWidth = Math.max(200, currentWidth - 100)
        break
      case 'larger':
        newWidth = Math.min(1200, currentWidth + 100)
        break
      case 'full':
        newWidth = null // Remove width attribute for full width
        break
    }

    if (newWidth === null) {
      editor.chain().focus().updateAttributes('image', { width: null }).run()
    } else {
      editor.chain().focus().updateAttributes('image', { width: newWidth }).run()
    }
  }

  /**
   * ToolbarButton component for consistent button styling.
   *
   * Highlights button when the format is active in the current selection.
   */
  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  const isImageSelected = editor.isActive('image')

  return (
    <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
      {/* Image resize controls (only show when image is selected) */}
      {isImageSelected && (
        <div className="flex gap-1 border-r pr-2 bg-blue-50 rounded px-2">
          <ToolbarButton
            onClick={() => resizeImage('smaller')}
            isActive={false}
            title="Make Image Smaller"
          >
            <ZoomOut className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => resizeImage('larger')}
            isActive={false}
            title="Make Image Larger"
          >
            <ZoomIn className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => resizeImage('full')}
            isActive={false}
            title="Full Width"
          >
            <Maximize2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}

      {/* Text formatting */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Other formatting */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={handleImageUpload}
          isActive={false}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}
