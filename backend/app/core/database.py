"""
Database Configuration Module

This file sets up SQLAlchemy (Python's most popular ORM - Object Relational Mapper).
It manages database connections and provides a session for database operations.

Key Concepts:
- ORM: Allows you to work with database tables as Python classes
- Session: A workspace for database operations (like a transaction)
- Base: Parent class for all database models
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create database engine
# The engine is the core interface to the database
# check_same_thread=False is needed for SQLite to work with FastAPI's async nature
# connect_args is only used for SQLite
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=settings.debug  # Log all SQL queries when debug=True (great for learning!)
)

# Create a SessionLocal class
# Each instance of SessionLocal will be a database session
# autocommit=False: Changes are not automatically saved (safer)
# autoflush=False: Don't automatically flush changes to DB
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create a Base class for database models
# All database models (Subject, Note, Resource) will inherit from this
# This gives them the ability to be mapped to database tables
Base = declarative_base()


# Dependency function for FastAPI
# This provides a database session to API endpoints
# The session is automatically closed after the request is done
def get_db():
    """
    Database session dependency.

    Usage in FastAPI endpoints:
    @app.get("/subjects")
    def get_subjects(db: Session = Depends(get_db)):
        # Use db here to query database
        pass

    The 'yield' keyword makes this a generator:
    - Code before 'yield' runs before the request
    - Code after 'yield' runs after the request (cleanup)
    """
    db = SessionLocal()
    try:
        yield db  # Provide the session to the endpoint
    finally:
        db.close()  # Always close the session, even if there's an error


# Function to create all database tables
def init_db():
    """
    Initialize the database by creating all tables.

    This imports all models and creates their tables in the database.
    Called when the application starts.
    """
    # Import all models here to ensure they're registered with Base
    # This is done here to avoid circular imports
    from app.models import subject, note, resource

    # Create all tables defined in models
    # If tables already exist, this does nothing
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables initialized")
