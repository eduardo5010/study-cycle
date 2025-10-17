# StudyCycle - Comprehensive Learning Management Platform

## Overview

StudyCycle is an advanced learning management platform that combines study schedule optimization with gamification and course management. The platform helps users create and track study cycles while providing a comprehensive learning experience through courses, achievements, streak tracking, and competitive leagues. The system features intelligent schedule generation, progress tracking, and a rich gamification system to keep users engaged and motivated.

## Recent Updates (January 2025)

### Platform Redesign
The platform underwent a major redesign implementing a modern learning management system with:

- **New Layout**: Horizontal header with comprehensive navigation, vertical sidebar for main sections
- **Gamification System**: Streak tracking, XP system, competitive leagues, achievements, and certificates
- **Course Management**: Course enrollment, progress tracking, and course discovery
- **Enhanced Navigation**: Dedicated pages for courses, calendar, chats, events, and language learning

### Key Features Added
- **Header**: Universal search, explore menu, streak counter, notifications dropdown, comprehensive profile menu
- **Sidebar**: Quick navigation to Home, Courses, Calendar, Chats, Events, English, and Mandarin sections
- **Home Page**: Dual-section layout with gamification dashboard and integrated StudyCycle functionality
- **Courses Page**: Enrolled courses with progress tracking and course discovery with search
- **Mock Data**: Gamification features currently use mock data for demonstration purposes

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture. Key design decisions include:

- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The application uses a modular component structure with clear separation between UI components, pages, and business logic. Custom hooks handle complex state logic, while utility functions manage schedule generation algorithms.

### Backend Architecture
The backend follows a RESTful API design pattern with the following characteristics:

- **Framework**: Express.js with TypeScript for type-safe server development
- **API Design**: RESTful endpoints for CRUD operations on subjects, study settings, and study cycles
- **Data Validation**: Zod schemas for request/response validation shared between client and server
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Logging**: Custom request logging middleware for API monitoring

The server implements a clean separation between route handlers, business logic, and data access layers through the storage abstraction.

### Data Storage Solutions
The application uses a flexible storage architecture that supports both in-memory and persistent storage:

- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Fallback Storage**: In-memory storage implementation for development and testing
- **Data Models**: Strongly typed schemas using Drizzle and Zod for subjects, study settings, and study cycles

The storage layer implements a repository pattern through the IStorage interface, allowing for easy swapping between different storage implementations.

### Authentication and Authorization
Currently, the application operates without authentication, focusing on single-user functionality. The architecture supports future authentication integration through:

- **Session Management**: Express session configuration ready for user authentication
- **Middleware Structure**: Extensible middleware pattern for adding authentication layers
- **API Security**: CORS and security headers configured for production deployment

### Schedule Generation Algorithm
The core business logic implements an intelligent schedule generation system:

- **Time Distribution**: Calculates optimal subject distribution across available study time
- **Weekly Planning**: Generates multi-week study cycles based on subject requirements and daily study limits
- **Slot Management**: Creates detailed daily schedules with specific time slots for each subject
- **Overflow Handling**: Manages subjects that require more time than available in daily study periods

The algorithm prioritizes balanced subject distribution while respecting user-defined study time constraints and personal schedule preferences.

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL serverless database service via `@neondatabase/serverless`
- **Connection Management**: Environment-based database URL configuration with connection pooling

### UI and Styling Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives for components like dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **Class Variance Authority**: Utility for creating type-safe component variants

### Development and Build Tools
- **Vite**: Modern build tool for fast development and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **TypeScript**: Static type checking for both client and server code
- **Drizzle Kit**: Database toolkit for schema management and migrations

### Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library for type-safe data validation
- **Date-fns**: Date manipulation library for schedule calculations

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **Wouter**: Minimalist routing library for single-page application navigation

The application architecture emphasizes type safety, developer experience, and maintainable code structure while providing a robust foundation for study schedule management functionality.