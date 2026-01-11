# Be a Polymath

A modern, feature-rich note-taking web application for managing multiple subjects with rich text notes and resource management.

## Overview

Be a Polymath helps you master multiple subjects by providing:
- **Subject Organization**: Create and manage multiple subjects with custom colors
- **Rich Text Notes**: Advanced note-taking with TipTap editor (markdown, formatting, code blocks, etc.)
- **Resource Management**: Upload and organize files in nested folders for each subject
- **Beautiful UI**: Professional, smooth interface built with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- **React 18** + **Vite** - Fast, modern React development
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible, customizable components
- **TipTap** - Rich text editor (Phase 3)
- **Framer Motion** - Smooth animations (Phase 6)
- **React Query** - Server state management
- **React Router** - Client-side routing (Phase 5)

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Local database
- **Pydantic** - Data validation
- **aiofiles** - Async file operations

## Project Structure

```
be_a_polymath/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
│
└── data/              # Local storage (auto-created)
    ├── database/
    └── resources/
```

## Quick Start

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 20+** (for frontend)
- **npm** or **yarn** (package manager)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run server
uvicorn app.main:app --reload
```

Backend will run on: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Development Phases

This project is built in 7 phases to facilitate learning:

### ✅ Phase 1: Foundation & Basic Setup (CURRENT)
- Backend FastAPI server with database
- Frontend React + Vite + TypeScript
- Tailwind CSS + shadcn/ui setup
- Basic Layout and Header

### 📋 Phase 2: Subject Management
- Create, read, update, delete subjects
- Subject cards with colors
- Grid layout with animations
- Form validation

### 📋 Phase 3: Rich Text Note Editor
- TipTap editor integration
- Formatting toolbar (bold, italic, headings, lists, code)
- Auto-save functionality
- Note list and preview

### 📋 Phase 4: Resource Management & File Upload
- Nested folder structure
- Drag-drop file upload
- File download
- Context menus for folders

### 📋 Phase 5: Subject Detail Page & Navigation
- React Router setup
- Subject detail page with tabs
- Breadcrumb navigation
- Page transitions

### 📋 Phase 6: Polish, Animations & UX
- Framer Motion animations
- Loading skeletons
- Empty states
- Keyboard shortcuts
- Search functionality
- Dark mode (optional)

### 📋 Phase 7: Testing & Documentation
- Unit tests (Vitest)
- Component tests (React Testing Library)
- Integration tests
- Comprehensive documentation

## Features

### Current (Phase 1)
- ✅ FastAPI backend with auto-documentation
- ✅ React frontend with TypeScript
- ✅ Tailwind CSS styling
- ✅ Project structure and foundation

### Upcoming
- 📝 Subject management with CRUD operations
- 📝 Rich text note editor with auto-save
- 📝 File upload and folder management
- 📝 Smooth animations and transitions
- 📝 Search and filtering
- 📝 Keyboard shortcuts
- 📝 Responsive design

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs` (interactive API testing)
- **ReDoc**: `http://localhost:8000/redoc` (alternative documentation)

## Database Schema

### Subjects Table
```sql
- id: INTEGER (Primary Key)
- name: VARCHAR (Unique)
- description: TEXT
- color: VARCHAR (hex color)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Notes Table (Phase 3)
```sql
- id: INTEGER (Primary Key)
- subject_id: INTEGER (Foreign Key)
- title: VARCHAR
- content_json: TEXT (TipTap JSON)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Resources Table (Phase 4)
```sql
- id: INTEGER (Primary Key)
- subject_id: INTEGER (Foreign Key)
- parent_id: INTEGER (Self-referencing FK)
- name: VARCHAR
- type: VARCHAR (folder/file)
- file_path: VARCHAR
- file_size: INTEGER
- mime_type: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## File Structure Explained

### Backend Files

**`backend/app/main.py`**
- FastAPI application entry point
- CORS configuration
- Router registration
- Startup/shutdown events

**`backend/app/core/config.py`**
- Application settings (Pydantic)
- Environment variables
- File upload limits and allowed types

**`backend/app/core/database.py`**
- SQLAlchemy setup
- Database session management
- Table creation

**`backend/app/models/`**
- SQLAlchemy database models
- Table definitions with relationships

**`backend/app/schemas/`**
- Pydantic validation schemas
- Request/response models

**`backend/app/services/`**
- Business logic
- CRUD operations
- File storage management

**`backend/app/api/v1/`**
- API route handlers
- Endpoint definitions

### Frontend Files

**`frontend/src/App.tsx`**
- Root React component
- Provider wrappers (Router, Query Client)

**`frontend/src/components/layout/`**
- Header, Layout, Footer
- App-wide components

**`frontend/src/pages/`**
- Page components (HomePage, SubjectDetailPage)

**`frontend/src/hooks/`**
- Custom React hooks
- useSubjects, useNotes, useResources

**`frontend/src/services/`**
- API communication (axios)
- HTTP requests to backend

**`frontend/src/lib/utils.ts`**
- Utility functions
- `cn()` for className merging

## Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=sqlite:///./data/database/polymath.db
SECRET_KEY=your-secret-key
MAX_FILE_SIZE=10485760
DEBUG=True
```

### Frontend
No environment variables needed for Phase 1.
Future phases may add:
```env
VITE_API_URL=http://localhost:8000
```

## Contributing

This is a learning project! Feel free to:
1. Experiment with the code
2. Add new features
3. Improve existing functionality
4. Customize the UI

## Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **TipTap**: https://tiptap.dev/
- **React Query**: https://tanstack.com/query/latest

## License

This is an educational project - use it however you like!

## Next Steps

1. **Start both servers** (backend and frontend)
2. **Verify Phase 1** is working correctly
3. **Move to Phase 2** - Implement subject management

---

**Made with ❤️ for learning web development**
