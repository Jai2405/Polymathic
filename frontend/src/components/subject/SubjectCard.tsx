/**
 * SubjectCard Component
 *
 * Displays a single subject as a card.
 * Shows subject name, description, and action buttons.
 */

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import type { Subject } from "@/types/subject.types"

interface SubjectCardProps {
  subject: Subject
  onEdit: (subject: Subject) => void
  onDelete: (id: number) => void
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl">{subject.name}</CardTitle>
        {subject.description && (
          <CardDescription className="line-clamp-2">
            {subject.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(subject)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(subject.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
