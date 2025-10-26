# 🏗️ Maritime CRM - Architecture Decisions (ADR)

## Document Purpose

This document captures all major architectural decisions made during the Encore.dev → Convex migration, following the Architecture Decision Record (ADR) pattern. Each decision includes the context, rationale, consequences, and alternatives considered. This helps future developers and AI agents understand the "why" behind technical choices made during the migration.

---

## ADR-001: Migration from Encore.dev to Convex

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Migrate entire backend from Encore.dev to Convex

### Context
The current backend uses Encore.dev with PostgreSQL. The user wants to migrate to Convex for "local convenient AI driven development" with better real-time capabilities and simpler local setup. The current system has 9 backend services, 13 database tables, and uses Encore's API decorators with PostgreSQL queries.

### Decision
Complete migration from Encore.dev to Convex, replacing all backend services and database layer while keeping the frontend (Vite + React) unchanged.

### Rationale
- **Real-time by Default**: Convex provides built-in real-time subscriptions without additional infrastructure
- **Simpler Local Development**: No PostgreSQL setup required, no Encore CLI dependencies
- **Better TypeScript Integration**: End-to-end type safety from database to frontend
- **AI Assistant Friendly**: Simpler patterns than Encore's `api()` decorator, easier for AI coding assistants to understand and work with
- **Document-Relational Model**: More flexible for rapid iteration and schema changes
- **Serverless Architecture**: Reduces operational complexity and infrastructure management
- **Automatic API Generation**: Convex automatically generates APIs from function definitions

### Consequences
**Positive**:
- Real-time features available out of the box
- Simpler development setup and deployment
- Better developer experience with built-in tooling
- Automatic API documentation and type generation
- No infrastructure management required

**Negative**:
- Loss of SQL query flexibility and advanced PostgreSQL features
- Need to rewrite all database queries and business logic
- Cannot use PostgreSQL extensions or complex SQL operations
- Learning curve for document-relational data modeling

**Neutral**:
- Different mental model from relational to document-based
- New patterns for data relationships and queries
- Need to rethink data access patterns

### Alternatives Considered
- **Keep Encore.dev**: Rejected due to complex local setup requirements and difficulty for AI assistants to work with Encore patterns
- **Migrate to Next.js API routes + Prisma**: Rejected due to lack of built-in real-time features and additional infrastructure complexity
- **Migrate to Supabase**: Rejected due to user preference for Convex and specific AI development requirements

---

## ADR-002: State Management with XState

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Integrate XState for complex workflow state machines

### Context
The application has complex workflows that need explicit state management:
- Booking conflicts and resolution workflow
- Quote generation with multiple calculation steps
- AI assistant conversations with rate limiting and state tracking
Currently, no state machine library is used, leading to implicit state management in React components.

### Decision
Integrate XState for managing complex workflows while keeping simple state in React components.

### Rationale
- **Explicit State Machines**: Make complex workflows easier to understand, debug, and maintain
- **Visual Documentation**: State charts can be generated for documentation and team communication
- **Prevents Impossible States**: State machine guarantees eliminate invalid state transitions
- **AI Agent Reasoning**: Easier for AI agents to reason about workflow logic and implement changes
- **Convex Integration**: Works well with Convex mutations for state persistence
- **Testing**: State machines are inherently testable and predictable

### Consequences
**Positive**:
- Clearer workflow logic and easier debugging
- Better documentation through visual state charts
- Prevents bugs from invalid state transitions
- Improved maintainability for complex workflows

**Negative**:
- Learning curve for team members unfamiliar with state machines
- Additional dependency and boilerplate for simple state management
- Potential over-engineering for straightforward workflows

**Neutral**:
- Need to identify which workflows benefit from state machines vs simple React state

### Workflows Using XState
- **Booking Flow**: availability check → conflict detected → resolution options → confirmed/cancelled
- **Quote Generation**: configuration → calculation → validation → save → convert to booking
- **AI Assistant**: idle → rate checking → querying → generating response → completed

### Alternatives Considered
- **No State Management**: Rejected due to complexity of workflows and potential for bugs
- **Redux**: Rejected as overkill for this use case and doesn't provide state machine guarantees
- **Zustand**: Rejected as it doesn't provide state machine structure and guarantees

---

## ADR-003: Authentication with BetterAuth

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Use BetterAuth for authentication

### Context
Current authentication uses Encore's `authHandler` with custom token validation. Need to replace with a Convex-compatible auth solution that supports modern authentication patterns and multiple providers.

### Decision
Migrate from Encore authHandler to BetterAuth for all authentication needs.

### Rationale
- **Modern TypeScript-First**: Built with TypeScript as a primary concern
- **Convex Integration**: Designed to work well with Convex and modern full-stack frameworks
- **Multiple Providers**: Supports email/password, OAuth (Google, GitHub, etc.), and passwordless options
- **Better Developer Experience**: Simpler configuration and better documentation than NextAuth.js
- **User Preference**: User explicitly requested BetterAuth in MCP configuration
- **Flexible Architecture**: Can be configured for various auth flows and security requirements

### Consequences
**Positive**:
- Modern authentication patterns and best practices
- Excellent TypeScript support and type safety
- Flexible provider configuration
- Simple setup compared to enterprise solutions

**Negative**:
- Newer library with less mature ecosystem than NextAuth.js
- Smaller community and fewer third-party integrations
- Less battle-tested in production environments

**Neutral**:
- Need to migrate existing user records and session management
- Learning curve for team members familiar with other auth solutions

### Alternatives Considered
- **NextAuth.js**: Rejected due to complexity, configuration overhead, and user preference for BetterAuth
- **Clerk**: Rejected due to cost considerations and external dependency
- **Auth0**: Rejected due to complexity, cost, and over-engineering for current needs
- **Custom JWT Implementation**: Rejected due to security concerns and maintenance burden

---

## ADR-004: Frontend Framework Decision

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Keep Vite + React, do NOT migrate to Next.js

### Context
Current frontend uses Vite + React with React 19, TanStack Query, Tailwind CSS, and Shadcn/ui components. User asked if frontend migration to Next.js is necessary for the Convex migration.

### Decision
Maintain existing Vite + React frontend architecture, only update data fetching to use Convex hooks.

### Rationale
- **User Confirmation**: User stated "If it works completely fine with no hiccups If I paired with convex, it is not an issue"
- **Convex Compatibility**: Convex works perfectly with Vite + React via `convex/react` package
- **Minimize Migration Scope**: Focus resources on backend migration where the real complexity lies
- **Avoid Unnecessary Risk**: Frontend is working well, no need to introduce potential issues
- **Current Architecture**: Solid foundation with React 19, TanStack Query, Tailwind CSS
- **Faster Completion**: Reduces overall migration timeline and complexity

### Consequences
**Positive**:
- Smaller migration scope with less risk
- Faster overall completion
- No disruption to working frontend features
- Team can focus on backend complexity

**Negative**:
- No SSR/SSG benefits that Next.js could provide
- Miss out on Next.js optimizations and ecosystem
- May need migration later if SEO becomes important

**Neutral**:
- Can migrate to Next.js later if needed
- Current setup provides good developer experience

### Alternatives Considered
- **Migrate to Next.js**: Rejected as unnecessary for current requirements and user confirmed existing setup works fine with Convex

---

## ADR-005: Database Schema Migration Strategy

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Fresh start with Convex schema, no data migration

### Context
Current PostgreSQL schema has 13 tables with complex relationships. User has no production data ("just barely functioning features"), no existing customers, and minimal test data.

### Decision
Start fresh with Convex schema optimized for document-relational model, no data migration from PostgreSQL.

### Rationale
- **No Production Data**: No customer data to preserve or migrate
- **Clean Slate**: Opportunity to optimize schema for Convex's document model
- **Simpler Process**: Avoid complex data transformation and validation
- **Better Performance**: Can redesign relationships and indexes for Convex patterns
- **Reduced Risk**: No data loss concerns during migration
- **Learning Opportunity**: Team can learn Convex patterns without dealing with legacy data constraints

### Consequences
**Positive**:
- Clean, optimized schema designed for Convex
- No migration complexity or data validation issues
- Opportunity to implement best practices from scratch
- Faster migration timeline

**Negative**:
- Lose any existing test or development data (acceptable per user)
- Need to rebuild any data-dependent features from scratch

**Neutral**:
- Need to carefully design new schema with future growth in mind
- Can incorporate lessons learned from PostgreSQL schema design

### Alternatives Considered
- **Full Data Migration**: Rejected due to complexity and lack of production data to justify the effort

---

## ADR-006: Migration Approach (Big Bang vs Incremental)

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Big bang migration with realistic timeline (4-6 weeks)

### Context
User chose "Option A: Big bang migrate everything at once" but noted "I am certain it will not certainly take 2 weeks" (original estimate). Need to determine migration strategy and timeline.

### Decision
Execute complete migration (backend + frontend integration) as a single project with 4-6 week timeline.

### Rationale
- **User Preference**: User explicitly chose Big Bang approach over incremental migration
- **No Production System**: No live users or revenue impact during migration
- **Simpler Logistics**: No need to maintain two backends in parallel
- **Complete Testing**: Can test entire system end-to-end before launch
- **AI Agent Capability**: AI agent can handle entire migration autonomously
- **Clean Cutover**: Single transition point with clear before/after states

### Consequences
**Positive**:
- Clean cutover with no dual maintenance period
- Simpler deployment and infrastructure management
- Complete testing of integrated system
- No incremental compatibility issues

**Negative**:
- Higher risk if migration fails
- Longer downtime during final deployment
- All-or-nothing approach requires comprehensive testing

**Neutral**:
- Need careful planning and risk mitigation
- Requires thorough testing before launch

### Alternatives Considered
- **Incremental Migration**: Rejected due to user preference and complexity of maintaining two systems


## ADR-007: MCP Server Configuration Simplification

**Status**: Accepted  
**Date**: 2025-10-25  
**Decision**: Simplify MCP server configuration to only essential servers with clean JSON structure

### Context
The original `cline_mcp_settings.json` had 18 MCP servers configured with complex nested structures including GitHub-specific properties (defaultBranch, readOnly, allowedPaths, chunkPolicy, auth, webhooks). Additionally, `MCP_POLICY.md` contained unnecessary YAML frontmatter for exposing the repository as an MCP server.

The project is **consuming** MCP servers for AI agent reference, not **providing** an MCP server for others to consume. Many configured servers were for technologies no longer used in the migration (Prisma, Encore, NextAuth, axios, etc.).

### Decision
1. **Remove YAML frontmatter** from `MCP_POLICY.md` (lines 1-27)
2. **Simplify `cline_mcp_settings.json`** to only 6 essential servers with minimal configuration
3. **Update `MCP_POLICY.md` content** to reference only migration-relevant technologies

### Rationale

**Why Remove YAML Frontmatter:**
- YAML frontmatter is for **exposing** a repo as an MCP server
- We are **consuming** external MCP servers, not providing one
- The configuration was adding unnecessary complexity

**Why Simplify MCP Server Configuration:**
- Original format had nested `mcpServers` objects and GitHub-specific properties
- Cline only needs: `url`, `disabled`, and `autoApprove` properties
- Simpler format is easier to maintain and understand
- Reduces configuration bloat from 18 servers to 6 essential ones

**Why Keep Only 6 Servers:**
- **Convex Backend**: Migration target, core backend framework
- **BetterAuth**: Authentication solution replacing Encore authHandler
- **XState**: State management for complex workflows
- **Shadcn/ui**: UI component library (already in use)
- **Tailwind CSS**: Styling framework (currently using)
- **Next.js**: Future reference (potential frontend migration)

**Why Remove 12 Servers:**
- `microsoft/TypeScript`: Built-in, no external reference needed
- `prisma/prisma`: Not using Prisma (using Convex)
- `encoredev/encore`: Migrating away from Encore
- `nextauthjs/next-auth`: Using BetterAuth instead
- `TanStack/query`: Convex has built-in hooks
- `TanStack/table`: Not using advanced tables
- `axios/axios`: Convex has built-in HTTP client
- `clauderic/dnd-kit`: Not implementing drag-and-drop
- `recharts/recharts`: Not using charts currently
- `lovell/sharp`: Not doing image processing
- `amannn/next-intl`: Not implementing i18n
- `date-fns/date-fns`: Using native Date or Convex helpers
- `streamich/react-use`: Not using custom hooks library
- `AJ1732/framer-motion-template`: Not using animations
- `pacocoursey/next-themes`: Not implementing theme switching

### Consequences

**Positive:**
- Cleaner, more maintainable configuration
- Faster AI agent startup (fewer servers to load)
- Clear focus on migration-relevant technologies
- Easier to understand what each server is for
- Reduced cognitive load for developers and AI agents

**Negative:**
- Need to re-add servers if requirements change
- Lost reference to some potentially useful libraries
- May need to manually look up docs for removed technologies

**Neutral:**
- Can easily add servers back if needed
- Configuration is now more aligned with actual project needs

### New MCP Server Configuration

**Final `cline_mcp_settings.json` structure:**
```json
{
  "mcpServers": {
    "Convex Backend Docs": {
      "url": "https://gitmcp.io/get-convex/convex-backend",
      "disabled": false,
      "autoApprove": []
    },
    "BetterAuth Docs": {
      "url": "https://gitmcp.io/better-auth/better-auth",
      "disabled": false,
      "autoApprove": []
    },
    "XState Docs": {
      "url": "https://gitmcp.io/statelyai/xstate",
      "disabled": false,
      "autoApprove": []
    },
    "Shadcn UI Docs": {
      "url": "https://gitmcp.io/shadcn-ui/ui",
      "disabled": false,
      "autoApprove": []
    },
    "Tailwind CSS Docs": {
      "url": "https://gitmcp.io/tailwindlabs/tailwindcss",
      "disabled": false,
      "autoApprove": []
    },
    "Next.js Docs": {
      "url": "https://gitmcp.io/vercel/next.js",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Updated MCP_POLICY.md Component Mappings

**Removed Sections:**
- Prisma components
- Encore components
- NextAuth components
- Axios components
- React Hook Form components
- dnd-kit components
- Recharts components
- Sharp components
- date-fns components
- react-use components
- framer-motion components
- next-themes components

**Added/Updated Sections:**
- Convex Backend Components → Study Convex Backend Docs
- BetterAuth Components → Study BetterAuth Docs
- XState Components → Study XState Docs
- Shadcn/ui Components → Study Shadcn UI Docs
- Tailwind CSS Components → Study Tailwind CSS Docs (kept)
- Next.js Components → Study Next.js Docs (kept for future)

### Alternatives Considered

**Keep All 18 Servers:**
- Rejected: Too much bloat, many unused technologies
- Would slow down AI agent initialization
- Harder to maintain and understand

**Remove All Non-Essential Servers:**
- Rejected: Next.js and Tailwind CSS are useful references
- May need Next.js for future frontend migration
- Tailwind CSS is actively used

**Use GitHub URLs Instead of gitmcp.io:**
- Rejected: gitmcp.io provides better MCP integration
- Optimized for AI agent consumption
- Consistent format across all servers

---

## Technology Stack Summary

| Component | Current | Target | Migration Approach |
|-----------|---------|--------|------------------|
| **Backend Framework** | Encore.dev | Convex | Complete rewrite |
| **Database** | PostgreSQL | Convex document-relational | Fresh schema, no data migration |
| **Authentication** | Encore authHandler | BetterAuth | Pattern replacement |
| **State Management** | None | XState (selective) | Add to complex workflows only |
| **Frontend** | Vite + React | Vite + React | No framework change |
| **Styling** | Tailwind CSS + Shadcn/ui | Tailwind CSS + Shadcn/ui | No change |
| **Data Fetching** | TanStack Query | Convex hooks | Replace client, keep patterns |
| **MCP Servers** | 18 servers (mixed) | 6 servers (focused) | Simplified configuration |

---

## Future Considerations

### Decisions Deferred
- **Next.js Migration**: Revisit if SSR/SEO becomes important for business requirements
- **XState Usage**: Start with 3 core workflows, expand usage based on team feedback
- **Testing Strategy**: Determine during implementation based on complexity and team preferences
- **Deployment Platform**: Convex Cloud (default) with evaluation of alternatives if needed

### Monitoring Points
- **Performance**: Monitor Convex query performance compared to PostgreSQL
- **Developer Experience**: Track team productivity and satisfaction with new stack
- **Real-time Features**: Evaluate usage and benefit of Convex real-time capabilities
- **State Machine Benefits**: Assess XState impact on workflow maintainability

---

**Document Status**: Active  
**Last Updated**: 2025-10-25  
**Next Review**: After Phase 4 (Authentication Migration) completion  
**Maintainers**: AI Agents working on migration
