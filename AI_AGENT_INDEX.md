# 🤖 Maritime CRM - AI Agent Documentation Index

## 🎯 Quick Start for AI Agents

**Project**: Maritime Yacht Charter CRM  
**Current Tech Stack**: Encore.dev → Convex Migration (Big Bang)  
**Current Phase**: Phase 3: Initialize Convex Project (READY TO START)  
**Migration Type**: Complete backend migration from Encore.dev + PostgreSQL to Convex document-relational database

This is the master documentation index for all AI agents working on this project. **Always read this file first** before any other documentation.

## 📚 Navigation Map

### Migration Guides
- **[MIGRATION_LOG.md](./MIGRATION_LOG.md)** - Real-time migration progress tracking with chronological log entries
- **[ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)** - Why we chose Convex, XState, and BetterAuth (ADR format)

### Development Guides
- **[AI_DEVELOPMENT_PLAYBOOK.md](./AI_DEVELOPMENT_PLAYBOOK.md)** - Step-by-step migration instructions for each phase
- **[COMPONENT_REGISTRY.md](./COMPONENT_REGISTRY.md)** - Complete catalog of all components and their purposes
- **[ERROR_KNOWLEDGE_BASE.md](./ERROR_KNOWLEDGE_BASE.md)** - Common errors, issues, and solutions

### Reference Documentation
- **[API-DOCUMENTATION.md](./API-DOCUMENTATION.md)** - API reference (current Encore endpoints)
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development setup instructions
- **[RUNBOOK.md](./RUNBOOK.md)** - Operations and deployment procedures

### Project History
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes
- **[IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md)** - Feature documentation (v2.0.0 Encore implementation)
- **[COMPREHENSIVE_CODE_AUDIT.md](./COMPREHENSIVE_CODE_AUDIT.md)** - Complete code audit findings

### Policies
- **[MCP_POLICY.md](./MCP_POLICY.md)** - MCP server configuration and usage policies
- **[cline_mcp_settings.json](./cline_mcp_settings.json)** - MCP server configuration file

## 📊 Current Migration Status

| Phase | Status | Start Date | End Date | Completion | Blockers |
|-------|--------|------------|-----------|------------|----------|
| Phase 1: Setup AI-Optimized Documentation | ✅ COMPLETE | 2025-10-25 | 2025-10-25 | 100% | None |
| Phase 2: Configure MCP Servers | ✅ COMPLETE | 2025-10-25 | 2025-10-25 | 100% | None |
| Phase 3: Initialize Convex Project | 🚧 IN PROGRESS | 2025-10-25 | - | 0% | None |
| Phase 4: Migrate Authentication | ⏳ PENDING | - | - | 0% | None |
| Phase 5: Migrate Database Schema | ⏳ PENDING | - | - | 0% | None |
| Phase 6: Migrate Core CRM Services | ⏳ PENDING | - | - | 0% | None |
| Phase 7: Migrate Supporting Services | ⏳ PENDING | - | - | 0% | None |
| Phase 8: Integrate XState | ⏳ PENDING | - | - | 0% | None |
| Phase 9: Update Frontend | ⏳ PENDING | - | - | 0% | None |
| Phase 10: Validation and Cleanup | ⏳ PENDING | - | - | 0% | None |

**Overall Progress**: Phase 1 & 2 complete, Phase 3 ready to start

## 📁 Critical File Paths

### Backend Services (to be migrated)
- 📁 `backend/auth/` - Authentication and authorization
- 📁 `backend/crm/` - Customer relationship management (leads)
- 📁 `backend/fleet/` - Ship and service management
- 📁 `backend/quotes/` - Quote calculation and management
- 📁 `backend/bookings/` - Booking management and conflict detection
- 📁 `backend/conversations/` - Threaded conversations
- 📁 `backend/files/` - File storage and management
- 📁 `backend/settings/` - Application settings
- 📁 `backend/ai/` - AI assistant integration

### Frontend Components
- 📄 `frontend/components/Dashboard.tsx` - Main dashboard orchestrator
- 📄 `frontend/components/LeadsView.tsx` - Lead management interface
- 📄 `frontend/components/FleetView.tsx` - Fleet management interface
- 📄 `frontend/components/QuotesView.tsx` - Quote generation interface
- 📄 `frontend/components/BookingsView.tsx` - Booking management interface
- 📄 `frontend/components/ConversationsView.tsx` - Conversation interface
- 📄 `frontend/components/SettingsAdminView.tsx` - Settings administration
- 📄 `frontend/components/AIAssistantWidget.tsx` - AI assistant interface

### Database Schema
- 📄 `backend/db/migrations/1_initial_schema.up.sql` - Initial database schema
- 📄 `backend/db/migrations/2_extended_schema.up.sql` - Extended schema with AI features

### Configuration Files
- 📄 `backend/encore.app` - Encore application configuration
- 📄 `frontend/vite.config.ts` - Vite build configuration
- 📄 `cline_mcp_settings.json` - MCP server configuration

## 🔄 Tech Stack Overview

| Component | Current | Target | Migration Notes |
|-----------|---------|--------|-----------------|
| **Backend Framework** | Encore.dev | Convex | Complete rewrite of all backend services |
| **Database** | PostgreSQL | Convex document-relational | Fresh start, no data migration |
| **Frontend** | Vite + React | Vite + React | No change - Convex works seamlessly |
| **Authentication** | Encore authHandler | BetterAuth | Replace auth patterns |
| **State Management** | None | XState (selective) | For complex workflows only |
| **Styling** | Tailwind CSS + Shadcn/ui | Tailwind CSS + Shadcn/ui | No change |
| **Data Fetching** | TanStack Query | Convex hooks | Replace client calls |

## 🤖 AI Agent Workflow

**Always follow this sequence when working on this project:**

1. 📖 **Read this index first** - Understand current phase and context
2. 📊 **Check `MIGRATION_LOG.md`** - Get current status and recent progress
3. 🏗️ **Review `ARCHITECTURE_DECISIONS.md`** - Understand the "why" behind technical choices
4. 📋 **Consult `AI_DEVELOPMENT_PLAYBOOK.md`** - Get step-by-step implementation guidance
5. 📦 **Reference `COMPONENT_REGISTRY.md`** - Understand what exists and where to find it
6. 🚨 **Check `ERROR_KNOWLEDGE_BASE.md`** - If issues arise, check for known solutions
7. 📝 **Update `MIGRATION_LOG.md`** - Document your progress after completing tasks

## 🔗 MCP Reference Repositories

Quick access to MCP repositories for documentation and code examples:

- **Convex Backend**: https://gitmcp.io/get-convex/convex-backend
- **BetterAuth**: https://gitmcp.io/better-auth/better-auth
- **XState**: https://gitmcp.io/statelyai/xstate
- **Shadcn/ui**: https://gitmcp.io/shadcn-ui/ui
- **Tailwind CSS**: https://gitmcp.io/tailwindlabs/tailwindcss
- **Next.js**: https://gitmcp.io/vercel/next.js

## 📋 Document Update Protocol

**AI agents must follow these rules when working on this project:**

- ✅ **Always update `MIGRATION_LOG.md`** after completing any task
- ✅ **Document all decisions in `ARCHITECTURE_DECISIONS.md`** when making architectural choices
- ✅ **Add new errors to `ERROR_KNOWLEDGE_BASE.md`** as they are encountered
- ✅ **Update component registry** when adding or modifying components
- ✅ **Keep this index synchronized** with all documentation changes

## 🎯 Next Steps for AI Agents

**Completed Phases**:
- ✅ Phase 1: Setup AI-Optimized Documentation (COMPLETE)
  - ✅ Created all 6 new documentation files
  - ✅ Updated all 7 existing documentation files
- ✅ Phase 2: Configure MCP Servers (COMPLETE)
  - ✅ Simplified cline_mcp_settings.json to 6 servers
  - ✅ Cleaned up MCP_POLICY.md
  - ✅ Added ADR-007 to ARCHITECTURE_DECISIONS.md

**Current Task**: Phase 3 - Initialize Convex Project
- ⏳ Run `npx convex dev` to initialize Convex
- ⏳ Create `convex/schema.ts` with table definitions
- ⏳ Configure `convex.json`
- ⏳ Update root `package.json` with Convex dependencies
- ⏳ Create `convex/tsconfig.json`
- ⏳ Document setup in MIGRATION_LOG.md

**Next Phase**: Phase 4 - Migrate Authentication
- Implement BetterAuth with Convex
- Create auth middleware
- Migrate user authentication

---

**Last Updated**: 2025-10-25 19:15 UTC  
**Phase**: Phase 3 - Initialize Convex Project  
**Status**: Ready to Start  
**Agent**: GLM 4.6 (Documentation Sync)
