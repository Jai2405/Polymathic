"""
Note Database Model

This file defines the Note table in the database using SQLAlchemy.

A Note belongs to a Subject and contains rich text content stored as JSON.

Table Structure:
- id: Unique identifier (auto-generated)
- subject_id: Foreign key to subjects table
- title: Note title
- content_json: TipTap editor content stored as JSON text

Relationships:
- Belongs to one Subject (many-to-one)
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Note(Base):
    """
    Note model representing a note within a subject.

    This is a SQLAlchemy model that maps to the 'notes' table in the database.

    Attributes:
        id (int): Primary key, auto-incremented
        subject_id (int): Foreign key to subjects table
        title (str): Note title
        content_json (str): Rich text content as JSON (TipTap format)

    Relationships:
        subject: The Subject this note belongs to
    """

    # Table name in the database
    __tablename__ = "notes"

    # Columns
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        comment="Unique identifier for the note"
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Foreign key to subjects table"
    )

    title = Column(
        String(255),
        nullable=False,
        comment="Note title"
    )

    content_json = Column(
        Text,
        nullable=False,
        default="{}",
        comment="Rich text content as JSON (TipTap format)"
    )

    # Relationships
    # subject = relationship("Subject", back_populates="notes")

    def __repr__(self):
        """String representation for debugging"""
        return f"<Note(id={self.id}, title='{self.title}', subject_id={self.subject_id})>"

    def to_dict(self):
        """
        Convert model to dictionary.
        Useful for serialization and debugging.

        Returns:
            dict: Note data as a dictionary
        """
        return {
            "id": self.id,
            "subject_id": self.subject_id,
            "title": self.title,
            "content_json": self.content_json,
        }
