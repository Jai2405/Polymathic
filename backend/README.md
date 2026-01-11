# Be a Polymath - Backend

FastAPI backend for the Be a Polymath note-taking application.

## Setup Instructions

### 1. Create Python Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if you need custom settings (optional for development)
```

### 4. Run the Server

```bash
# Make sure you're in the backend directory with venv activated
uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000`

### 5. Access API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs (interactive API documentation)
- **ReDoc**: http://localhost:8000/redoc (alternative documentation)
- **Health Check**: http://localhost:8000/health

## Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints (subjects, notes, resources)
│   ├── core/            # Core config (settings, database)
│   ├── models/          # SQLAlchemy database models
│   ├── schemas/         # Pydantic validation schemas
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── data/                # Local data storage (auto-created)
│   ├── database/        # SQLite database
│   └── resources/       # Uploaded files
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables (created from .env.example)
```

## Key Files Explained

### `app/main.py`
- Entry point for the FastAPI application
- Configures CORS for frontend communication
- Registers API routes
- Handles application startup/shutdown

### `app/core/config.py`
- Application settings and configuration
- Reads environment variables
- Defines allowed file types, size limits, etc.

### `app/core/database.py`
- SQLAlchemy database setup
- Provides database sessions to API endpoints
- Creates database tables on startup

## Development

### Auto-reload
The `--reload` flag enables auto-reload when you save files. The server will automatically restart with your changes.

### Database
The SQLite database is stored in `data/database/polymath.db`. It's automatically created when you first run the server.

### Uploaded Files
Files uploaded through the API are stored in `data/resources/{subject_id}/`

## Next Steps

- Phase 2: Implement Subject model and CRUD endpoints
- Phase 3: Add Note model with TipTap content storage
- Phase 4: Implement file upload and resource management
