I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

### Observations

The Maritime CRM project currently has 8 separate documentation files scattered across the root directory. The user wants to create a unified, AI-agent-optimized documentation structure that will guide future LLM agents through the Encore → Convex migration. The existing docs include setup instructions (`DEVELOPMENT.md`), operations guide (`RUNBOOK.md`), code audit (`COMPREHENSIVE_CODE_AUDIT.md`), implementation summary (`IMPLEMENTATION-SUMMARY.md`), API reference (`API-DOCUMENTATION.md`), version history (`CHANGELOG.md`), and MCP policy (`MCP_POLICY.md`). The codebase uses Encore.dev backend with PostgreSQL, Vite + React frontend, and includes 9 backend services (auth, bookings, conversations, crm, fleet, quotes, files, ai, settings) with 13 database tables.

### Approach

Create a master documentation index (`AI_AGENT_INDEX.md`) that serves as the single entry point for all AI agents, with clear navigation to all existing and new documentation. Add 5 new specialized documentation files optimized for AI consumption: `MIGRATION_LOG.md` for tracking real-time migration progress, `ARCHITECTURE_DECISIONS.md` for documenting why Convex/XState/BetterAuth were chosen, `COMPONENT_REGISTRY.md` for cataloging all components and their purposes, `ERROR_KNOWLEDGE_BASE.md` for common issues and solutions, and `AI_DEVELOPMENT_PLAYBOOK.md` for step-by-step implementation guides. Update all existing documentation files to include a reference section at the top pointing back to the master index. Structure all content with clear headings, consistent formatting, and AI-friendly patterns (explicit file paths, clear decision rationales, actionable guidance).

### Reasoning

Listed the repository structure to understand the file organization, then read all 7 existing documentation files to understand their current content and structure. Reviewed sample backend code (`backend/crm/leads.ts`, `backend/fleet/ships.ts`) and frontend code (`frontend/components/Dashboard.tsx`) to understand the current Encore.dev patterns that will be migrated to Convex. This gave me a complete picture of what needs to be documented for AI agents to successfully execute the migration.

## Proposed File Changes

### AI_AGENT_INDEX.md(NEW)

Create the master documentation index that serves as the single entry point for all AI agents working on this project. Structure it with the following sections:

1. **Quick Start for AI Agents** - Immediate orientation with project type (Maritime CRM), tech stack (Encore → Convex migration), and current phase (Phase 1: Documentation Setup)

2. **Navigation Map** - Organized by purpose with clear descriptions:
   - **Migration Guides**: Link to `MIGRATION_LOG.md` (real-time progress), `ARCHITECTURE_DECISIONS.md` (why Convex/XState/BetterAuth)
   - **Development Guides**: Link to `AI_DEVELOPMENT_PLAYBOOK.md` (step-by-step), `COMPONENT_REGISTRY.md` (component catalog), `ERROR_KNOWLEDGE_BASE.md` (troubleshooting)
   - **Reference Documentation**: Link to `API-DOCUMENTATION.md` (API reference), `DEVELOPMENT.md` (setup), `RUNBOOK.md` (operations)
   - **Project History**: Link to `CHANGELOG.md` (versions), `IMPLEMENTATION-SUMMARY.md` (features), `COMPREHENSIVE_CODE_AUDIT.md` (audit)
   - **Policies**: Link to `MCP_POLICY.md` (MCP reference repos), `cline_mcp_settings.json` (MCP config)

3. **Current Migration Status** - Dashboard showing:
   - Phase 1: Documentation Setup (IN PROGRESS)
   - Phase 2: MCP Configuration (PENDING)
   - Phase 3-10: Backend/Frontend Migration (PENDING)
   - Include completion percentages and blockers

4. **Critical File Paths** - Quick reference table with:
   - Backend services: `backend/auth/`, `backend/crm/`, `backend/fleet/`, `backend/quotes/`, `backend/bookings/`, `backend/conversations/`, `backend/files/`, `backend/settings/`, `backend/ai/`
   - Frontend components: `frontend/components/Dashboard.tsx`, `frontend/components/LeadsView.tsx`, etc.
   - Database migrations: `backend/db/migrations/1_initial_schema.up.sql`, `backend/db/migrations/2_extended_schema.up.sql`
   - Configuration: `backend/encore.app`, `frontend/vite.config.ts`, `cline_mcp_settings.json`

5. **Tech Stack Overview** - Current vs Target:
   - Backend: Encore.dev → Convex
   - Database: PostgreSQL → Convex document-relational
   - Frontend: Vite + React → Vite + React (no change)
   - Auth: Encore authHandler → BetterAuth
   - State Management: None → XState (for complex workflows)

6. **AI Agent Workflow** - Step-by-step process:
   1. Read this index first
   2. Check `MIGRATION_LOG.md` for current status
   3. Review `ARCHITECTURE_DECISIONS.md` for context
   4. Consult `AI_DEVELOPMENT_PLAYBOOK.md` for implementation steps
   5. Reference `COMPONENT_REGISTRY.md` for component details
   6. Check `ERROR_KNOWLEDGE_BASE.md` if issues arise
   7. Update `MIGRATION_LOG.md` with progress

7. **MCP Reference Repositories** - Quick links to configured repos:
   - Convex: https://gitmcp.io/get-convex/convex-backend
   - BetterAuth: https://gitmcp.io/better-auth/better-auth
   - XState: https://gitmcp.io/statelyai/xstate
   - Shadcn/ui: https://gitmcp.io/shadcn-ui/ui
   - Tailwind CSS: https://gitmcp.io/tailwindlabs/tailwindcss
   - Next.js: https://gitmcp.io/vercel/next.js

8. **Document Update Protocol** - Rules for maintaining docs:
   - Always update `MIGRATION_LOG.md` after completing a task
   - Document all decisions in `ARCHITECTURE_DECISIONS.md`
   - Add new errors to `ERROR_KNOWLEDGE_BASE.md`
   - Update component registry when adding/modifying components
   - Keep this index synchronized with all changes

Use clear markdown formatting with emojis for visual scanning (🎯 for goals, ✅ for completed, 🚧 for in-progress, ⚠️ for warnings, 📁 for files, 🔗 for links).

### MIGRATION_LOG.md(NEW)

Create a real-time migration progress tracking document structured as a chronological log. Include the following sections:

1. **Migration Overview** - High-level summary:
   - Start Date: [Current date]
   - Target Completion: TBD
   - Migration Type: Encore.dev → Convex (Big Bang)
   - Status: Phase 1 - Documentation Setup

2. **Phase Tracking Table** - Visual progress dashboard:
   - Phase 1: Setup AI-Optimized Documentation (IN PROGRESS)
   - Phase 2: Configure MCP Servers (PENDING)
   - Phase 3: Initialize Convex Project (PENDING)
   - Phase 4: Migrate Authentication (PENDING)
   - Phase 5: Migrate Database Schema (PENDING)
   - Phase 6: Migrate Core CRM Services (PENDING)
   - Phase 7: Migrate Supporting Services (PENDING)
   - Phase 8: Integrate XState (PENDING)
   - Phase 9: Update Frontend (PENDING)
   - Phase 10: Validation and Cleanup (PENDING)
   - Each phase should show: Status, Start Date, End Date, Completion %, Blockers

3. **Chronological Log Entries** - Timestamped entries format:
   ```
   ## [YYYY-MM-DD HH:MM] - Phase X: Task Name
   **Agent**: [Agent identifier]
   **Status**: [Started/In Progress/Completed/Blocked]
   **Changes Made**:
   - Bullet list of specific changes
   - File paths affected
   - Decisions made
   
   **Issues Encountered**:
   - Any problems or blockers
   - How they were resolved (or not)
   
   **Next Steps**:
   - What needs to happen next
   - Dependencies or prerequisites
   ```

4. **Current Phase Details** - Expanded view of active phase:
   - Phase name and number
   - Objectives list
   - Tasks completed vs total
   - Current blockers
   - Estimated completion date

5. **Key Decisions Log** - Important architectural choices:
   - Decision: [What was decided]
   - Rationale: [Why this choice]
   - Alternatives Considered: [Other options]
   - Impact: [What this affects]
   - Date: [When decided]
   - Reference: [Link to ARCHITECTURE_DECISIONS.md section]

6. **Files Modified Tracker** - Running list of all changed files:
   - File path
   - Phase modified
   - Type of change (NEW/MODIFY/DELETE/RENAME)
   - Brief description
   - Date modified

7. **Blockers and Risks** - Active issues:
   - Blocker description
   - Impact level (High/Medium/Low)
   - Affected phases
   - Proposed resolution
   - Status (Open/In Progress/Resolved)

8. **Metrics Dashboard** - Quantitative progress:
   - Total files to migrate: [count]
   - Files migrated: [count]
   - Backend services migrated: [X/9]
   - Frontend components updated: [X/total]
   - Tests passing: [X/total]
   - Estimated completion: [percentage]

9. **Agent Handoff Notes** - For continuity between AI agents:
   - Last agent: [identifier]
   - Last task completed: [description]
   - Current state: [what's working/not working]
   - Recommended next task: [suggestion]
   - Context to preserve: [important details]

Initialize the log with the first entry documenting the creation of the AI-optimized documentation structure (this phase). Use consistent timestamp format (ISO 8601), clear status indicators, and maintain reverse chronological order (newest first) for easy scanning.

### ARCHITECTURE_DECISIONS.md(NEW)

Create an Architecture Decision Records (ADR) document that explains the rationale behind choosing Convex, XState, and BetterAuth. Structure it with the following sections:

1. **Document Purpose** - Explain that this document captures all major architectural decisions made during the Encore → Convex migration, following the ADR pattern to help future developers and AI agents understand the "why" behind technical choices.

2. **ADR-001: Migration from Encore.dev to Convex**
   - **Status**: Accepted
   - **Context**: The current backend uses Encore.dev with PostgreSQL. The user wants to migrate to Convex for "local convenient AI driven development" with better real-time capabilities and simpler local setup.
   - **Decision**: Migrate entire backend from Encore.dev to Convex
   - **Rationale**:
     - Convex provides built-in real-time subscriptions without additional infrastructure
     - Simpler local development (no PostgreSQL, no Encore CLI)
     - Better TypeScript integration with end-to-end type safety
     - Easier for AI coding assistants to understand (simpler patterns than Encore's `api()` decorator)
     - Document-relational database model is more flexible for rapid iteration
     - Serverless architecture reduces operational complexity
   - **Consequences**:
     - Positive: Real-time by default, simpler setup, better DX, automatic API generation
     - Negative: Loss of SQL flexibility, need to rewrite all queries, cannot use PostgreSQL extensions
     - Neutral: Different mental model (document vs relational), learning curve for team
   - **Alternatives Considered**:
     - Keep Encore.dev: Rejected due to complex local setup and difficulty for AI assistants
     - Migrate to Next.js API routes + Prisma: Rejected due to lack of real-time features
     - Migrate to Supabase: Rejected due to user preference for Convex

3. **ADR-002: State Management with XState**
   - **Status**: Accepted
   - **Context**: The application has complex workflows (booking conflicts, quote generation, AI assistant conversations) that need explicit state management. Currently no state machine library is used.
   - **Decision**: Integrate XState for complex workflow state machines
   - **Rationale**:
     - Explicit state machines make complex workflows easier to understand and debug
     - Visual state charts can be generated for documentation
     - Prevents impossible states and invalid transitions
     - Better for AI agents to reason about workflow logic
     - Integrates well with Convex mutations for state persistence
   - **Consequences**:
     - Positive: Clearer workflow logic, easier debugging, better documentation, prevents bugs
     - Negative: Learning curve, additional dependency, more boilerplate for simple flows
     - Neutral: Need to identify which workflows benefit from state machines
   - **Workflows Using XState**:
     - Booking Flow: availability check → conflict resolution → confirmation
     - Quote Generation: configure → calculate → save → convert to booking
     - AI Assistant: conversation state → rate limiting → response generation
   - **Alternatives Considered**:
     - No state management: Rejected due to complexity of workflows
     - Redux: Rejected as overkill for this use case
     - Zustand: Rejected as it doesn't provide state machine guarantees

4. **ADR-003: Authentication with BetterAuth**
   - **Status**: Accepted
   - **Context**: Current auth uses Encore's `authHandler` with custom token validation. Need to replace with Convex-compatible auth solution.
   - **Decision**: Use BetterAuth for authentication
   - **Rationale**:
     - Modern, TypeScript-first auth library
     - Integrates well with Convex
     - Supports multiple providers (email, OAuth, etc.)
     - Better developer experience than NextAuth.js
     - Simpler configuration than Auth0 or Clerk
     - User explicitly requested BetterAuth in MCP configuration
   - **Consequences**:
     - Positive: Modern auth patterns, good TypeScript support, flexible providers
     - Negative: Newer library (less mature than NextAuth), smaller community
     - Neutral: Need to migrate existing user records and sessions
   - **Alternatives Considered**:
     - NextAuth.js: Rejected due to complexity and user preference
     - Clerk: Rejected due to cost and external dependency
     - Auth0: Rejected due to complexity and cost
     - Custom JWT: Rejected due to security concerns and maintenance burden

5. **ADR-004: Frontend Framework Decision**
   - **Status**: Accepted
   - **Context**: Current frontend uses Vite + React. User asked if frontend migration is necessary.
   - **Decision**: Keep Vite + React, do NOT migrate to Next.js
   - **Rationale**:
     - User confirmed: "If it works completely fine with no hiccups If I paired with convex, it is not an issue"
     - Convex works perfectly with Vite + React via `convex/react` package
     - Minimizes migration scope (focus on backend)
     - Avoids unnecessary complexity
     - Current frontend architecture is solid (React 19, TanStack Query, Tailwind)
   - **Consequences**:
     - Positive: Smaller migration scope, less risk, faster completion
     - Negative: No SSR/SSG benefits, no Next.js optimizations
     - Neutral: Can migrate to Next.js later if needed
   - **Alternatives Considered**:
     - Migrate to Next.js: Rejected as unnecessary for current requirements

6. **ADR-005: Database Schema Migration Strategy**
   - **Status**: Accepted
   - **Context**: Current PostgreSQL schema has 13 tables with complex relationships. User has no production data ("just barely functioning features").
   - **Decision**: Fresh start with Convex schema, no data migration
   - **Rationale**:
     - No production data to preserve
     - Opportunity to optimize schema for Convex's document model
     - Simpler than trying to migrate PostgreSQL data
     - Can redesign relationships for better performance
   - **Consequences**:
     - Positive: Clean slate, optimized schema, no migration complexity
     - Negative: Lose any test data (acceptable per user)
     - Neutral: Need to carefully design new schema

7. **ADR-006: Migration Approach (Big Bang vs Incremental)**
   - **Status**: Accepted
   - **Context**: User chose "Option A: Big bang migrate everything at once" but noted "I am certain it will not certainly take 2 weeks"
   - **Decision**: Big bang migration with realistic timeline (4-6 weeks)
   - **Rationale**:
     - User preference for complete migration
     - No production system to maintain during migration
     - Simpler than running two backends in parallel
     - AI agent can handle entire migration autonomously
   - **Consequences**:
     - Positive: Clean cutover, no dual maintenance, simpler deployment
     - Negative: Higher risk, longer downtime, all-or-nothing
     - Neutral: Need comprehensive testing before launch

8. **Technology Stack Summary** - Quick reference table:
   - Backend Framework: Encore.dev → Convex
   - Database: PostgreSQL → Convex (document-relational)
   - Auth: Encore authHandler → BetterAuth
   - State Management: None → XState (selective)
   - Frontend: Vite + React (no change)
   - Styling: Tailwind CSS + Shadcn/ui (no change)
   - Data Fetching: TanStack Query → Convex hooks (useQuery, useMutation)

9. **Future Considerations** - Decisions deferred:
   - Next.js migration: Revisit if SSR/SEO becomes important
   - XState usage: Start with 3 workflows, expand if beneficial
   - Testing strategy: TBD during implementation
   - Deployment platform: Convex Cloud (default)

Use clear ADR format with Status, Context, Decision, Rationale, Consequences, and Alternatives for each decision. Reference specific user requirements from the consultation (Q1-Q14 answers).

### COMPONENT_REGISTRY.md(NEW)

References: 

- backend/crm/leads.ts
- backend/fleet/ships.ts
- frontend/components/Dashboard.tsx

Create a comprehensive catalog of all components in the system, organized by type and purpose. Structure it with the following sections:

1. **Registry Purpose** - Explain that this document serves as a complete inventory of all backend services, frontend components, database tables, and utilities, helping AI agents quickly understand what exists and where to find it.

2. **Backend Services (Encore → Convex Migration Map)**
   - For each service, document:
     - **Service Name**: auth, crm, fleet, quotes, bookings, conversations, files, settings, ai
     - **Current Location**: `backend/[service]/`
     - **Target Location**: `convex/[service].ts` or `convex/[feature]/`
     - **Purpose**: What this service does
     - **Key Endpoints**: List of API endpoints with methods
     - **Dependencies**: What other services it depends on
     - **Database Tables Used**: Which tables it queries
     - **Migration Complexity**: Low/Medium/High
     - **Migration Notes**: Special considerations

   Example structure for each service:
   ```
   ### auth (Authentication & Authorization)
   - **Current**: `backend/auth/auth.ts`, `backend/auth/me.ts`
   - **Target**: `convex/auth.ts`
   - **Purpose**: User authentication, role-based access control (Admin/Staff)
   - **Endpoints**:
     - GET /me - Get current user info
   - **Key Functions**: `authHandler`, `getAuthData`
   - **Dependencies**: None (foundational service)
   - **Tables**: users
   - **Migration Complexity**: High (auth pattern change)
   - **Notes**: Replace Encore authHandler with BetterAuth, migrate to Convex auth middleware
   ```

   Repeat for all 9 services: auth, crm (leads), fleet (ships, services), quotes (pricing_rules, calculator), bookings, conversations, files, settings, ai.

3. **Frontend Components**
   - Organize by category:
     - **Layout Components**: Dashboard, Sidebar, Header
     - **View Components**: LeadsView, FleetView, QuotesView, BookingsView, ConversationsView, SettingsAdminView, AnalyticsView, CalendarView
     - **Feature Components**: MetricsGrid, PipelineVisualization, CommunicationHub, QuickActions, AIAssistantWidget
     - **UI Components**: button, card, input, label, select, switch (from `frontend/components/ui/`)

   For each component, document:
   - **File Path**: `frontend/components/[Component].tsx`
   - **Purpose**: What it displays/does
   - **Props**: Key props it accepts
   - **State**: Local state or global state used
   - **API Calls**: Which backend endpoints it calls
   - **Dependencies**: Other components it uses
   - **Migration Impact**: How Convex migration affects it (e.g., replace Encore client with Convex hooks)

4. **Database Tables (PostgreSQL → Convex Schema)**
   - For each table, document:
     - **Table Name**: leads, users, ships, services, pricing_rules, quotes, bookings, threads, thread_messages, files, settings, audit_logs, ai_providers, ai_usage
     - **Current Schema**: Reference to `backend/db/migrations/1_initial_schema.up.sql` or `2_extended_schema.up.sql`
     - **Target Schema**: `convex/schema.ts` definition
     - **Purpose**: What data it stores
     - **Key Fields**: Important columns/fields
     - **Relationships**: Foreign keys or references
     - **Indexes**: Current indexes (to replicate in Convex)
     - **Migration Notes**: How to convert from relational to document model

5. **Utility Functions and Helpers**
   - **Backend Utilities**:
     - `backend/db/index.ts` - Database connection (to be removed)
     - `backend/quotes/calculator.ts` - Quote calculation logic (migrate to `convex/calculator.ts`)
   - **Frontend Utilities**:
     - `frontend/lib/utils.ts` - Utility functions (no change)
     - `frontend/client.ts` - Encore API client (replace with Convex client)

6. **Configuration Files**
   - **Backend Config**:
     - `backend/encore.app` - Encore app config (to be removed)
     - `backend/package.json` - Backend dependencies (to be removed)
     - `backend/tsconfig.json` - Backend TypeScript config (to be removed)
   - **Frontend Config**:
     - `frontend/vite.config.ts` - Vite config (update for Convex)
     - `frontend/package.json` - Frontend dependencies (add Convex packages)
     - `frontend/tsconfig.json` - Frontend TypeScript config (no change)
   - **Root Config**:
     - `package.json` - Root package.json (update for Convex)
     - `cline_mcp_settings.json` - MCP server config (update with Convex/BetterAuth/XState)

7. **XState Machines (New Components)**
   - **Booking Machine**: `convex/machines/bookingMachine.ts`
     - States: idle → checking_availability → conflict_detected → resolving → confirmed
     - Purpose: Manage booking workflow with conflict resolution
   - **Quote Machine**: `convex/machines/quoteMachine.ts`
     - States: configuring → calculating → saving → converting → completed
     - Purpose: Manage quote generation and conversion to booking
   - **AI Assistant Machine**: `convex/machines/aiMachine.ts`
     - States: idle → rate_checking → querying → responding → completed
     - Purpose: Manage AI conversation state and rate limiting

8. **Component Dependency Graph** - Visual representation:
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
   │   └── AIAssistantWidget → calls ai service
   
   Backend Services (Convex)
   ├── auth (foundational)
   ├── crm (depends on: auth)
   ├── fleet (depends on: auth, files)
   ├── quotes (depends on: auth, fleet)
   ├── bookings (depends on: auth, fleet, quotes)
   ├── conversations (depends on: auth, crm)
   ├── files (depends on: auth)
   ├── settings (depends on: auth)
   └── ai (depends on: auth, settings)
   ```

9. **Migration Priority Order** - Based on dependencies:
   1. **Phase 1**: auth (foundational)
   2. **Phase 2**: files, settings (independent)
   3. **Phase 3**: crm, fleet (depend on auth)
   4. **Phase 4**: quotes (depends on fleet)
   5. **Phase 5**: bookings (depends on fleet, quotes)
   6. **Phase 6**: conversations (depends on crm)
   7. **Phase 7**: ai (depends on settings)
   8. **Phase 8**: XState machines (depends on bookings, quotes, ai)

10. **Component Status Tracker** - Table format:
    | Component | Type | Status | Migration Phase | Notes |
    |-----------|------|--------|-----------------|-------|
    | auth | Backend | Pending | Phase 4 | Critical path |
    | crm/leads | Backend | Pending | Phase 6 | ... |
    | ... | ... | ... | ... | ... |

Use clear markdown tables, code blocks for file paths, and consistent formatting. Update this registry as components are migrated.

### ERROR_KNOWLEDGE_BASE.md(NEW)

Create a knowledge base for common errors, issues, and their solutions to prevent future AI agents from encountering the same problems. Structure it with the following sections:

1. **Knowledge Base Purpose** - Explain that this document captures all errors, issues, and solutions encountered during the migration, serving as a troubleshooting guide for future AI agents and developers.

2. **Error Categories** - Organize by type:
   - **Migration Errors**: Issues during Encore → Convex migration
   - **Convex Errors**: Convex-specific issues
   - **BetterAuth Errors**: Authentication issues
   - **XState Errors**: State machine issues
   - **Frontend Errors**: React/Vite issues
   - **Build Errors**: Compilation and bundling issues
   - **Runtime Errors**: Production issues

3. **Error Entry Template** - Consistent format for each error:
   ```
   ### ERROR-XXX: [Short Error Title]
   
   **Category**: [Migration/Convex/BetterAuth/XState/Frontend/Build/Runtime]
   **Severity**: [Critical/High/Medium/Low]
   **First Encountered**: [Date]
   **Frequency**: [How often this occurs]
   
   **Error Message**:
   ```
   [Exact error message or stack trace]
   ```
   
   **Context**:
   - What were you trying to do?
   - Which file(s) were involved?
   - What phase of migration?
   
   **Root Cause**:
   - Why did this error occur?
   - What was the underlying issue?
   
   **Solution**:
   - Step-by-step fix
   - Code changes required
   - Configuration changes
   
   **Prevention**:
   - How to avoid this in the future
   - What to check before making similar changes
   
   **Related Errors**: [Links to similar errors]
   **References**: [Links to docs, GitHub issues, etc.]
   ```

4. **Pre-populated Common Errors** - Based on the code audit and anticipated migration issues:

   **ERROR-001: Encore API Decorator Not Found**
   - Category: Migration
   - Severity: High
   - Error: `Cannot find name 'api' from 'encore.dev/api'`
   - Context: Trying to use Encore patterns in Convex
   - Root Cause: Encore's `api()` decorator doesn't exist in Convex
   - Solution: Replace with Convex `query()` or `mutation()` from `convex/server`
   - Prevention: Always import from `convex/server`, not `encore.dev/api`

   **ERROR-002: PostgreSQL Query Syntax in Convex**
   - Category: Migration
   - Severity: High
   - Error: `db.queryAll is not a function`
   - Context: Trying to use Encore's database client in Convex
   - Root Cause: Convex uses `ctx.db.query()` instead of SQL queries
   - Solution: Replace SQL queries with Convex query API (e.g., `ctx.db.query('leads').collect()`)
   - Prevention: Review Convex query patterns before migrating database code

   **ERROR-003: Auth Middleware Not Applied**
   - Category: BetterAuth
   - Severity: Critical
   - Error: `Unauthorized access - no auth data found`
   - Context: Protected Convex function not checking auth
   - Root Cause: Forgot to add auth check in Convex function
   - Solution: Add `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error('Unauthorized');`
   - Prevention: Always check auth in protected functions, use helper function

   **ERROR-004: XState Machine Not Persisting State**
   - Category: XState
   - Severity: Medium
   - Error: State machine resets on page refresh
   - Context: XState machine state not saved to Convex
   - Root Cause: State only exists in memory, not persisted
   - Solution: Save machine state to Convex table, restore on initialization
   - Prevention: Always persist state machines that need to survive page refreshes

   **ERROR-005: Convex Function Timeout**
   - Category: Convex
   - Severity: High
   - Error: `Function execution timed out after 60s`
   - Context: Long-running operation in Convex function
   - Root Cause: Convex functions have 60s timeout limit
   - Solution: Break into smaller operations or use Convex actions for long-running tasks
   - Prevention: Use actions for external API calls, mutations for database operations

   **ERROR-006: Type Mismatch in Convex Schema**
   - Category: Convex
   - Severity: Medium
   - Error: `Type 'string' is not assignable to type 'number'`
   - Context: Inserting data that doesn't match schema
   - Root Cause: Schema definition doesn't match data structure
   - Solution: Update schema in `convex/schema.ts` or fix data structure
   - Prevention: Define schema first, validate data before insertion

   **ERROR-007: Missing Environment Variables**
   - Category: Build
   - Severity: High
   - Error: `CONVEX_URL is not defined`
   - Context: Running frontend without Convex configuration
   - Root Cause: Environment variables not set
   - Solution: Run `npx convex dev` to generate `.env.local` with CONVEX_URL
   - Prevention: Always run `convex dev` before starting frontend

   **ERROR-008: Circular Dependency in Convex Functions**
   - Category: Convex
   - Severity: Medium
   - Error: `Circular dependency detected`
   - Context: Convex function A imports function B which imports A
   - Root Cause: Poor module organization
   - Solution: Extract shared logic to separate utility file
   - Prevention: Keep functions independent, use shared utilities

5. **Migration-Specific Issues** - Common patterns during Encore → Convex:
   - **Issue**: Dynamic SQL query construction
     - **Problem**: Encore allows dynamic SQL, Convex doesn't
     - **Solution**: Use Convex's filter/map methods instead
   - **Issue**: Encore secrets vs Convex environment variables
     - **Problem**: Different secret management systems
     - **Solution**: Migrate secrets to Convex dashboard environment variables
   - **Issue**: Encore's `getAuthData()` vs Convex's `ctx.auth`
     - **Problem**: Different auth patterns
     - **Solution**: Replace `getAuthData<AuthData>()` with `await ctx.auth.getUserIdentity()`

6. **Debugging Checklist** - Steps to diagnose unknown errors:
   1. Check Convex dashboard logs for detailed error messages
   2. Verify schema matches data structure
   3. Confirm auth is properly configured
   4. Check environment variables are set
   5. Review recent code changes
   6. Search this knowledge base for similar errors
   7. Check Convex documentation
   8. Check MCP reference repositories

7. **Quick Reference: Error Codes**
   - **401 Unauthorized**: Auth not configured or token invalid
   - **403 Forbidden**: User lacks required role/permissions
   - **404 Not Found**: Document doesn't exist in Convex table
   - **409 Conflict**: Booking overlap or constraint violation
   - **500 Internal Error**: Unhandled exception in Convex function
   - **Timeout**: Function exceeded 60s limit

8. **Resources and Links**
   - Convex Docs: https://docs.convex.dev
   - BetterAuth Docs: https://www.better-auth.com/docs
   - XState Docs: https://xstate.js.org/docs
   - Convex Discord: https://convex.dev/community
   - MCP Reference Repos: See `AI_AGENT_INDEX.md`

9. **Contributing to This Knowledge Base** - Guidelines:
   - Add new errors as you encounter them
   - Use the ERROR-XXX numbering system (increment from last)
   - Include full error messages and stack traces
   - Document the solution that actually worked
   - Add prevention tips to help future agents
   - Link related errors together
   - Update frequency count if error recurs

Initialize with the 8 pre-populated errors above. AI agents should add new entries as they encounter issues during migration.

### AI_DEVELOPMENT_PLAYBOOK.md(NEW)

Create a comprehensive step-by-step guide for AI agents to execute the Encore → Convex migration. Structure it with the following sections:

1. **Playbook Purpose** - Explain that this document provides detailed, actionable instructions for each phase of the migration, designed specifically for AI agents to follow autonomously.

2. **Pre-Migration Checklist** - Before starting any work:
   - [ ] Read `AI_AGENT_INDEX.md` for orientation
   - [ ] Review `ARCHITECTURE_DECISIONS.md` to understand "why"
   - [ ] Check `MIGRATION_LOG.md` for current status
   - [ ] Verify MCP servers are configured (see `cline_mcp_settings.json`)
   - [ ] Confirm access to reference repositories (Convex, BetterAuth, XState)
   - [ ] Understand current tech stack (see `COMPONENT_REGISTRY.md`)

3. **Phase 1: Setup AI-Optimized Documentation** (CURRENT PHASE)
   - **Objective**: Create master documentation structure for AI agent consumption
   - **Tasks**:
     1. Create `AI_AGENT_INDEX.md` with navigation map
     2. Create `MIGRATION_LOG.md` for progress tracking
     3. Create `ARCHITECTURE_DECISIONS.md` with ADRs
     4. Create `COMPONENT_REGISTRY.md` with component catalog
     5. Create `ERROR_KNOWLEDGE_BASE.md` for troubleshooting
     6. Create this file (`AI_DEVELOPMENT_PLAYBOOK.md`)
     7. Update all existing docs to reference the index
   - **Success Criteria**: All 6 new docs created, existing docs updated with index references
   - **Next Phase**: Phase 2 - Configure MCP Servers

4. **Phase 2: Configure MCP Servers**
   - **Objective**: Update MCP configuration with Convex, BetterAuth, XState references
   - **Step-by-Step Instructions**:
     1. Open `cline_mcp_settings.json`
     2. Add Convex backend MCP server:
        ```json
        "convex-backend Docs": {
          "url": "https://gitmcp.io/get-convex/convex-backend",
          "disabled": false,
          "autoApprove": []
        }
        ```
     3. Add BetterAuth MCP server (similar format)
     4. Add XState MCP server (similar format)
     5. Add Shadcn/ui MCP server (similar format)
     6. Remove unused repos: Prisma, Encore, axios
     7. Verify Next.js and Tailwind CSS are already configured
     8. Update `MCP_POLICY.md` with new reference patterns
     9. Test MCP server connections
     10. Document changes in `MIGRATION_LOG.md`
   - **Success Criteria**: MCP config updated, all servers accessible, policy updated
   - **Common Issues**: See `ERROR_KNOWLEDGE_BASE.md` for MCP connection issues
   - **Next Phase**: Phase 3 - Initialize Convex Project

5. **Phase 3: Initialize Convex Project**
   - **Objective**: Set up Convex backend infrastructure
   - **Step-by-Step Instructions**:
     1. Install Convex CLI: `npm install -g convex`
     2. Run `npx convex dev` in project root (this creates `convex/` directory)
     3. Create `convex/schema.ts` with initial table definitions (start with users table)
     4. Create `convex/tsconfig.json` for Convex functions
     5. Update root `package.json` to include Convex dependencies
     6. Configure `convex.json` with project settings
     7. Verify Convex dashboard is accessible
     8. Document setup steps in `MIGRATION_LOG.md`
   - **Files to Create**:
     - `convex/schema.ts` - Database schema
     - `convex/tsconfig.json` - TypeScript config for Convex
     - `convex.json` - Convex project config
   - **Reference**: Study Convex MCP repo for schema patterns
   - **Success Criteria**: Convex dev server running, schema defined, dashboard accessible
   - **Next Phase**: Phase 4 - Migrate Authentication

6. **Phase 4: Migrate Authentication to Convex + BetterAuth**
   - **Objective**: Replace Encore auth with BetterAuth + Convex auth
   - **Step-by-Step Instructions**:
     1. Study BetterAuth MCP repo for auth patterns
     2. Install BetterAuth: `npm install better-auth`
     3. Create `convex/auth.ts` with BetterAuth configuration
     4. Define `users` table in `convex/schema.ts` with fields: id, email, role, orgId, status
     5. Create auth middleware helper function for protected Convex functions
     6. Implement user authentication queries: `getMe`, `getUserById`
     7. Implement role-based access control (Admin/Staff checks)
     8. Test auth flow: login, get user, check role
     9. Document auth patterns in `ARCHITECTURE_DECISIONS.md`
     10. Update `MIGRATION_LOG.md` with progress
   - **Migration Map**:
     - `backend/auth/auth.ts` → `convex/auth.ts`
     - `backend/auth/me.ts` → `convex/users.ts` (getMe query)
     - Encore `authHandler` → BetterAuth + Convex auth middleware
   - **Key Patterns**:
     - Encore: `const auth = getAuthData<AuthData>()!;`
     - Convex: `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error('Unauthorized');`
   - **Success Criteria**: Auth working, users can login, role checks enforced
   - **Next Phase**: Phase 5 - Migrate Database Schema

7. **Phase 5: Migrate Database Schema to Convex**
   - **Objective**: Convert PostgreSQL schema to Convex document schema
   - **Step-by-Step Instructions**:
     1. Review `backend/db/migrations/1_initial_schema.up.sql` and `2_extended_schema.up.sql`
     2. For each PostgreSQL table, create Convex table definition in `convex/schema.ts`
     3. Convert SQL types to Convex validators (e.g., `TEXT` → `v.string()`, `INTEGER` → `v.number()`)
     4. Add indexes for performance (orgId, status, timestamps)
     5. Document schema decisions in `ARCHITECTURE_DECISIONS.md`
     6. Tables to migrate: leads, ships, services, pricing_rules, quotes, bookings, threads, thread_messages, files, settings, audit_logs, ai_providers, ai_usage
   - **Conversion Patterns**:
     - SQL `CHECK` constraints → Convex `v.union()` for enums
     - SQL `FOREIGN KEY` → Convex document references (store ID as string)
     - SQL `JSONB` → Convex `v.object()` or `v.any()`
     - SQL `TIMESTAMP` → Convex `v.number()` (Unix timestamp)
   - **Example Conversion**:
     ```sql
     -- PostgreSQL
     CREATE TABLE leads (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       status TEXT CHECK (status IN ('new', 'contacted', 'qualified'))
     );
     ```
     ```typescript
     // Convex
     leads: defineTable({
       name: v.string(),
       status: v.union(v.literal('new'), v.literal('contacted'), v.literal('qualified'))
     }).index('by_status', ['status'])
     ```
   - **Success Criteria**: All 13 tables defined in `convex/schema.ts`, indexes added
   - **Next Phase**: Phase 6 - Migrate Core CRM Services

8. **Phase 6: Migrate Core CRM Services to Convex**
   - **Objective**: Migrate leads, fleet, quotes, bookings services
   - **Services to Migrate**:
     - **Leads** (`backend/crm/leads.ts` → `convex/leads.ts`)
       - Functions: getLeads, createLead, updateLead, getDashboardMetrics
       - Pattern: Replace `db.queryAll` with `ctx.db.query('leads').collect()`
     - **Fleet** (`backend/fleet/ships.ts` → `convex/ships.ts`, `backend/fleet/services.ts` → `convex/services.ts`)
       - Functions: listShips, createShip, updateShip, updateShipStatus, listServices, createService, updateService
       - Pattern: Replace Encore `api()` with Convex `query()` and `mutation()`
     - **Quotes** (`backend/quotes/` → `convex/quotes.ts`, `convex/pricingRules.ts`, `convex/calculator.ts`)
       - Functions: calculateQuote, saveQuote, listQuotes, getPricingRules, createPricingRule
       - Pattern: Migrate calculator logic to pure functions, use Convex mutations for persistence
     - **Bookings** (`backend/bookings/bookings.ts` → `convex/bookings.ts`)
       - Functions: listBookings, quickBook (with availability checks)
       - Pattern: Implement conflict detection using Convex queries
   - **Step-by-Step for Each Service**:
     1. Create new file in `convex/` directory
     2. Import Convex server functions: `import { query, mutation } from './_generated/server';`
     3. Convert Encore `api()` to Convex `query()` or `mutation()`
     4. Replace SQL queries with Convex query API
     5. Add auth checks using auth middleware
     6. Test each function in Convex dashboard
     7. Update `COMPONENT_REGISTRY.md` with migration status
     8. Document in `MIGRATION_LOG.md`
   - **Success Criteria**: All 4 core services migrated, tested, working
   - **Next Phase**: Phase 7 - Migrate Supporting Services

9. **Phase 7: Migrate Supporting Services to Convex**
   - **Objective**: Migrate conversations, files, settings, ai services
   - **Services to Migrate**:
     - **Conversations** (`backend/conversations/conversations.ts` → `convex/conversations.ts`)
     - **Files** (`backend/files/files.ts` → `convex/files.ts`)
     - **Settings** (`backend/settings/settings.ts` → `convex/settings.ts`)
     - **AI Assistant** (`backend/ai/assistant.ts` → `convex/ai.ts`)
   - **Special Considerations**:
     - Files: Use Convex file storage API instead of object storage
     - Conversations: Webhook handling needs Convex HTTP actions
     - AI: Replace Encore secrets with Convex environment variables
   - **Step-by-Step**: Same as Phase 6
   - **Success Criteria**: All supporting services migrated, tested, working
   - **Next Phase**: Phase 8 - Integrate XState

10. **Phase 8: Integrate XState for Complex Workflows**
    - **Objective**: Add state machines for booking, quote, and AI workflows
    - **Step-by-Step Instructions**:
      1. Install XState: `npm install xstate`
      2. Study XState MCP repo for state machine patterns
      3. Create `convex/machines/` directory
      4. Create `bookingMachine.ts` for booking workflow
      5. Create `quoteMachine.ts` for quote generation workflow
      6. Create `aiMachine.ts` for AI assistant workflow
      7. Integrate machines with Convex mutations for state persistence
      8. Add state field to relevant Convex tables (bookings, quotes, ai_usage)
      9. Test state transitions
      10. Document state machine decisions in `ARCHITECTURE_DECISIONS.md`
    - **Booking Machine States**: idle → checking_availability → conflict_detected → resolving → confirmed
    - **Quote Machine States**: configuring → calculating → saving → converting → completed
    - **AI Machine States**: idle → rate_checking → querying → responding → completed
    - **Success Criteria**: 3 state machines implemented, integrated with Convex, tested
    - **Next Phase**: Phase 9 - Update Frontend

11. **Phase 9: Update Frontend to Use Convex Client**
    - **Objective**: Replace Encore client with Convex hooks in frontend
    - **Step-by-Step Instructions**:
      1. Install Convex React package: `npm install convex` (in frontend directory)
      2. Create `ConvexProvider` in `frontend/App.tsx`
      3. Replace `frontend/client.ts` (Encore client) with Convex client
      4. Update all components to use Convex hooks:
         - Replace Encore API calls with `useQuery()` and `useMutation()` from `convex/react`
      5. Components to update:
         - `Dashboard.tsx` - Add ConvexProvider wrapper
         - `LeadsView.tsx` - Replace leads API calls
         - `FleetView.tsx` - Replace fleet API calls
         - `QuotesView.tsx` - Replace quotes API calls
         - `BookingsView.tsx` - Replace bookings API calls
         - `ConversationsView.tsx` - Replace conversations API calls
         - `SettingsAdminView.tsx` - Replace settings API calls
         - `AIAssistantWidget.tsx` - Replace AI API calls
      6. Update environment variables (add CONVEX_URL)
      7. Test all views
      8. Document in `MIGRATION_LOG.md`
    - **Pattern Example**:
      ```typescript
      // Before (Encore)
      import Client from './client';
      const leads = await Client.crm.getLeads();
      
      // After (Convex)
      import { useQuery } from 'convex/react';
      import { api } from '../convex/_generated/api';
      const leads = useQuery(api.leads.getLeads);
      ```
    - **Success Criteria**: All components updated, frontend working with Convex backend
    - **Next Phase**: Phase 10 - Validation and Cleanup

12. **Phase 10: Migration Validation and Cleanup**
    - **Objective**: Test everything, remove old code, update documentation
    - **Step-by-Step Instructions**:
      1. Test all features end-to-end:
         - Leads CRUD
         - Fleet management
         - Quote generation
         - Booking with conflict detection
         - Conversations
         - File uploads
         - Settings
         - AI assistant
      2. Verify auth and role-based access control
      3. Test XState workflows (booking conflicts, quote generation)
      4. Remove `backend/` directory (Encore code)
      5. Update `DEVELOPMENT.md` with new Convex setup instructions
      6. Update `API-DOCUMENTATION.md` with Convex endpoints
      7. Finalize `MIGRATION_LOG.md` with completion notes
      8. Update `CHANGELOG.md` with v3.0.0 migration notes
      9. Create final migration report
    - **Success Criteria**: All tests passing, old code removed, docs updated
    - **Migration Complete!**

13. **Best Practices for AI Agents**
    - Always read `AI_AGENT_INDEX.md` first
    - Update `MIGRATION_LOG.md` after each task
    - Document decisions in `ARCHITECTURE_DECISIONS.md`
    - Add errors to `ERROR_KNOWLEDGE_BASE.md`
    - Reference MCP repos before implementing new patterns
    - Test each phase before moving to next
    - Keep `COMPONENT_REGISTRY.md` synchronized
    - Use consistent file naming and structure
    - Follow Convex best practices (queries for reads, mutations for writes, actions for external APIs)

14. **Troubleshooting Guide**
    - If stuck, check `ERROR_KNOWLEDGE_BASE.md` first
    - Review MCP reference repositories for patterns
    - Check Convex dashboard logs for detailed errors
    - Verify schema matches data structure
    - Confirm auth is properly configured
    - Test in isolation (one function at a time)
    - Document new errors for future agents

15. **Success Metrics**
    - [ ] All 9 backend services migrated to Convex
    - [ ] All 13 database tables defined in Convex schema
    - [ ] All frontend components using Convex hooks
    - [ ] 3 XState machines implemented
    - [ ] Auth working with BetterAuth
    - [ ] All tests passing
    - [ ] Documentation updated
    - [ ] Old Encore code removed
    - [ ] Migration log complete

This playbook should be followed sequentially. Each phase builds on the previous one. Do not skip phases or rush ahead.

### DEVELOPMENT.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- MIGRATION_LOG.md(NEW)

Add a reference section at the very top of the file (before the "Getting Started" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This file is part of the Maritime CRM documentation suite. For complete navigation and AI agent guidance, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index with navigation to all guides, migration logs, and reference materials"
4. A note about migration status: "⚠️ **Migration Notice**: This project is currently migrating from Encore.dev to Convex. See `MIGRATION_LOG.md` for current status."
5. A horizontal rule separator before the existing "Getting Started" content

Keep all existing content unchanged. This addition provides context for AI agents that this is an Encore-specific setup guide that will be replaced during migration.

### RUNBOOK.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- ERROR_KNOWLEDGE_BASE.md(NEW)

Add a reference section at the very top of the file (before the "Maritime CRM Operations Runbook" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This operations runbook is part of the Maritime CRM documentation suite. For complete navigation, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index"
4. A note: "For troubleshooting during migration, also see `ERROR_KNOWLEDGE_BASE.md`"
5. A horizontal rule separator before the existing "Maritime CRM Operations Runbook" heading

Keep all existing content unchanged. This addition helps AI agents understand that this runbook covers Encore-specific operations that will need updating during the Convex migration.

### COMPREHENSIVE_CODE_AUDIT.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- ARCHITECTURE_DECISIONS.md(NEW)

Add a reference section at the very top of the file (before the "📊 Maritime CRM Comprehensive Code Audit Report" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This code audit is part of the Maritime CRM documentation suite. For complete navigation, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index"
4. A note: "This audit was conducted on the Encore.dev codebase. For migration decisions based on these findings, see `ARCHITECTURE_DECISIONS.md`"
5. A horizontal rule separator before the existing title

Keep all existing content unchanged. This addition provides context that the audit findings informed the migration decisions.

### IMPLEMENTATION-SUMMARY.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- AI_DEVELOPMENT_PLAYBOOK.md(NEW)

Add a reference section at the very top of the file (before the "Maritime Yacht Charter CRM - Implementation Summary" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This implementation summary is part of the Maritime CRM documentation suite. For complete navigation, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index"
4. A note: "This summary documents the Encore.dev implementation (v2.0.0). For the Convex migration plan, see `AI_DEVELOPMENT_PLAYBOOK.md`"
5. A horizontal rule separator before the existing title

Keep all existing content unchanged. This addition clarifies that this summary covers the pre-migration implementation.

### API-DOCUMENTATION.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- MIGRATION_LOG.md(NEW)

Add a reference section at the very top of the file (before the "Maritime Yacht Charter CRM API Documentation" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This API documentation is part of the Maritime CRM documentation suite. For complete navigation, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index"
4. A note: "⚠️ **Migration Notice**: This documents the Encore.dev API. During migration to Convex, this file will be updated with new endpoint patterns. See `MIGRATION_LOG.md` for status."
5. A horizontal rule separator before the existing title

Keep all existing content unchanged. This addition alerts AI agents that the API patterns will change during migration.

### CHANGELOG.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- MIGRATION_LOG.md(NEW)

Add a reference section at the very top of the file (before the "Maritime Yacht Charter CRM - Changelog" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This changelog is part of the Maritime CRM documentation suite. For complete navigation, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index"
4. A note: "For real-time migration progress, see `MIGRATION_LOG.md`. Version 3.0.0 (Convex migration) will be documented here upon completion."
5. A horizontal rule separator before the existing title

Keep all existing content unchanged. This addition sets expectations that v3.0.0 will be the Convex migration release.

### MCP_POLICY.md(MODIFY)

References: 

- AI_AGENT_INDEX.md(NEW)
- MIGRATION_LOG.md(NEW)

Add a reference section at the very top of the file (after the YAML frontmatter but before the "⚠️ MANDATORY: MCP ENFORCEMENT POLICY" heading) that points to the master documentation index. The section should include:

1. A prominent header: `## 📚 Documentation Index`
2. A brief note: "This MCP policy is part of the Maritime CRM documentation suite. For complete navigation, see:"
3. A link to `AI_AGENT_INDEX.md` with description: "Master documentation index"
4. A note: "This policy will be updated in Phase 2 of the migration to include Convex, BetterAuth, and XState reference repositories. See `MIGRATION_LOG.md` for status."
5. A horizontal rule separator before the existing "⚠️ MANDATORY" heading

Keep all existing content unchanged, including the YAML frontmatter at the top. This addition alerts AI agents that the MCP policy will be updated with new reference repositories during Phase 2.