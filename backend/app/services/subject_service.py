"""
Subject Service Layer

This file contains business logic for subject operations (CRUD).

Why have a service layer?
- Separates business logic from API routes
- Makes code reusable (can be used from different endpoints)
- Easier to test
- Cleaner code organization

CRUD Operations:
- Create: Add new subject
- Read: Get one or all subjects
- Update: Modify existing subject
- Delete: Remove subject
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from fastapi import HTTPException, status

from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate


class SubjectService:
    """
    Service class for subject-related operations.

    All methods are static (no need to create an instance).
    Each method receives a database session as a parameter.
    """

    @staticmethod
    def create_subject(db: Session, subject_data: SubjectCreate) -> Subject:
        """
        Create a new subject in the database.

        Args:
            db: Database session
            subject_data: Subject data from request (validated by Pydantic)

        Returns:
            Subject: The created subject with ID and timestamps

        Raises:
            HTTPException 400: If subject name already exists

        Example:
            subject = SubjectService.create_subject(db, SubjectCreate(
                name="Mathematics",
                description="Advanced math topics",
                color="#3b82f6"
            ))
        """
        # Create new Subject instance from Pydantic schema
        db_subject = Subject(
            name=subject_data.name,
            description=subject_data.description
        )

        try:
            # Add to database session
            db.add(db_subject)

            # Commit the transaction (save to database)
            db.commit()

            # Refresh to get the ID and timestamps from database
            db.refresh(db_subject)

            return db_subject

        except IntegrityError:
            # This happens if subject name already exists (unique constraint)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Subject with name '{subject_data.name}' already exists"
            )

    @staticmethod
    def get_all_subjects(db: Session) -> List[Subject]:
        """
        Get all subjects from the database.

        Args:
            db: Database session

        Returns:
            List[Subject]: List of all subjects, ordered by creation date (newest first)

        Example:
            subjects = SubjectService.get_all_subjects(db)
            print(f"Found {len(subjects)} subjects")
        """
        # Query all subjects, order by name alphabetically
        subjects = db.query(Subject).order_by(Subject.name).all()
        return subjects

    @staticmethod
    def get_subject_by_id(db: Session, subject_id: int) -> Optional[Subject]:
        """
        Get a single subject by its ID.

        Args:
            db: Database session
            subject_id: ID of the subject to retrieve

        Returns:
            Subject or None: The subject if found, None otherwise

        Example:
            subject = SubjectService.get_subject_by_id(db, 1)
            if subject:
                print(f"Found: {subject.name}")
            else:
                print("Subject not found")
        """
        subject = db.query(Subject).filter(Subject.id == subject_id).first()
        return subject

    @staticmethod
    def get_subject_by_id_or_404(db: Session, subject_id: int) -> Subject:
        """
        Get a subject by ID or raise 404 if not found.

        Args:
            db: Database session
            subject_id: ID of the subject to retrieve

        Returns:
            Subject: The subject

        Raises:
            HTTPException 404: If subject not found

        Example:
            # This will automatically raise 404 if subject doesn't exist
            subject = SubjectService.get_subject_by_id_or_404(db, 1)
        """
        subject = SubjectService.get_subject_by_id(db, subject_id)

        if not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subject with id {subject_id} not found"
            )

        return subject

    @staticmethod
    def update_subject(
        db: Session,
        subject_id: int,
        subject_data: SubjectUpdate
    ) -> Subject:
        """
        Update an existing subject.

        Args:
            db: Database session
            subject_id: ID of the subject to update
            subject_data: Updated subject data (only include fields to change)

        Returns:
            Subject: The updated subject

        Raises:
            HTTPException 404: If subject not found
            HTTPException 400: If new name conflicts with existing subject

        Example:
            updated = SubjectService.update_subject(db, 1, SubjectUpdate(
                name="Advanced Mathematics"
            ))
        """
        # Get existing subject (raises 404 if not found)
        subject = SubjectService.get_subject_by_id_or_404(db, subject_id)

        # Update only the fields that were provided
        # exclude_unset=True means only include fields that were actually set in the request
        update_data = subject_data.model_dump(exclude_unset=True)

        try:
            # Update each field
            for field, value in update_data.items():
                setattr(subject, field, value)

            # Commit changes
            db.commit()

            # Refresh to get updated timestamps
            db.refresh(subject)

            return subject

        except IntegrityError:
            # Name conflict with another subject
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Subject with name '{subject_data.name}' already exists"
            )

    @staticmethod
    def delete_subject(db: Session, subject_id: int) -> dict:
        """
        Delete a subject from the database.

        Args:
            db: Database session
            subject_id: ID of the subject to delete

        Returns:
            dict: Success message

        Raises:
            HTTPException 404: If subject not found

        Example:
            result = SubjectService.delete_subject(db, 1)
            print(result["message"])  # "Subject deleted successfully"
        """
        # Get subject (raises 404 if not found)
        subject = SubjectService.get_subject_by_id_or_404(db, subject_id)

        # Delete from database
        db.delete(subject)
        db.commit()

        return {
            "message": "Subject deleted successfully",
            "subject_id": subject_id
        }

    @staticmethod
    def get_subject_count(db: Session) -> int:
        """
        Get the total number of subjects.

        Args:
            db: Database session

        Returns:
            int: Total count of subjects

        Example:
            count = SubjectService.get_subject_count(db)
            print(f"You have {count} subjects")
        """
        return db.query(Subject).count()
