"""
Subject Pydantic Schemas

Pydantic schemas define the shape of data for API requests and responses.
They provide automatic validation and documentation.

Why separate schemas from models?
- Models (SQLAlchemy) = Database structure
- Schemas (Pydantic) = API contract (what clients send/receive)
- This separation allows flexibility (e.g., hide sensitive fields, add computed fields)

Schemas in this file:
- SubjectBase: Shared fields between create/update
- SubjectCreate: Fields required to create a subject
- SubjectUpdate: Fields that can be updated (all optional)
- SubjectResponse: What the API returns (includes id)
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class SubjectBase(BaseModel):
    """
    Base schema with fields common to create and update operations.

    This is the parent class that other schemas inherit from.
    """

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Name of the subject",
        examples=["Advanced Mathematics", "Python Programming", "World History"]
    )

    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Optional description of the subject",
        examples=["Covering calculus, linear algebra, and differential equations"]
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """
        Validate subject name.

        Rules:
        - Must not be only whitespace
        - Trim leading/trailing whitespace

        Args:
            v: The name value to validate

        Returns:
            str: Cleaned name

        Raises:
            ValueError: If name is invalid
        """
        # Trim whitespace
        v = v.strip()

        # Check if empty after trimming
        if not v:
            raise ValueError("Subject name cannot be empty or only whitespace")

        return v


class SubjectCreate(SubjectBase):
    """
    Schema for creating a new subject.

    Inherits all fields from SubjectBase.
    Only name is required, description is optional.

    Example request body:
    {
        "name": "Advanced Mathematics",
        "description": "Calculus and linear algebra"
    }
    """
    pass


class SubjectUpdate(BaseModel):
    """
    Schema for updating an existing subject.

    All fields are optional - only include the fields you want to update.

    Example request body (update only name):
    {
        "name": "Advanced Calculus"
    }

    Example request body (update description only):
    {
        "description": "New description here"
    }
    """

    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Updated name of the subject"
    )

    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Updated description"
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        """Validate name if provided"""
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Subject name cannot be empty or only whitespace")
        return v


class SubjectResponse(SubjectBase):
    """
    Schema for subject responses from the API.

    Includes all base fields plus:
    - id: Database ID

    This is what the frontend receives when fetching subjects.

    Example response:
    {
        "id": 1,
        "name": "Advanced Mathematics",
        "description": "Calculus and linear algebra"
    }
    """

    id: int = Field(
        ...,
        description="Unique identifier for the subject"
    )

    class Config:
        """
        Pydantic configuration.

        from_attributes=True allows Pydantic to read data from SQLAlchemy models
        (previously called orm_mode in Pydantic v1)
        """
        from_attributes = True


class SubjectList(BaseModel):
    """
    Schema for list of subjects response.

    Used when returning multiple subjects (e.g., GET /api/v1/subjects)

    Example response:
    {
        "subjects": [...],
        "total": 5
    }
    """

    subjects: list[SubjectResponse] = Field(
        ...,
        description="List of subjects"
    )

    total: int = Field(
        ...,
        description="Total number of subjects"
    )
