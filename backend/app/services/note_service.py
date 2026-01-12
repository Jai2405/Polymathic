"""
Note Service Layer

This file contains business logic for note operations (CRUD).

Service Layer Benefits:
- Separates business logic from API routes
- Makes code reusable across different endpoints
- Easier to test and maintain
- Single source of truth for note operations

CRUD Operations:
- Create: Add new note to a subject
- Read: Get notes for a subject, or get a specific note
- Update: Modify existing note (used for auto-save)
- Delete: Remove note
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from fastapi import HTTPException, status

from app.models.note import Note
from app.models.subject import Subject
from app.schemas.note import NoteCreate, NoteUpdate


class NoteService:
    """
    Service class for note-related operations.

    All methods are static (no need to create an instance).
    Each method receives a database session as a parameter.
    """

    @staticmethod
    def create_note(db: Session, note_data: NoteCreate) -> Note:
        """
        Create a new note in the database.

        Args:
            db: Database session
            note_data: Note data from request (validated by Pydantic)

        Returns:
            Note: The created note with ID

        Raises:
            HTTPException 404: If subject doesn't exist
            HTTPException 400: If there's a database constraint violation

        Example:
            note = NoteService.create_note(db, NoteCreate(
                subject_id=1,
                title="My First Note",
                content_json="{}"
            ))
        """
        # First, verify that the subject exists
        subject = db.query(Subject).filter(Subject.id == note_data.subject_id).first()
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subject with id {note_data.subject_id} not found"
            )

        # Create new Note instance from Pydantic schema
        db_note = Note(
            subject_id=note_data.subject_id,
            title=note_data.title,
            content_json=note_data.content_json
        )

        try:
            # Add to database session
            db.add(db_note)

            # Commit the transaction (save to database)
            db.commit()

            # Refresh to get the ID from database
            db.refresh(db_note)

            return db_note

        except IntegrityError as e:
            # This could happen if there's a database constraint violation
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create note: {str(e)}"
            )

    @staticmethod
    def get_notes_by_subject(db: Session, subject_id: int) -> List[Note]:
        """
        Get all notes for a specific subject.

        Args:
            db: Database session
            subject_id: ID of the subject

        Returns:
            List[Note]: List of notes, ordered by ID (oldest first / creation order)

        Raises:
            HTTPException 404: If subject doesn't exist

        Example:
            notes = NoteService.get_notes_by_subject(db, subject_id=1)
            print(f"Found {len(notes)} notes")
        """
        # First, verify that the subject exists
        subject = db.query(Subject).filter(Subject.id == subject_id).first()
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subject with id {subject_id} not found"
            )

        # Query all notes for this subject, order by id ascending (oldest first / creation order)
        notes = db.query(Note).filter(
            Note.subject_id == subject_id
        ).order_by(Note.id).all()

        return notes

    @staticmethod
    def get_note_by_id(db: Session, note_id: int) -> Optional[Note]:
        """
        Get a single note by its ID.

        Args:
            db: Database session
            note_id: ID of the note to retrieve

        Returns:
            Note or None: The note if found, None otherwise

        Example:
            note = NoteService.get_note_by_id(db, 1)
            if note:
                print(f"Found: {note.title}")
            else:
                print("Note not found")
        """
        note = db.query(Note).filter(Note.id == note_id).first()
        return note

    @staticmethod
    def get_note_by_id_or_404(db: Session, note_id: int) -> Note:
        """
        Get a note by ID or raise 404 if not found.

        Args:
            db: Database session
            note_id: ID of the note to retrieve

        Returns:
            Note: The note

        Raises:
            HTTPException 404: If note not found

        Example:
            # This will automatically raise 404 if note doesn't exist
            note = NoteService.get_note_by_id_or_404(db, 1)
        """
        note = NoteService.get_note_by_id(db, note_id)

        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )

        return note

    @staticmethod
    def update_note(
        db: Session,
        note_id: int,
        note_data: NoteUpdate
    ) -> Note:
        """
        Update an existing note.

        This is used for auto-save functionality - the frontend will send
        updates every few seconds as the user types.

        Args:
            db: Database session
            note_id: ID of the note to update
            note_data: Updated note data (only include fields to change)

        Returns:
            Note: The updated note

        Raises:
            HTTPException 404: If note not found
            HTTPException 400: If there's a database constraint violation

        Example:
            # Update only the content (auto-save)
            updated = NoteService.update_note(db, 1, NoteUpdate(
                content_json='{"type":"doc","content":[]}'
            ))

            # Update only the title
            updated = NoteService.update_note(db, 1, NoteUpdate(
                title="New Title"
            ))
        """
        # Get existing note (raises 404 if not found)
        note = NoteService.get_note_by_id_or_404(db, note_id)

        # Update only the fields that were provided
        # exclude_unset=True means only include fields that were actually set in the request
        update_data = note_data.model_dump(exclude_unset=True)

        try:
            # Update each field
            for field, value in update_data.items():
                setattr(note, field, value)

            # Commit changes
            db.commit()

            # Refresh to get any database-side changes
            db.refresh(note)

            return note

        except IntegrityError as e:
            # Database constraint violation
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to update note: {str(e)}"
            )

    @staticmethod
    def delete_note(db: Session, note_id: int) -> dict:
        """
        Delete a note from the database.

        Args:
            db: Database session
            note_id: ID of the note to delete

        Returns:
            dict: Success message

        Raises:
            HTTPException 404: If note not found

        Example:
            result = NoteService.delete_note(db, 1)
            print(result["message"])  # "Note deleted successfully"
        """
        # Get note (raises 404 if not found)
        note = NoteService.get_note_by_id_or_404(db, note_id)

        # Delete from database
        db.delete(note)
        db.commit()

        return {
            "message": "Note deleted successfully",
            "note_id": note_id
        }

    @staticmethod
    def get_note_count(db: Session, subject_id: Optional[int] = None) -> int:
        """
        Get the total number of notes.

        Can optionally filter by subject_id.

        Args:
            db: Database session
            subject_id: Optional subject ID to filter by

        Returns:
            int: Total count of notes

        Example:
            # Get total notes across all subjects
            total = NoteService.get_note_count(db)

            # Get notes for specific subject
            subject_notes = NoteService.get_note_count(db, subject_id=1)
        """
        query = db.query(Note)

        if subject_id is not None:
            query = query.filter(Note.subject_id == subject_id)

        return query.count()
