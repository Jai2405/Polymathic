/**
 * SubjectGrid Component
 *
 * Grid layout for displaying multiple subject cards.
 * Responsive grid that adjusts columns based on screen size.
 */

import { SubjectCard } from "./SubjectCard"
import type { Subject } from "@/types/subject.types"

interface SubjectGridProps {
  subjects: Subject[]
  onEdit: (subject: Subject) => void
  onDelete: (id: number) => void
}

export function SubjectGrid({ subjects, onEdit, onDelete }: SubjectGridProps) {
  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No subjects yet
        </h3>
        <p className="text-gray-600">
          Create your first subject to start learning!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {subjects.map((subject) => (
        <div key={subject.id} className="animate-slide-up">
          <SubjectCard
            subject={subject}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}
