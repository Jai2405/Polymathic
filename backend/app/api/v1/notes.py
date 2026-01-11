"""
Notes API Endpoints

This file defines the REST API routes for note operations.

API endpoints handle:
- HTTP request/response
- Request validation (automatically via Pydantic schemas)
- Calling service layer functions
- Error handling

Endpoints:
- GET /api/v1/subjects/{subject_id}/notes - List all notes for a subject
- POST /api/v1/subjects/{subject_id}/notes - Create new note
- GET /api/v1/notes/{note_id} - Get specific note
- PUT /api/v1/notes/{note_id} - Update note (auto-save)
- DELETE /api/v1/notes/{note_id} - Delete note
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteList
from app.services.note_service import NoteService

# Create router instance
# This will be registered in main.py
router = APIRouter()


@router.get(
    "/subjects/{subject_id}/notes",
    response_model=NoteList,
    summary="Get all notes for a subject",
    description="Retrieve all notes belonging to a specific subject, ordered by creation date (newest first)"
)
def get_subject_notes(
    subject_id: int,
    db: Session = Depends(get_db)
) -> NoteList:
    """
    Get all notes for a specific subject.

    Args:
        subject_id: ID of the subject
        db: Database session (injected)

    Returns:
        NoteList with notes array and metadata

    Raises:
        404: Subject not found
    """
    notes = NoteService.get_notes_by_subject(db, subject_id)
    total = len(notes)

    return NoteList(
        notes=notes,
        total=total,
        subject_id=subject_id
    )


@router.post(
    "/subjects/{subject_id}/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new note",
    description="Create a new note within a subject"
)
def create_note(
    subject_id: int,
    note_data: NoteCreate,
    db: Session = Depends(get_db)
) -> NoteResponse:
    """
    Create a new note in a subject.

    The subject_id in the URL must match the subject_id in the request body.

    Args:
        subject_id: ID of the subject (from URL)
        note_data: Note data from request body
        db: Database session (injected)

    Returns:
        The created note with ID

    Raises:
        400: Validation error or subject_id mismatch
        404: Subject not found
    """
    # Ensure the subject_id in the URL matches the one in the body
    if note_data.subject_id != subject_id:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subject ID in URL ({subject_id}) does not match subject ID in body ({note_data.subject_id})"
        )

    note = NoteService.create_note(db, note_data)
    return note


@router.get(
    "/notes/{note_id}",
    response_model=NoteResponse,
    summary="Get a specific note",
    description="Retrieve a single note by its ID"
)
def get_note(
    note_id: int,
    db: Session = Depends(get_db)
) -> NoteResponse:
    """
    Get a specific note by ID.

    Args:
        note_id: ID of the note
        db: Database session (injected)

    Returns:
        The note

    Raises:
        404: Note not found
    """
    note = NoteService.get_note_by_id_or_404(db, note_id)
    return note


@router.put(
    "/notes/{note_id}",
    response_model=NoteResponse,
    summary="Update a note",
    description="Update an existing note (used for auto-save)"
)
def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db)
) -> NoteResponse:
    """
    Update an existing note.

    This endpoint is used for auto-save functionality. The frontend will call
    this every few seconds as the user types.

    Only include fields you want to update in the request body.

    Args:
        note_id: ID of the note to update
        note_data: Updated note data (only fields to change)
        db: Database session (injected)

    Returns:
        The updated note

    Raises:
        404: Note not found
        400: Validation error
    """
    note = NoteService.update_note(db, note_id, note_data)
    return note


@router.delete(
    "/notes/{note_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a note",
    description="Delete an existing note"
)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db)
) -> dict:
    """
    Delete a note.

    Args:
        note_id: ID of the note to delete
        db: Database session (injected)

    Returns:
        Success message

    Raises:
        404: Note not found
    """
    result = NoteService.delete_note(db, note_id)
    return result
