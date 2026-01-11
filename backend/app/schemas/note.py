"""
Note Pydantic Schemas

These schemas define the data structure for API requests and responses.

Pydantic provides automatic validation and serialization/deserialization.

Why separate schemas from models?
- Models are for database (SQLAlchemy)
- Schemas are for API (Pydantic)
- This separation allows different representations for different purposes

Schema Types:
- NoteBase: Common fields shared by all schemas
- NoteCreate: Fields required to create a note
- NoteUpdate: Fields that can be updated (all optional)
- NoteResponse: Complete note data returned by API
- NoteList: List of notes with metadata
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
import json


class NoteBase(BaseModel):
    """
    Base schema with common note fields.

    Other schemas inherit from this to avoid repeating fields.
    """
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Note title",
        examples=["Introduction to Calculus"]
    )

    content_json: str = Field(
        default="{}",
        description="Rich text content as JSON (TipTap format)",
        examples=['{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello"}]}]}']
    )

    @field_validator('content_json')
    @classmethod
    def validate_json(cls, v: str) -> str:
        """
        Validate that content_json is valid JSON.

        Raises:
            ValueError: If content is not valid JSON
        """
        try:
            json.loads(v)
            return v
        except json.JSONDecodeError:
            raise ValueError("content_json must be valid JSON")


class NoteCreate(NoteBase):
    """
    Schema for creating a new note.

    Requires:
    - subject_id: Which subject this note belongs to
    - title: Note title

    Optional:
    - content_json: Initial content (defaults to empty TipTap doc)

    Example:
        {
            "subject_id": 1,
            "title": "My First Note",
            "content_json": "{}"
        }
    """
    subject_id: int = Field(
        ...,
        gt=0,
        description="ID of the subject this note belongs to",
        examples=[1, 2, 3]
    )


class NoteUpdate(BaseModel):
    """
    Schema for updating an existing note.

    All fields are optional - only include fields you want to update.

    Example (update only title):
        {
            "title": "Updated Title"
        }

    Example (update only content):
        {
            "content_json": '{"type":"doc","content":[]}'
        }
    """
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Updated note title"
    )

    content_json: Optional[str] = Field(
        None,
        description="Updated rich text content as JSON"
    )

    @field_validator('content_json')
    @classmethod
    def validate_json(cls, v: Optional[str]) -> Optional[str]:
        """Validate JSON if provided"""
        if v is not None:
            try:
                json.loads(v)
                return v
            except json.JSONDecodeError:
                raise ValueError("content_json must be valid JSON")
        return v


class NoteResponse(NoteBase):
    """
    Schema for note data returned by the API.

    Includes all fields including database-generated ones (id).

    This is what clients receive when they request note data.

    The Config class tells Pydantic to work with SQLAlchemy models.
    """
    id: int = Field(
        ...,
        description="Unique note identifier",
        examples=[1, 2, 3]
    )

    subject_id: int = Field(
        ...,
        description="ID of the subject this note belongs to",
        examples=[1, 2, 3]
    )

    model_config = {
        "from_attributes": True,  # Allows creating from SQLAlchemy models
        "json_schema_extra": {
            "example": {
                "id": 1,
                "subject_id": 1,
                "title": "Introduction to Calculus",
                "content_json": '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Calculus is..."}]}]}'
            }
        }
    }


class NoteList(BaseModel):
    """
    Schema for a list of notes with metadata.

    Useful for paginated responses or providing additional context.

    Example response:
        {
            "notes": [...],
            "total": 15,
            "subject_id": 1
        }
    """
    notes: list[NoteResponse] = Field(
        default_factory=list,
        description="List of notes"
    )

    total: int = Field(
        ...,
        ge=0,
        description="Total number of notes",
        examples=[0, 5, 15]
    )

    subject_id: Optional[int] = Field(
        None,
        description="Subject ID if filtered by subject",
        examples=[1, 2, 3]
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "notes": [
                    {
                        "id": 1,
                        "subject_id": 1,
                        "title": "Note 1",
                        "content_json": "{}"
                    }
                ],
                "total": 1,
                "subject_id": 1
            }
        }
    }
