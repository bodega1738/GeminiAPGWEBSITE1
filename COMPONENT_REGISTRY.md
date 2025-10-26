# 📦 Maritime CRM - Component Registry

## Registry Purpose

This document serves as a complete inventory of all backend services, frontend components, database tables, and utilities in the Maritime CRM system. It helps AI agents quickly understand what exists, where to find it, and how components relate to each other during the Encore.dev → Convex migration.

---

## Backend Services (Encore → Convex Migration Map)

### auth (Authentication & Authorization)
- **Current**: `backend/auth/auth.ts`, `backend/auth/me.ts`, `backend/auth/encore.service.ts`
- **Target**: `convex/auth.ts`, `convex/users.ts`
- **Purpose**: User authentication, role-based access control (Admin/Staff), session management
- **Endpoints**:
  - GET /me - Get current user info and permissions
- **Key Functions**: `authHandler`, `getAuthData`, `me` endpoint
- **Dependencies**: None (foundational service)
- **Database Tables Used**: users
- **Migration Complexity**: High (auth pattern change from Encore to BetterAuth)
- **Migration Notes**: Replace Encore authHandler with BetterAuth, migrate to Convex auth middleware patterns

### crm (Customer Relationship Management)
- **Current**: `backend/crm/leads.ts`, `backend/crm/communications.ts`, `backend/crm/encore.service.ts`
- **Target**: `convex/leads.ts`, `convex/communications.ts`
- **Purpose**: Lead management, customer communications, sales pipeline tracking
- **Endpoints**:
  - GET /crm/leads - List all leads
  - POST /crm/leads - Create new lead
  - PUT /crm/leads/[id] - Update existing lead
  - GET /crm/communications - List communications
  - POST /crm/communications - Add new communication
- **Key Functions**: `getLeads`, `createLead`, `updateLead`, `getCommunications`, `addCommunication`
- **Dependencies**: auth (for user tracking)
- **Database Tables Used**: leads, communications
- **Migration Complexity**: Medium (standard CRUD operations)
- **Migration Notes**: Replace Encore API decorators with Convex query/mutation functions

### fleet (Fleet Management)
- **Current**: `backend/fleet/ships.ts`, `backend/fleet/services.ts`, `backend/fleet/encore.service.ts`
- **Target**: `convex/ships.ts`, `convex/services.ts`
- **Purpose**: Ship inventory management, maintenance services, fleet utilization tracking
- **Endpoints**:
  - GET /fleet/ships - List all ships
  - POST /fleet/ships - Add new ship
  - PUT /fleet/ships/[id] - Update ship details
  - PUT /fleet/ships/[id]/status - Update ship status
  - GET /fleet/services - List maintenance services
  - POST /fleet/services - Create maintenance record
  - PUT /fleet/services/[id] - Update service record
- **Key Functions**: `listShips`, `createShip`, `updateShip`, `updateShipStatus`, `listServices`, `createService`, `updateService`
- **Dependencies**: auth, files (for ship images/documents)
- **Database Tables Used**: ships, services
- **Migration Complexity**: Medium (standard CRUD with file handling)
- **Migration Notes**: Handle file storage migration to Convex file API

### quotes (Quote Management)
- **Current**: `backend/quotes/quotes.ts`, `backend/quotes/calculator.ts`, `backend/quotes/pricing_rules.ts`, `backend/quotes/encore.service.ts`
- **Target**: `convex/quotes.ts`, `convex/calculator.ts`, `convex/pricingRules.ts`
- **Purpose**: Quote generation, pricing calculations, pricing rules management
- **Endpoints**:
  - GET /quotes - List all quotes
  - POST /quotes/calculate - Calculate quote based on parameters
  - POST /quotes - Save calculated quote
  - PUT /quotes/[id] - Update quote
  - GET /pricing-rules - Get pricing configuration
  - POST /pricing-rules - Create pricing rule
  - PUT /pricing-rules/[id] - Update pricing rule
- **Key Functions**: `listQuotes`, `calculateQuote`, `saveQuote`, `updateQuote`, `getPricingRules`, `createPricingRule`, `updatePricingRule`
- **Dependencies**: auth, fleet (for ship availability), calculator logic
- **Database Tables Used**: quotes, pricing_rules
- **Migration Complexity**: High (complex calculation logic and pricing rules)
- **Migration Notes**: Separate calculator logic to pure functions, integrate with Convex for persistence

### bookings (Booking Management)
- **Current**: `backend/bookings/bookings.ts`, `backend/bookings/encore.service.ts`
- **Target**: `convex/bookings.ts`
- **Purpose**: Booking creation, conflict detection, schedule management
- **Endpoints**:
  - GET /bookings - List all bookings
  - POST /bookings - Create new booking
  - PUT /bookings/[id] - Update booking
  - DELETE /bookings/[id] - Cancel booking
  - POST /bookings/quick-book - Quick booking with availability check
- **Key Functions**: `listBookings`, `createBooking`, `updateBooking`, `cancelBooking`, `quickBook`
- **Dependencies**: auth, fleet (for ship availability), quotes (for conversion)
- **Database Tables Used**: bookings
- **Migration Complexity**: High (conflict detection logic is complex)
- **Migration Notes**: Implement real-time conflict detection using Convex queries

### conversations (Communication Hub)
- **Current**: `backend/conversations/conversations.ts`, `backend/conversations/encore.service.ts`
- **Target**: `convex/conversations.ts`
- **Purpose**: Threaded conversations, customer communication tracking
- **Endpoints**:
  - GET /conversations - List conversation threads
  - POST /conversations - Create new thread
  - GET /conversations/[id] - Get thread with messages
  - POST /conversations/[id]/messages - Add message to thread
- **Key Functions**: `listConversations`, `createThread`, `getThread`, `addMessage`
- **Dependencies**: auth, crm (for lead linking)
- **Database Tables Used**: threads, thread_messages
- **Migration Complexity**: Medium (threading logic, webhook handling)
- **Migration Notes**: Convert webhook handling to Convex HTTP actions

### files (File Management)
- **Current**: `backend/files/files.ts`, `backend/files/encore.service.ts`
- **Target**: `convex/files.ts`
- **Purpose**: File upload, storage, and retrieval for ships, documents, images
- **Endpoints**:
  - POST /files/upload - Upload file
  - GET /files/[id] - Retrieve file
  - DELETE /files/[id] - Delete file
- **Key Functions**: `uploadFile`, `getFile`, `deleteFile`
- **Dependencies**: auth (for permission checking)
- **Database Tables Used**: files
- **Migration Complexity**: Medium (storage provider migration)
- **Migration Notes**: Migrate from object storage to Convex file storage API

### settings (Configuration Management)
- **Current**: `backend/settings/settings.ts`, `backend/settings/encore.service.ts`
- **Target**: `convex/settings.ts`
- **Purpose**: Application settings, configuration management, user preferences
- **Endpoints**:
  - GET /settings - Get application settings
  - PUT /settings - Update settings
  - GET /settings/user/[id] - Get user preferences
  - PUT /settings/user/[id] - Update user preferences
- **Key Functions**: `getSettings`, `updateSettings`, `getUserPreferences`, `updateUserPreferences`
- **Dependencies**: auth (for user-specific settings)
- **Database Tables Used**: settings
- **Migration Complexity**: Low (simple key-value storage)
- **Migration Notes**: Straightforward migration of configuration data

### ai (AI Assistant Integration)
- **Current**: `backend/ai/assistant.ts`, `backend/ai/encore.service.ts`
- **Target**: `convex/ai.ts`
- **Purpose**: AI assistant integration, rate limiting, conversation management
- **Endpoints**:
  - POST /ai/chat - Send message to AI assistant
  - GET /ai/status - Check AI service status
  - GET /ai/usage - Get usage statistics
- **Key Functions**: `chatWithAI`, `getAIStatus`, `getUsageStats`
- **Dependencies**: auth, settings (for AI configuration), conversations (for context)
- **Database Tables Used**: ai_providers, ai_usage
- **Migration Complexity**: Medium (external API integration, rate limiting)
- **Migration Notes**: Replace Encore secrets with Convex environment variables

---

## Frontend Components

### Layout Components

#### Dashboard
- **File Path**: `frontend/components/Dashboard.tsx`
- **Purpose**: Main application orchestrator, navigation hub, overview display
- **Props**: None (root component)
- **State**: Global state management, current user, navigation state
- **API Calls**: Multiple service calls for overview data
- **Dependencies**: Sidebar, Header, multiple View components
- **Migration Impact**: Add ConvexProvider wrapper, update data fetching to Convex hooks

#### Sidebar
- **File Path**: `frontend/components/Sidebar.tsx`
- **Purpose**: Navigation menu, quick access to different sections
- **Props**: `isOpen` (boolean), `onClose` (function)
- **State**: Local state for open/close, active section tracking
- **API Calls**: None (navigation only)
- **Dependencies**: None
- **Migration Impact**: Minimal - no API calls to update

#### Header
- **File Path**: `frontend/components/Header.tsx`
- **Purpose**: Top navigation bar, user menu, notifications
- **Props**: `user` (object), `onLogout` (function)
- **State**: Local state for dropdown menus
- **API Calls**: User authentication status
- **Dependencies**: User management
- **Migration Impact**: Update user data fetching to Convex auth

### View Components

#### LeadsView
- **File Path**: `frontend/components/LeadsView.tsx`
- **Purpose**: Lead management interface, CRUD operations, pipeline visualization
- **Props**: None
- **State**: Leads list, filtered leads, form state for create/edit
- **API Calls**: crm service endpoints for leads
- **Dependencies**: MetricsGrid, PipelineVisualization
- **Migration Impact**: Replace Encore client calls with Convex useQuery/useMutation hooks

#### FleetView
- **File Path**: `frontend/components/FleetView.tsx`
- **Purpose**: Fleet management interface, ship inventory, maintenance tracking
- **Props**: None
- **State**: Ships list, selected ship, maintenance records
- **API Calls**: fleet service endpoints for ships and services
- **Dependencies**: File upload components
- **Migration Impact**: Update fleet API calls, handle file storage changes

#### QuotesView
- **File Path**: `frontend/components/QuotesView.tsx`
- **Purpose**: Quote generation interface, pricing calculator, conversion to bookings
- **Props**: None
- **State**: Quotes list, pricing rules, calculation form
- **API Calls**: quotes service endpoints, calculator API
- **Dependencies**: Calculator components, pricing rule managers
- **Migration Impact**: Update quotes API calls, integrate with Convex calculator

#### BookingsView
- **File Path**: `frontend/components/BookingsView.tsx`
- **Purpose**: Booking management interface, calendar view, conflict resolution
- **Props**: None
- **State**: Bookings list, calendar view, selected date range
- **API Calls**: bookings service endpoints, availability checks
- **Dependencies**: CalendarView, conflict detection UI
- **Migration Impact**: Update bookings API calls, integrate real-time conflict detection

#### ConversationsView
- **File Path**: `frontend/components/ConversationsView.tsx`
- **Purpose**: Communication hub interface, threaded conversations
- **Props**: None
- **State**: Conversation threads, active thread, message history
- **API Calls**: conversations service endpoints
- **Dependencies**: Message threading components
- **Migration Impact**: Update conversations API calls, handle real-time message updates

#### SettingsAdminView
- **File Path**: `frontend/components/SettingsAdminView.tsx`
- **Purpose**: Settings administration interface, configuration management
- **Props**: None
- **State**: Application settings, user preferences, form states
- **API Calls**: settings service endpoints
- **Dependencies**: Form components, configuration UI
- **Migration Impact**: Update settings API calls

#### AnalyticsView
- **File Path**: `frontend/components/AnalyticsView.tsx`
- **Purpose**: Analytics dashboard, metrics display, reporting
- **Props**: None
- **State**: Analytics data, date ranges, chart configurations
- **API Calls**: Multiple service endpoints for analytics data
- **Dependencies**: Chart components, MetricsGrid
- **Migration Impact**: Update all analytics API calls to Convex

#### CalendarView
- **File Path**: `frontend/components/CalendarView.tsx`
- **Purpose**: Calendar interface for bookings, schedule visualization
- **Props**: `bookings` (array), `onDateSelect` (function)
- **State**: Selected date, calendar view mode
- **API Calls**: Bookings service for date-based queries
- **Dependencies**: Calendar components, booking overlays
- **Migration Impact**: Update bookings API calls, integrate real-time updates

### Feature Components

#### MetricsGrid
- **File Path**: `frontend/components/MetricsGrid.tsx`
- **Purpose**: Display key metrics, KPI cards, dashboard widgets
- **Props**: `metrics` (object), `layout` (string)
- **State**: Local state for metric animations
- **API Calls**: Multiple endpoints for metric data
- **Dependencies**: Card UI components
- **Migration Impact**: Update metric data sources to Convex

#### PipelineVisualization
- **File Path**: `frontend/components/PipelineVisualization.tsx`
- **Purpose**: Sales pipeline visualization, lead status tracking
- **Props**: `pipeline` (array), `onStageChange` (function)
- **State**: Selected pipeline stage, drag state
- **API Calls**: CRM endpoints for pipeline data
- **Dependencies**: Visualization libraries, drag-and-drop components
- **Migration Impact**: Update pipeline data source to Convex

#### CommunicationHub
- **File Path**: `frontend/components/CommunicationHub.tsx`
- **Purpose**: Unified communication interface, email/SMS integration
- **Props**: `leadId` (string), `threadId` (string)
- **State**: Communication history, compose form
- **API Calls**: Communication endpoints, conversation threads
- **Dependencies**: Message composition components, conversation display
- **Migration Impact**: Update communication API calls

#### QuickActions
- **File Path**: `frontend/components/QuickActions.tsx`
- **Purpose**: Quick action buttons, common task shortcuts
- **Props**: `actions` (array), `context` (object)
- **State**: Active action confirmation
- **API Calls**: Various endpoints based on actions
- **Dependencies**: Button components, modal dialogs
- **Migration Impact**: Update action implementations to Convex

#### AIAssistantWidget
- **File Path**: `frontend/components/AIAssistantWidget.tsx`
- **Purpose**: AI assistant interface, chat widget, help system
- **Props**: `context` (object), `onClose` (function)
- **State**: Conversation history, typing indicator
- **API Calls**: AI assistant endpoints
- **Dependencies**: Chat components, message display
- **Migration Impact**: Update AI API calls, integrate with Convex AI service

### UI Components

Located in `frontend/components/ui/` directory:
- **button.tsx** - Reusable button component with variants
- **card.tsx** - Card container component
- **input.tsx** - Form input component with validation
- **label.tsx** - Form label component
- **select.tsx** - Dropdown select component
- **switch.tsx** - Toggle switch component

**Migration Impact**: No changes needed - these are presentational components

---

## Database Tables (PostgreSQL → Convex Schema)

### leads
- **Table Name**: leads
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Customer lead information, sales pipeline tracking
- **Key Fields**: id, name, email, phone, status, source, assigned_to, created_at, updated_at
- **Relationships**: Links to users (assigned_to), communications
- **Indexes**: status, assigned_to, created_at
- **Migration Notes**: Convert status enum to Convex union type

### users
- **Table Name**: users
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: User accounts, authentication, role management
- **Key Fields**: id, email, password_hash, role, org_id, status, created_at, updated_at
- **Relationships**: Foundational table, referenced by leads, bookings
- **Indexes**: email, org_id, status
- **Migration Notes**: Add BetterAuth-specific fields (email_verified, etc.)

### ships
- **Table Name**: ships
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Ship inventory, fleet management
- **Key Fields**: id, name, type, capacity, status, specifications, created_at, updated_at
- **Relationships**: Links to services (maintenance), bookings
- **Indexes**: status, type, created_at
- **Migration Notes**: Store specifications as object field for flexibility

### services
- **Table Name**: services
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Maintenance service records, fleet upkeep
- **Key Fields**: id, ship_id, type, description, cost, status, scheduled_date, completed_date
- **Relationships**: Links to ships
- **Indexes**: ship_id, status, scheduled_date
- **Migration Notes**: Convert status enum to Convex union type

### pricing_rules
- **Table Name**: pricing_rules
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Quote pricing configuration, rate management
- **Key Fields**: id, name, ship_type, base_rate, per_day_rate, additional_charges, active
- **Relationships**: Referenced by quotes
- **Indexes**: ship_type, active
- **Migration Notes**: Store additional_charges as array of objects

### quotes
- **Table Name**: quotes
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Quote records, pricing calculations, conversion tracking
- **Key Fields**: id, lead_id, ship_id, start_date, end_date, total_price, status, created_at
- **Relationships**: Links to leads, ships, bookings (if converted)
- **Indexes**: lead_id, ship_id, status, created_at
- **Migration Notes**: Add calculation breakdown as object field

### bookings
- **Table Name**: bookings
- **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Booking records, schedule management, conflict tracking
- **Key Fields**: id, ship_id, lead_id, start_date, end_date, status, total_price, conflict_resolved
- **Relationships**: Links to ships, leads
- **Indexes**: ship_id, start_date, end_date, status
- **Migration Notes**: Add conflict detection fields, state machine integration

### threads
- **Table Name**: threads
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Conversation threads, communication organization
- **Key Fields**: id, lead_id, title, status, created_at, updated_at
- **Relationships**: Links to leads, has many thread_messages
- **Indexes**: lead_id, status, updated_at
- **Migration Notes**: Add participant information, thread type

### thread_messages
- **Table Name**: thread_messages
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Individual messages in conversation threads
- **Key Fields**: id, thread_id, sender_id, content, message_type, created_at
- **Relationships**: Links to threads, users
- **Indexes**: thread_id, sender_id, created_at
- **Migration Notes**: Add message metadata (read status, attachments)

### files
- **Table Name**: files
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: File metadata, storage tracking
- **Key Fields**: id, filename, file_type, size, url, uploaded_by, related_entity_type, related_entity_id
- **Relationships**: Links to users, related entities
- **Indexes**: uploaded_by, related_entity_type, related_entity_id
- **Migration Notes**: Integrate with Convex file storage API

### settings
- **Table Name**: settings
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Application configuration, user preferences
- **Key Fields**: id, key, value, type, scope, user_id, created_at, updated_at
- **Relationships**: Links to users for user-specific settings
- **Indexes**: key, scope, user_id
- **Migration Notes**: Support different value types, validation

### audit_logs
- **Table Name**: audit_logs
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: Change tracking, audit trail
- **Key Fields**: id, user_id, action, entity_type, entity_id, old_values, new_values, created_at
- **Relationships**: Links to users
- **Indexes**: user_id, entity_type, entity_id, created_at
- **Migration Notes**: Store old_values/new_values as objects

### ai_providers
- **Table Name**: ai_providers
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition
- **Purpose**: AI service configuration, provider settings
- **Key Fields**: id, name, api_endpoint, model, settings, active, created_at
- **Relationships**: Referenced by ai_usage
- **Indexes**: name, active
- **Migration Notes**: Store settings as object field, provider-specific config

### ai_usage
- **Table Name**: ai_usage
- **Current Schema**: Reference to `backend/db/migrations/2_extended_schema.up.sql`
- **Target Schema**: `convex/schema.ts` definition**
- **Purpose**: AI usage tracking, rate limiting, cost monitoring
- **Key Fields**: id, user_id, provider_id, request_type, tokens_used, cost, created_at
- **Relationships**: Links to users, ai_providers
- **Indexes**: user_id, provider_id, created_at
- **Migration Notes**: Add rate limiting fields, state machine integration

---

## Utility Functions and Helpers

### Backend Utilities

#### Database Connection
- **File Path**: `backend/db/index.ts`
- **Purpose**: PostgreSQL connection setup and query helpers
- **Migration Notes**: Remove entirely, replace with Convex context

#### Quote Calculator
- **File Path**: `backend/quotes/calculator.ts`
- **Purpose**: Quote pricing calculations, business logic
- **Migration Notes**: Migrate to `convex/calculator.ts` as pure functions, integrate with Convex for persistence

### Frontend Utilities

#### Client Configuration
- **File Path**: `frontend/client.ts`
- **Purpose**: Encore API client configuration and request helpers
- **Migration Notes**: Replace with Convex client configuration

#### General Utilities
- **File Path**: `frontend/lib/utils.ts`
- **Purpose**: Common utility functions, helpers
- **Migration Notes**: No changes needed

---

## Configuration Files

### Backend Configuration
- **File Path**: `backend/encore.app`
- **Purpose**: Encore application configuration, service definitions
- **Migration Notes**: Remove entirely, replace with Convex configuration

- **File Path**: `backend/package.json`
- **Purpose**: Backend dependencies, scripts
- **Migration Notes**: Remove entirely, migrate needed dependencies to root package.json

- **File Path**: `backend/tsconfig.json`
- **Purpose**: Backend TypeScript configuration
- **Migration Notes**: Remove entirely, create `convex/tsconfig.json`

### Frontend Configuration
- **File Path**: `frontend/vite.config.ts`
- **Purpose**: Vite build configuration, development server
- **Migration Notes**: Update for Convex integration, environment variables

- **File Path**: `frontend/package.json`
- **Purpose**: Frontend dependencies, build scripts
- **Migration Notes**: Add Convex packages (`convex/react`), remove Encore client

- **File Path**: `frontend/tsconfig.json`
- **Purpose**: Frontend TypeScript configuration
- **Migration Notes**: No changes needed

### Root Configuration
- **File Path**: `package.json`
- **Purpose**: Root project dependencies, scripts
- **Migration Notes**: Add Convex CLI, update scripts for Convex development

- **File Path**: `cline_mcp_settings.json`
- **Purpose**: MCP server configuration for AI agents
- **Migration Notes**: Update with Convex, BetterAuth, XState repositories

---

## XState Machines (New Components)

### Booking Machine
- **File Path**: `convex/machines/bookingMachine.ts`
- **States**: idle → checking_availability → conflict_detected → resolving → confirmed
- **Purpose**: Manage booking workflow with conflict resolution
- **Integration**: Convex bookings table for state persistence
- **Triggers**: New booking request, availability check completion, conflict resolution

### Quote Machine
- **File Path**: `convex/machines/quoteMachine.ts`
- **States**: configuring → calculating → saving → converting → completed
- **Purpose**: Manage quote generation and conversion to booking
- **Integration**: Convex quotes table for state persistence
- **Triggers**: Quote configuration start, calculation completion, save operation

### AI Assistant Machine
- **File Path**: `convex/machines/aiMachine.ts`
- **States**: idle → rate_checking → querying → responding → completed
- **Purpose**: Manage AI conversation state and rate limiting
- **Integration**: Convex ai_usage table for state persistence
- **Triggers**: User message, rate limit check, AI response completion

---

## Component Dependency Graph

```
Frontend Components
├── Dashboard (orchestrator)
│   ├── Sidebar (navigation)
│   ├── Header (top bar)
│   ├── LeadsView → calls crm service
│   ├── FleetView → calls fleet service
│   ├── QuotesView → calls quotes service
│   ├── BookingsView → calls bookings service
│   ├── ConversationsView → calls conversations service
│   ├── SettingsAdminView → calls settings service
│   ├── AnalyticsView → calls all services
│   └── AIAssistantWidget → calls ai service
├── Feature Components
│   ├── MetricsGrid → uses data from multiple services
│   ├── PipelineVisualization → uses crm data
│   ├── CommunicationHub → uses conversations service
│   ├── QuickActions → triggers service calls
│   └── CalendarView → uses bookings data
└── UI Components
    ├── button, card, input, label, select, switch (presentational)

Backend Services (Convex)
├── auth (foundational)
│   └── Provides authentication for all other services
├── files (independent)
│   └── Used by fleet, crm, conversations
├── settings (independent)
│   └── Used by ai, auth, global configuration
├── crm (depends on: auth)
│   └── Lead management, communications
├── fleet (depends on: auth, files)
│   └── Ship and service management
├── quotes (depends on: auth, fleet)
│   └── Quote generation, pricing
├── bookings (depends on: auth, fleet, quotes)
│   └── Booking management, conflict detection
├── conversations (depends on: auth, crm)
│   └── Threaded communications
└── ai (depends on: auth, settings)
    └── AI assistant integration

XState Machines
├── bookingMachine → integrates with bookings service
├── quoteMachine → integrates with quotes service
└── aiMachine → integrates with ai service
```

---

## Migration Priority Order

### Phase 1: Foundation Services
1. **auth** - Foundational authentication service (Phase 4 in migration plan)
2. **files, settings** - Independent services, no dependencies (Phase 7)

### Phase 2: Core Business Services
3. **crm, fleet** - Depend on auth, core business logic (Phase 6)

### Phase 3: Dependent Services
4. **quotes** - Depends on fleet for pricing (Phase 6)
5. **bookings** - Depends on fleet, quotes for booking logic (Phase 6)
6. **conversations** - Depends on crm for lead linking (Phase 7)

### Phase 4: Advanced Features
7. **ai** - Depends on settings, complex integration (Phase 7)

### Phase 5: State Machines
8. **XState machines** - Depends on bookings, quotes, ai (Phase 8)

---

## Component Status Tracker

| Component | Type | Status | Migration Phase | Notes |
|------------|-------|--------|-----------------|-------|
| auth | Backend | Pending | Phase 4 | Critical path, BetterAuth integration |
| crm/leads | Backend | Pending | Phase 6 | Standard CRUD operations |
| fleet/ships | Backend | Pending | Phase 6 | File handling integration |
| fleet/services | Backend | Pending | Phase 6 | Maintenance tracking |
| quotes | Backend | Pending | Phase 6 | Complex calculation logic |
| quotes/calculator | Backend | Pending | Phase 6 | Pure functions + persistence |
| quotes/pricing_rules | Backend | Pending | Phase 6 | Configuration management |
| bookings | Backend | Pending | Phase 6 | Conflict detection complexity |
| conversations | Backend | Pending | Phase 7 | Threading logic |
| files | Backend | Pending | Phase 7 | Storage migration |
| settings | Backend | Pending | Phase 7 | Simple configuration |
| ai | Backend | Pending | Phase 7 | External API integration |
| Dashboard | Frontend | Pending | Phase 9 | Orchestrator component |
| LeadsView | Frontend | Pending | Phase 9 | CRM interface |
| FleetView | Frontend | Pending | Phase 9 | Fleet management UI |
| QuotesView | Frontend | Pending | Phase 9 | Quote generation UI |
| BookingsView | Frontend | Pending | Phase 9 | Booking management UI |
| ConversationsView | Frontend | Pending | Phase 9 | Communication UI |
| SettingsAdminView | Frontend | Pending | Phase 9 | Settings UI |
| AnalyticsView | Frontend | Pending | Phase 9 | Analytics dashboard |
| CalendarView | Frontend | Pending | Phase 9 | Schedule visualization |
| bookingMachine | XState | Pending | Phase 8 | Booking workflow |
| quoteMachine | XState | Pending | Phase 8 | Quote workflow |
| aiMachine | XState | Pending | Phase 8 | AI workflow |

---

**Registry Status**: Active  
**Last Updated**: 2025-10-25  
**Next Update**: After each component migration completion  
**Maintainers**: AI Agents working on migration
