"""
Main FastAPI Application

This is the entry point for the backend application.
It sets up the FastAPI app, configures CORS, registers routes, and starts the server.

To run this application:
    uvicorn app.main:app --reload

The --reload flag enables auto-reload when code changes (development only).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings, create_data_directories
from app.core.database import init_db

# Create the FastAPI application instance
# This is the main application object that handles all HTTP requests
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A powerful note-taking application for managing multiple subjects with rich notes and resources",
    # Automatic API documentation will be available at:
    # - http://localhost:8000/docs (Swagger UI - interactive)
    # - http://localhost:8000/redoc (ReDoc - alternative documentation)
)


# Configure CORS (Cross-Origin Resource Sharing)
# This allows the frontend (React app) to make requests to the backend
# Without CORS, browsers block requests from different origins (security feature)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # Which domains can access the API
    allow_credentials=True,                   # Allow cookies and authentication
    allow_methods=["*"],                      # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],                      # Allow all headers
)


# Application startup event
# This runs once when the server starts
@app.on_event("startup")
async def startup_event():
    """
    Initialize the application on startup.

    This function:
    1. Creates necessary data directories
    2. Initializes the database (creates tables if they don't exist)
    """
    print(f"\n🚀 Starting {settings.app_name} v{settings.app_version}")
    print("=" * 50)

    # Create data directories
    create_data_directories()

    # Initialize database tables
    init_db()

    print("=" * 50)
    print(f"✓ {settings.app_name} is ready!")
    print(f"📚 API Documentation: http://localhost:8000/docs")
    print(f"🔧 Alternative Docs: http://localhost:8000/redoc")
    print("=" * 50 + "\n")


# Application shutdown event
# This runs once when the server stops
@app.on_event("shutdown")
async def shutdown_event():
    """
    Cleanup on application shutdown.
    """
    print(f"\n👋 Shutting down {settings.app_name}...")


# Health check endpoint
# This is a simple endpoint to verify the server is running
# Useful for monitoring and testing
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Status information about the application

    Example response:
        {
            "status": "healthy",
            "app_name": "Be a Polymath",
            "version": "1.0.0"
        }
    """
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.app_version
    }


# Root endpoint
# This is what users see when they visit http://localhost:8000
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with welcome message and API information.
    """
    return {
        "message": f"Welcome to {settings.app_name} API",
        "version": settings.app_version,
        "documentation": "/docs",
        "alternative_docs": "/redoc",
        "health_check": "/health"
    }


# Register API routers
# Routers organize endpoints into logical groups
# Import routers from api/v1 directory
from app.api.v1 import subjects, notes

# Register subject routes
# All routes in subjects.router will be prefixed with /api/v1
# and tagged as "Subjects" in the API documentation
app.include_router(
    subjects.router,
    prefix="/api/v1",
    tags=["Subjects"]
)

# Register note routes (Phase 3)
app.include_router(
    notes.router,
    prefix="/api/v1",
    tags=["Notes"]
)

# Additional routers will be added in future phases:
# - resources.router (Phase 4)


# If you run this file directly with: python app/main.py
# It will start the uvicorn server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",     # Listen on all network interfaces
        port=8000,           # Port number
        reload=True,         # Auto-reload on code changes
        log_level="info"     # Logging level
    )
