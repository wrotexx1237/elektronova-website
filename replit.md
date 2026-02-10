# Elektronova - Electrical Work Material Calculator & Job Reports

## Overview

This is a full-stack web application for **Elektronova**, an electrical services company. It allows field technicians to create, manage, and export professional job reports (procesverbal) for electrical installations on-site. The app handles client data entry, material calculations organized by room, automatic totals, and PDF generation with a professional format.

The application is built in Albanian language and is designed to be mobile-responsive for use in the field (on phones at client sites).

Key features:
- **Dashboard**: List, search, edit, and delete saved jobs + Quick Create by Category cards
- **Job Categories**: 4 work categories (Rrymë/Elektrike, Kamera, Alarm, Interfon) with category-specific UI filtering
- **Category-based Form**: Job form shows only relevant tabs/sections for the selected category
- **Job Form**: Client details + material tables organized by rooms (11 room columns + totals)
- **6 Material Categories**: Pajisje elektrike, Kabllo & Gypa, Kamera, Interfon, Alarm, Punë/Shërbime
- **Dynamic Catalog System**: Admin-managed catalog of items with units, prices per category
- **Intelligent Checklists**: Category-specific checklists (Elektrike, Kamera, Alarm, Interfon, Final)
- **Auto-calculation**: Row totals computed automatically from room quantities
- **PDF Generation**: Client-side PDF export using jsPDF + jspdf-autotable with category info
- **Pricing support**: Per-item pricing with grand total calculation (scoped to category)
- **Warnings system**: Final control warnings for incomplete checklist items
- **Category Filter**: Dashboard filter by category with badge display on job cards

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **React 18** with TypeScript, built with **Vite**
- **Wouter** for client-side routing (lightweight alternative to React Router)
- Routes: `/` (Dashboard), `/new` (Create Job), `/edit/:id` (Edit Job), `/admin` (Catalog Management)
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
- **`schema.ts`**: Drizzle ORM table definitions, Zod validation schemas, domain constants (room names, checklist templates, categories, units in Albanian)
- **`routes.ts`**: API route definitions with Zod input/output schemas — acts as a typed API contract between frontend and backend

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable
- **Drizzle ORM** for schema definition and queries (`drizzle-orm/node-postgres`)
- **Drizzle Kit** for migrations (`drizzle-kit push` to sync schema)
- Two tables:
  - `jobs` - stores client info, work metadata, and material data as JSONB columns
  - `catalog_items` - dynamic catalog of items per category with units and prices
- Storage layer abstracted via `IStorage` interface in `server/storage.ts` (currently `DatabaseStorage` implementation)

### Data Model

**`catalog_items` table:**
- id, category, name, unit, purchasePrice, servicePrice, notes, sortOrder, createdAt

**`jobs` table:**
- Client fields: clientName, clientPhone, clientAddress, workDate, workType, notes
- Material data as JSONB: table1Data (equipment by room), table2Data (cables), cameraData, intercomData, alarmData, serviceData
- prices (per-item pricing as JSONB)
- checklistData (checklist completion as JSONB)
- Timestamps: createdAt, updatedAt

### API Routes
- Jobs CRUD: GET/POST /api/jobs, GET/PUT/DELETE /api/jobs/:id
- Catalog CRUD: GET/POST /api/catalog, PUT/DELETE /api/catalog/:id

### Build System
- Development: `tsx server/index.ts` with Vite middleware for HMR
- Production build: Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- Build script in `script/build.ts` uses allowlist approach for bundling server dependencies

### Key Design Decisions

1. **JSONB for material data**: Rather than normalizing material quantities into separate tables, all room-by-item quantities are stored as JSON objects. This simplifies the schema and makes the flexible grid data easy to save/load without complex joins.

2. **Dynamic catalog from database**: Items are managed through the admin catalog page (`/admin`) instead of being hardcoded constants. This allows admins to add/edit/remove items, change prices, and organize by category without code changes.

3. **Client-side PDF generation**: PDF is generated in the browser using jsPDF rather than server-side. This keeps the server simple and works offline-capable for field use.

4. **Checklist templates as constants**: Checklist items are defined in schema.ts as constants (CHECKLIST_ELEKTRIKE, CHECKLIST_KAMERA, etc.) and shown based on the selected work type. Completion status is stored in the job's checklistData JSONB field.

5. **Shared route contracts**: The `shared/routes.ts` file defines API routes with Zod schemas used by both client and server, ensuring type safety across the stack.

6. **Shadcn/UI components**: Pre-built accessible components that are copied into the project (not imported from npm), allowing full customization. Located in `client/src/components/ui/`.

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

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Dev tooling
- **@replit/vite-plugin-dev-banner**: Dev environment banner

### Fonts (External CDN)
- Google Fonts: Outfit, Plus Jakarta Sans (used as display and body fonts)
