# Be a Polymath - Frontend

React + Vite + TypeScript frontend for the Be a Polymath note-taking application.

## Setup Instructions

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components (button, card, etc.)
│   │   ├── layout/          # Layout components (Header, Layout)
│   │   ├── subject/         # Subject-related components (Phase 2)
│   │   ├── notes/           # Note editor components (Phase 3)
│   │   ├── resources/       # File/folder components (Phase 4)
│   │   └── common/          # Shared components
│   ├── pages/               # Page components
│   │   └── HomePage.tsx     # Main landing page
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services (axios)
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Helper functions (cn, etc.)
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                   # Static assets
├── components.json           # shadcn/ui configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies

```

## Key Technologies

### React + Vite
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool with instant HMR
- **TypeScript**: Type safety and better developer experience

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Copy-paste component library (accessible, customizable)
- **Framer Motion**: Animation library (Phase 6)

### State Management
- **@tanstack/react-query**: Server state management and caching
- **React Context**: Global UI state (theme, etc.)

### Routing
- **react-router-dom**: Client-side routing (Phase 5)

### API Communication
- **axios**: HTTP client for API requests

## File Explanations

### Configuration Files

**`vite.config.ts`**
- Configures Vite build tool
- Sets up path aliases (@/ → src/)
- Configures React plugin

**`tailwind.config.js`**
- Tailwind CSS configuration
- Custom colors, animations, plugins
- Dark mode settings

**`postcss.config.js`**
- PostCSS configuration for Tailwind
- Autoprefixer for browser compatibility

**`components.json`**
- shadcn/ui configuration
- Defines component installation paths
- Styling preferences

**`tsconfig.json` / `tsconfig.app.json`**
- TypeScript compiler configuration
- Path aliases configuration
- Strict type checking settings

### Source Files

**`src/main.tsx`**
- Application entry point
- Renders root React component
- Imports global CSS

**`src/App.tsx`**
- Root React component
- Wraps app with providers (Layout, Router, Query Client)
- Defines app structure

**`src/index.css`**
- Global styles with Tailwind directives
- Base layer, components, utilities
- Custom CSS classes

**`src/lib/utils.ts`**
- Utility functions
- `cn()`: Merges Tailwind classes intelligently
- Helper functions for common operations

### Components

**`src/components/layout/Header.tsx`**
- App header with logo and navigation
- Sticky positioning
- Breadcrumb navigation (Phase 5)

**`src/components/layout/Layout.tsx`**
- Main layout wrapper
- Provides consistent structure
- Wraps all pages

**`src/pages/HomePage.tsx`**
- Main landing page
- Shows all subjects (Phase 2)
- Empty state when no subjects

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of this:
import { Button } from "../../../components/ui/button"

// You can write:
import { Button } from "@/components/ui/button"
```

Aliases configured:
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- etc.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests (Phase 7)
npm run test
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- No IE11 support (uses modern JavaScript)

## Next Steps

**Phase 2: Subject Management**
- Create Subject components (Card, Grid, Dialog)
- Implement CRUD API calls
- Add form validation

**Phase 3: Rich Text Editor**
- Install TipTap packages
- Create NoteEditor component
- Implement auto-save

**Phase 4: File Upload**
- Add react-dropzone
- Create FolderTree component
- Implement drag-drop upload

**Phase 5: Navigation**
- Set up React Router
- Create SubjectDetailPage
- Add breadcrumb navigation

**Phase 6: Polish**
- Add animations with Framer Motion
- Implement loading skeletons
- Add keyboard shortcuts
- Dark mode (optional)

**Phase 7: Testing**
- Install Vitest
- Write component tests
- Add E2E tests (optional)
