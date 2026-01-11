"""
Application Configuration Module

This file manages all application settings using Pydantic's BaseSettings.
It reads environment variables and provides default values for the application.

Why Pydantic Settings?
- Type safety: Automatically validates configuration values
- Environment variables: Reads from .env file automatically
- Easy to access: Import settings anywhere in the app
- Default values: Provides sensible defaults for development
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Application settings class.

    All settings can be overridden by environment variables.
    For example, DATABASE_URL in .env will override database_url here.
    """

    # Application Info
    app_name: str = "Be a Polymath"
    app_version: str = "1.0.0"
    debug: bool = True

    # Database Configuration
    # SQLite database stored locally in data/database/polymath.db
    database_url: str = "sqlite:///./data/database/polymath.db"

    # CORS (Cross-Origin Resource Sharing) Settings
    # Allows frontend (running on port 5173) to make API calls to backend (port 8000)
    # In production, you'd restrict this to your actual frontend domain
    allowed_origins: List[str] = [
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Alternative React port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # File Upload Settings
    max_file_size: int = 10 * 1024 * 1024  # 10 MB in bytes
    upload_dir: str = "./data/resources"   # Where uploaded files are stored

    # Allowed file types for uploads (MIME types)
    # This is a security measure to prevent malicious file uploads
    allowed_file_types: List[str] = [
        # Documents
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        # Text files
        "text/plain",
        "text/markdown",
        "text/csv",
        # Images
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        # Archives
        "application/zip",
        "application/x-rar-compressed",
        # Code files
        "application/json",
        "application/xml",
    ]

    # Security Settings (for future use)
    secret_key: str = "your-secret-key-change-this-in-production"
    access_token_expire_minutes: int = 30

    class Config:
        """
        Pydantic configuration class.
        Tells Pydantic to read from .env file.
        """
        env_file = ".env"
        case_sensitive = False  # DATABASE_URL and database_url both work


# Create a single instance of settings to use throughout the application
# This is a singleton pattern - only one Settings object exists
settings = Settings()


# Helper function to ensure required directories exist
def create_data_directories():
    """
    Creates necessary data directories if they don't exist.
    Called when the application starts.
    """
    directories = [
        "./data",
        "./data/database",
        "./data/resources",
        "./data/backups",
    ]

    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ Ensured directory exists: {directory}")
