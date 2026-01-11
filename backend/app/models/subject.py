"""
Subject Database Model

This file defines the Subject table in the database using SQLAlchemy.

A Subject represents a topic/course the user is studying (e.g., "Mathematics", "Python Programming").

Table Structure:
- id: Unique identifier (auto-generated)
- name: Subject name (e.g., "Advanced Calculus")
- description: Optional longer description

Relationships:
- Has many notes (one-to-many)
- Has many resources (one-to-many)
"""

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Subject(Base):
    """
    Subject model representing a study subject/topic.

    This is a SQLAlchemy model that maps to the 'subjects' table in the database.

    Attributes:
        id (int): Primary key, auto-incremented
        name (str): Subject name, must be unique
        description (str): Optional description of the subject

    Relationships:
        notes: List of Note objects belonging to this subject
        resources: List of Resource objects belonging to this subject
    """

    # Table name in the database
    __tablename__ = "subjects"

    # Columns
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        comment="Unique identifier for the subject"
    )

    name = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="Name of the subject (e.g., 'Mathematics')"
    )

    description = Column(
        Text,
        nullable=True,
        comment="Optional longer description of the subject"
    )

    # Relationships (will be used in Phase 3 and 4)
    # notes = relationship("Note", back_populates="subject", cascade="all, delete-orphan")
    # resources = relationship("Resource", back_populates="subject", cascade="all, delete-orphan")

    def __repr__(self):
        """String representation for debugging"""
        return f"<Subject(id={self.id}, name='{self.name}')>"

    def to_dict(self):
        """
        Convert model to dictionary.
        Useful for serialization and debugging.

        Returns:
            dict: Subject data as a dictionary
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }
