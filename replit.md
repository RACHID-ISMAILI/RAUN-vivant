# Time Capsule Social Platform

## Overview

This is a full-stack social media application built with a modern tech stack featuring React frontend, Express backend, and PostgreSQL database. The application has a unique Matrix-inspired cyberpunk aesthetic and allows users to create "time capsules" (posts) that can be liked, disliked, and commented on.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Matrix-themed design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Session Management**: Simple in-memory session storage (currentUser variable)
- **Error Handling**: Centralized error middleware with structured responses

### Database Architecture
- **Database**: PostgreSQL (configured for, but currently using in-memory storage)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migration**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless driver

## Key Components

### Authentication System
- Simple username/password authentication
- Auto-registration on first login attempt
- Session-based authentication (stored in memory)
- Protected routes requiring authentication

### Data Models
- **Users**: ID, username, password
- **Capsules**: ID, content, likes, dislikes, timestamps
- **Comments**: ID, capsule reference, username, content, timestamps
- **Votes**: ID, capsule reference, username, vote type (like/dislike)

### Frontend Components
- **Matrix Rain Animation**: Animated background with falling characters
- **Profile Header**: Circular profile image with rotating text
- **Capsule Cards**: Interactive post cards with voting and commenting
- **Auth Modal**: Login/registration modal with form validation
- **Toast Notifications**: User feedback for actions

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user info
- `GET /api/capsules` - Fetch all capsules
- `POST /api/capsules` - Create new capsule
- `POST /api/capsules/:id/vote` - Vote on capsule
- `GET /api/capsules/:id/comments` - Get comments for capsule
- `POST /api/capsules/:id/comments` - Add comment to capsule

## Data Flow

1. **Authentication Flow**: Users authenticate via modal, session stored in memory
2. **Capsule Creation**: Authenticated users can create new time capsules
3. **Interaction Flow**: Users can vote and comment on capsules
4. **Real-time Updates**: TanStack Query handles cache invalidation and updates
5. **Error Handling**: Centralized error handling with user-friendly messages

## External Dependencies

### Production Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-zod` for database operations
- **UI**: Comprehensive Radix UI component suite
- **State**: `@tanstack/react-query` for server state management
- **Validation**: `zod` for runtime type validation
- **Styling**: `tailwindcss`, `class-variance-authority`, `clsx`

### Development Dependencies
- **Build**: `vite`, `esbuild` for production builds
- **Types**: `@types/node`, TypeScript configuration
- **Development**: `tsx` for TypeScript execution
- **Replit Integration**: Cartographer and runtime error modal plugins

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: Drizzle push for schema updates
- **Environment**: NODE_ENV=development with Replit integration

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Database**: Migrations handled by Drizzle Kit
- **Deployment**: Single Node.js process serving both API and static files

### Current Storage Implementation
- **Development**: In-memory storage with MemStorage class
- **Production Ready**: Configured for PostgreSQL via Drizzle ORM
- **Migration Path**: Easy transition from memory to persistent storage

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required for production)
- **Session Storage**: Currently in-memory, ready for Redis/database sessions
- **File Serving**: Express static middleware for production builds

The application is designed with a clean separation of concerns, making it easy to scale and maintain. The Matrix-themed UI provides a unique user experience while the robust backend architecture ensures reliable data handling and user management.