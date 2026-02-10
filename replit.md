# Elektronova - Electrical Work Material Calculator & Job Reports

## Overview

This is a full-stack web application for **Elektronova**, an electrical services company. It allows field technicians to create, manage, and export professional job reports (procesverbal) for electrical installations on-site. The app handles client data entry, material calculations organized by room, automatic totals, and PDF generation with a professional format.

The application is built in Albanian language and is designed to be mobile-responsive for use in the field (on phones at client sites).

Key features:
- **Dashboard**: List, search, edit, and delete saved jobs
- **Job Form**: Client details + two material tables (equipment/devices and cables/materials) organized by rooms (11 room columns + totals)
- **Auto-calculation**: Row totals computed automatically from room quantities
- **PDF Generation**: Client-side PDF export using jsPDF + jspdf-autotable
- **Camera & Intercom sections**: Additional material categories for specialized installations
- **Pricing support**: Per-item pricing with grand total calculation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **React 18** with TypeScript, built with **Vite**
- **Wouter** for client-side routing (lightweight alternative to React Router)
- Routes: `/` (Dashboard), `/new` (Create Job), `/edit/:id` (Edit Job)
- **Shadcn/UI** component library (new-york style) with Radix UI primitives
- **Tailwind CSS** for styling with CSS variables for theming
- **React Hook Form** with **Zod** resolver for form validation
- **TanStack React Query** for server state management and data fetching
- **jsPDF + jspdf-autotable** for client-side PDF generation
- Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`

### Backend
- **Express 5** (Node.js) with TypeScript, run via `tsx`
- RESTful API under `/api/` prefix
- Routes defined in `server/routes.ts` with typed route definitions from `shared/routes.ts`
- Vite dev server middleware in development; static file serving in production
- HTTP server created manually (supports WebSocket upgrade if needed)

### Shared Code (`shared/`)
- **`schema.ts`**: Drizzle ORM table definitions, Zod validation schemas, and domain constants (room names, material item lists in Albanian)
- **`routes.ts`**: API route definitions with Zod input/output schemas — acts as a typed API contract between frontend and backend

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable
- **Drizzle ORM** for schema definition and queries (`drizzle-orm/node-postgres`)
- **Drizzle Kit** for migrations (`drizzle-kit push` to sync schema)
- Single `jobs` table storing client info, work metadata, and material data as JSONB columns (table1Data, table2Data, cameraData, intercomData, prices)
- Storage layer abstracted via `IStorage` interface in `server/storage.ts` (currently `DatabaseStorage` implementation)

### Data Model
The `jobs` table has:
- Client fields: name, phone, address, work date, work type, notes
- Material data stored as JSONB: `table1Data` (equipment by room), `table2Data` (cables by room), `cameraData`, `intercomData`, `prices`
- Timestamps: `createdAt`, `updatedAt`

### Build System
- Development: `tsx server/index.ts` with Vite middleware for HMR
- Production build: Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- Build script in `script/build.ts` uses allowlist approach for bundling server dependencies

### Key Design Decisions

1. **JSONB for material data**: Rather than normalizing material quantities into separate tables, all room-by-item quantities are stored as JSON objects. This simplifies the schema and makes the flexible grid data easy to save/load without complex joins.

2. **Client-side PDF generation**: PDF is generated in the browser using jsPDF rather than server-side. This keeps the server simple and works offline-capable for field use.

3. **Shared route contracts**: The `shared/routes.ts` file defines API routes with Zod schemas used by both client and server, ensuring type safety across the stack.

4. **Shadcn/UI components**: Pre-built accessible components that are copied into the project (not imported from npm), allowing full customization. Located in `client/src/components/ui/`.

## External Dependencies

### Database
- **PostgreSQL**: Required. Connection via `DATABASE_URL` environment variable. Used with `node-postgres` (pg) driver and Drizzle ORM.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: ORM and migration tooling for PostgreSQL
- **express**: HTTP server framework (v5)
- **@tanstack/react-query**: Server state management
- **jspdf** + **jspdf-autotable**: Client-side PDF generation
- **zod** + **drizzle-zod**: Schema validation
- **react-hook-form**: Form state management
- **wouter**: Client-side routing
- **date-fns**: Date formatting
- **connect-pg-simple**: PostgreSQL session store (available but may not be actively used yet)

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Dev tooling
- **@replit/vite-plugin-dev-banner**: Dev environment banner

### Fonts (External CDN)
- Google Fonts: Outfit, Plus Jakarta Sans (used as display and body fonts)
- Also loads: Architects Daughter, DM Sans, Fira Code, Geist Mono (in index.html)