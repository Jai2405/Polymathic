"""
Subject API Endpoints

This file defines all HTTP endpoints for subject management.

REST API Design:
- GET    /api/v1/subjects       - List all subjects
- POST   /api/v1/subjects       - Create new subject
- GET    /api/v1/subjects/{id}  - Get single subject
- PUT    /api/v1/subjects/{id}  - Update subject
- DELETE /api/v1/subjects/{id}  - Delete subject

Each endpoint:
1. Receives the HTTP request
2. Validates data (Pydantic schemas)
3. Calls the service layer
4. Returns the response
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse, SubjectList
from app.services.subject_service import SubjectService

# Create router for subject endpoints
# All routes in this router will be prefixed with /api/v1 (set in main.py)
router = APIRouter()


@router.get("/subjects", response_model=SubjectList, status_code=status.HTTP_200_OK)
def get_all_subjects(db: Session = Depends(get_db)):
    """
    Get all subjects.

    Returns a list of all subjects ordered by creation date (newest first).

    **Response:**
    ```json
    {
        "subjects": [
            {
                "id": 1,
                "name": "Mathematics",
                "description": "Advanced math topics"
            }
        ],
        "total": 1
    }
    ```
    """
    subjects = SubjectService.get_all_subjects(db)
    return {
        "subjects": subjects,
        "total": len(subjects)
    }


@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    """
    Create a new subject.

    **Request Body:**
    ```json
    {
        "name": "Mathematics",
        "description": "Advanced math topics"  # Optional
    }
    ```

    **Validation:**
    - Name: Required, 1-255 characters, must be unique
    - Description: Optional, max 1000 characters

    **Returns:** The created subject with ID and timestamps

    **Errors:**
    - 400: Subject name already exists
    - 422: Validation error (invalid data)
    """
    return SubjectService.create_subject(db, subject)


@router.get("/subjects/{subject_id}", response_model=SubjectResponse, status_code=status.HTTP_200_OK)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """
    Get a single subject by ID.

    **Path Parameters:**
    - subject_id: Integer ID of the subject

    **Returns:** The subject with the given ID

    **Errors:**
    - 404: Subject not found
    """
    return SubjectService.get_subject_by_id_or_404(db, subject_id)


@router.put("/subjects/{subject_id}", response_model=SubjectResponse, status_code=status.HTTP_200_OK)
def update_subject(
    subject_id: int,
    subject: SubjectUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing subject.

    **Path Parameters:**
    - subject_id: Integer ID of the subject to update

    **Request Body:**
    All fields are optional - only include fields you want to update:
    ```json
    {
        "name": "Advanced Mathematics",  # Optional
        "description": "New description"  # Optional
    }
    ```

    **Examples:**

    Update only the name:
    ```json
    {
        "name": "Advanced Calculus"
    }
    ```

    Update only the description:
    ```json
    {
        "description": "Updated description"
    }
    ```

    **Returns:** The updated subject

    **Errors:**
    - 404: Subject not found
    - 400: New name conflicts with existing subject
    - 422: Validation error
    """
    return SubjectService.update_subject(db, subject_id, subject)


@router.delete("/subjects/{subject_id}", status_code=status.HTTP_200_OK)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    """
    Delete a subject.

    **Path Parameters:**
    - subject_id: Integer ID of the subject to delete

    **Returns:**
    ```json
    {
        "message": "Subject deleted successfully",
        "subject_id": 1
    }
    ```

    **Errors:**
    - 404: Subject not found

    **Note:** In Phase 3 and 4, this will also delete all associated notes and resources
    (cascade delete).
    """
    return SubjectService.delete_subject(db, subject_id)


@router.get("/subjects/count", status_code=status.HTTP_200_OK)
def get_subject_count(db: Session = Depends(get_db)):
    """
    Get total number of subjects.

    Useful for displaying statistics.

    **Returns:**
    ```json
    {
        "count": 5
    }
    ```
    """
    count = SubjectService.get_subject_count(db)
    return {"count": count}
