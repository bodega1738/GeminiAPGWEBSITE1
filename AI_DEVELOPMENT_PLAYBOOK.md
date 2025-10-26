# 📋 Maritime CRM - AI Development Playbook

## Playbook Purpose

This document provides detailed, actionable instructions for each phase of the Encore.dev → Convex migration. It is designed specifically for AI agents to follow autonomously, with step-by-step guidance, best practices, and troubleshooting tips.

---

## Pre-Migration Checklist

Before starting any migration work, ensure all prerequisites are met:

- [ ] 📖 Read `AI_AGENT_INDEX.md` for complete project orientation
- [ ] 🏗️ Review `ARCHITECTURE_DECISIONS.md` to understand the "why" behind technical choices
- [ ] 📊 Check `MIGRATION_LOG.md` for current migration status and recent progress
- [ ] 🔧 Verify MCP servers are configured (see `cline_mcp_settings.json`)
- [ ] 📚 Confirm access to reference repositories (Convex, BetterAuth, XState)
- [ ] 📦 Understand current tech stack (see `COMPONENT_REGISTRY.md`)
- [ ] 🚨 Review `ERROR_KNOWLEDGE_BASE.md` for common issues and solutions

---

## Phase 1: Setup AI-Optimized Documentation ✅ COMPLETED

### Objective
Create master documentation structure for AI agent consumption and future development guidance.

### Tasks Completed
- [x] Create `AI_AGENT_INDEX.md` with navigation map and status dashboard
- [x] Create `MIGRATION_LOG.md` for real-time progress tracking
- [x] Create `ARCHITECTURE_DECISIONS.md` with ADRs for technical choices
- [x] Create `COMPONENT_REGISTRY.md` with complete component catalog
- [x] Create `ERROR_KNOWLEDGE_BASE.md` for troubleshooting guidance
- [x] Create this file (`AI_DEVELOPMENT_PLAYBOOK.md`) with step-by-step instructions
- [ ] Update all existing docs to reference the master index

### Success Criteria
- [x] All 6 new documentation files created with specified content
- [ ] All 7 existing documentation files updated with reference sections
- [ ] Documentation structure is AI-agent-friendly with clear navigation

### Next Phase
Phase 2 - Configure MCP Servers

---

## Phase 2: Configure MCP Servers

### Objective
Update MCP configuration with Convex, BetterAuth, XState references to provide AI agents with comprehensive documentation and code examples.

### Step-by-Step Instructions

#### 1. Open MCP Configuration
```bash
# Navigate to project root and open configuration
cd /path/to/maritime-crm-dashboard
code cline_mcp_settings.json
```

#### 2. Add Required MCP Servers
Update `cline_mcp_settings.json` to include these servers:

```json
{
  "convex-backend Docs": {
    "url": "https://gitmcp.io/get-convex/convex-backend",
    "disabled": false,
    "autoApprove": ["read", "search"]
  },
  "better-auth Docs": {
    "url": "https://gitmcp.io/better-auth/better-auth",
    "disabled": false,
    "autoApprove": ["read", "search"]
  },
  "xstate Docs": {
    "url": "https://gitmcp.io/statelyai/xstate",
    "disabled": false,
    "autoApprove": ["read", "search"]
  },
  "shadcn-ui Docs": {
    "url": "https://gitmcp.io/shadcn-ui/ui",
    "disabled": false,
    "autoApprove": ["read", "search"]
  }
}
```

#### 3. Remove Unused Repositories
Remove or disable these MCP servers if they exist:
- Prisma (not used in Convex)
- Encore (being migrated away from)
- axios (minor utility, not core)

#### 4. Verify Existing Repositories
Ensure these remain properly configured:
- Next.js
- Tailwind CSS

#### 5. Update MCP Policy
Update `MCP_POLICY.md` to reference new repositories and usage patterns.

#### 6. Test MCP Server Connections
```bash
# Test connection to each repository
# Verify you can access documentation and code examples
```

#### 7. Document Changes
Update `MIGRATION_LOG.md` with:
- MCP configuration changes
- Connection test results
- Any issues encountered

### Success Criteria
- [ ] MCP configuration updated with Convex, BetterAuth, XState servers
- [ ] Unused repositories removed or disabled
- [ ] All new servers accessible and functional
- [ ] `MCP_POLICY.md` updated with new reference patterns
- [ ] Changes documented in `MIGRATION_LOG.md`

### Common Issues
- **Connection timeouts**: Check network connectivity and repository URLs
- **Authentication issues**: Verify repository access permissions
- **MCP server conflicts**: Ensure no duplicate or conflicting configurations

See `ERROR_KNOWLEDGE_BASE.md` for detailed troubleshooting if issues arise.

### Next Phase
Phase 3 - Initialize Convex Project

---

## Phase 3: Initialize Convex Project

### Objective
Set up Convex backend infrastructure and development environment.

### Step-by-Step Instructions

#### 1. Install Convex CLI
```bash
# Install globally if not already installed
npm install -g convex

# Verify installation
convex --version
```

#### 2. Initialize Convex Project
```bash
# Navigate to project root
cd /path/to/maritime-crm-dashboard

# Initialize Convex (creates convex/ directory)
npx convex dev
```

This will:
- Create `convex/` directory
- Generate `convex/schema.ts` (empty template)
- Create `convex/http.ts` for HTTP actions
- Set up Convex dashboard access
- Generate environment variables

#### 3. Create Convex TypeScript Configuration
Create `convex/tsconfig.json`:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "../node_modules/.convex"
  },
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "_generated",
    "node_modules"
  ]
}
```

#### 4. Update Root Package Dependencies
Add to root `package.json`:
```json
{
  "dependencies": {
    "convex": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  },
  "scripts": {
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy"
  }
}
```

#### 5. Configure Convex Project Settings
Create `convex.json`:
```json
{
  "version": "1",
  "functions": "./",
  "schema": "./schema.ts"
}
```

#### 6. Initialize Database Schema
Create initial `convex/schema.ts` with basic structure:
```typescript
import { defineTable, v } from "convex/server";

export default defineTable({
  // Start with users table as foundation
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
    orgId: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_email", ["email"])
    .index("by_org", ["orgId"]),
  
  // We'll add more tables in Phase 5
});
```

#### 7. Verify Convex Dashboard
- Open Convex dashboard URL from dev output
- Verify project is accessible
- Check schema is displayed correctly

#### 8. Document Setup Steps
Update `MIGRATION_LOG.md` with:
- Convex initialization completion
- Any issues encountered
- Environment variables generated

### Files Created/Modified
- `convex/schema.ts` - Database schema definition
- `convex/tsconfig.json` - TypeScript configuration for Convex
- `convex.json` - Convex project configuration
- `package.json` - Add Convex dependencies and scripts

### Success Criteria
- [ ] Convex CLI installed and functional
- [ ] `convex/` directory created with proper structure
- [ ] Initial schema defined with users table
- [ ] Convex dashboard accessible and working
- [ ] All configuration files properly set up

### Reference: Study Convex MCP Repository
Before proceeding, study the Convex backend MCP repository for:
- Schema patterns and best practices
- Query and mutation examples
- Authentication patterns
- File handling approaches

### Next Phase
Phase 4 - Migrate Authentication

---

## Phase 4: Migrate Authentication to Convex + BetterAuth

### Objective
Replace Encore authHandler with BetterAuth + Convex auth for user authentication and authorization.

### Step-by-Step Instructions

#### 1. Study BetterAuth MCP Repository
Before implementation, review BetterAuth documentation for:
- Configuration patterns
- Convex integration examples
- Authentication flows
- Session management

#### 2. Install BetterAuth
```bash
# Add BetterAuth to project dependencies
npm install better-auth
npm install @better-auth/convex
```

#### 3. Create BetterAuth Configuration
Create `convex/auth.ts`:
```typescript
import { betterAuth } from "better-auth";
import { convexAdapter } from "@better-auth/convex";
import { z } from "zod";

export const { auth, signIn, signUp } = betterAuth({
  database: convexAdapter({
    provider: "convex",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    // Add OAuth providers if needed
  },
});
```

#### 4. Update Database Schema
Add authentication tables to `convex/schema.ts`:
```typescript
import { defineTable, v } from "convex/server";

export default defineTable({
  users: defineTable({
    id: v.id("users"),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
    orgId: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    emailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_email", ["email"])
    .index("by_org", ["orgId"]),
    
  // BetterAuth tables
  accounts: defineTable({
    id: v.id("accounts"),
    userId: v.id("users"),
    provider: v.string(),
    providerAccountId: v.string(),
    createdAt: v.number()
  }).index("by_user", ["userId"]),
  
  sessions: defineTable({
    id: v.id("sessions"),
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number()
  }).index("by_user", ["userId"])
    .index("by_token", ["token"])
    .index("by_expires", ["expiresAt"]),
    
  // Add other BetterAuth tables as needed
});
```

#### 5. Create Auth Middleware Helper
Create `convex/authMiddleware.ts`:
```typescript
import { Auth } from "better-auth";
import { query } from "./_generated/server";

export const requireAuth = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: No authentication data found");
  }
  return identity;
};

export const requireRole = (role: "admin" | "staff") => {
  return async (ctx: any) => {
    const identity = await requireAuth(ctx);
    
    // Get user role from database
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("id"), identity.tokenIdentifier))
      .first();
      
    if (!user || user.role !== role) {
      throw new Error(`Forbidden: User must be ${role}`);
    }
    
    return { ...identity, user };
  };
};
```

#### 6. Implement User Authentication Functions
Create `convex/users.ts`:
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./authMiddleware";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);
    
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("id"), identity.tokenIdentifier))
      .first();
      
    if (!user) {
      throw new Error("User not found");
    }
    
    return { ...identity, user };
  }
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("id"), args.userId))
      .first();
  }
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    const updateData: any = { updatedAt: Date.now() };
    if (args.name) updateData.name = args.name;
    if (args.email) updateData.email = args.email;
    
    return await ctx.db
      .patch("users", identity.tokenIdentifier)
      .set(updateData);
  }
});
```

#### 7. Create HTTP Endpoints for Auth
Create `convex/http.ts`:
```typescript
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// BetterAuth will handle auth endpoints
http.route({
  pathPrefix: "/auth",
  method: "ANY",
  handler: auth.handler,
});

export default http;
```

#### 8. Test Authentication Flow
- Test user registration
- Test user login
- Verify session management
- Test role-based access control

#### 9. Document Auth Implementation
Update documentation with:
- Authentication patterns used
- BetterAuth configuration decisions
- Auth middleware helper functions

### Migration Map
| Encore File | Convex File | Pattern Change |
|------------|-------------|----------------|
| `backend/auth/auth.ts` | `convex/auth.ts` | Replace Encore authHandler with BetterAuth |
| `backend/auth/me.ts` | `convex/users.ts` | Convert getMe endpoint to Convex query |
| Encore `authHandler` | BetterAuth + Convex auth middleware | New authentication flow |

### Success Criteria
- [ ] BetterAuth installed and configured
- [ ] Database schema updated with auth tables
- [ ] Auth middleware helper functions created
- [ ] User authentication endpoints implemented
- [ ] Role-based access control working
- [ ] Authentication flow tested end-to-end

### Next Phase
Phase 5 - Migrate Database Schema

---

## Phase 5: Migrate Database Schema to Convex

### Objective
Convert PostgreSQL schema to Convex document-relational schema, defining all tables needed for the application.

### Step-by-Step Instructions

#### 1. Review PostgreSQL Schema
Study `backend/db/migrations/1_initial_schema.up.sql` and `2_extended_schema.up.sql` to understand:
- All table structures
- Data types and constraints
- Relationships and indexes
- Enum values and defaults

#### 2. Create Complete Convex Schema
Update `convex/schema.ts` with all 13 tables:

```typescript
import { defineTable, v } from "convex/server";

export default defineTable({
  // Users table (from Phase 4)
  users: defineTable({
    id: v.id("users"),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
    orgId: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    emailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_email", ["email"])
    .index("by_org", ["orgId"]),
  
  // Leads table
  leads: defineTable({
    id: v.id("leads"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.union(
      v.literal("new"), 
      v.literal("contacted"), 
      v.literal("qualified"),
      v.literal("converted"),
      v.literal("lost")
    ),
    source: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    orgId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_org", ["orgId"]),
  
  // Ships table
  ships: defineTable({
    id: v.id("ships"),
    name: v.string(),
    type: v.string(),
    capacity: v.number(),
    status: v.union(
      v.literal("available"),
      v.literal("in_use"),
      v.literal("maintenance"),
      v.literal("unavailable")
    ),
    specifications: v.optional(v.any()), // JSON object
    orgId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_org", ["orgId"]),
  
  // Services table
  services: defineTable({
    id: v.id("services"),
    shipId: v.id("ships"),
    type: v.union(
      v.literal("maintenance"),
      v.literal("repair"),
      v.literal("inspection"),
      v.literal("cleaning")
    ),
    description: v.string(),
    cost: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    scheduledDate: v.number(),
    completedDate: v.optional(v.number()),
    orgId: v.string(),
    createdAt: v.number()
  }).index("by_ship", ["shipId"])
    .index("by_status", ["status"])
    .index("by_scheduled", ["scheduledDate"]),
  
  // Pricing rules table
  pricingRules: defineTable({
    id: v.id("pricingRules"),
    name: v.string(),
    shipType: v.string(),
    baseRate: v.number(),
    perDayRate: v.number(),
    additionalCharges: v.optional(v.array(v.any())), // Array of charge objects
    active: v.boolean(),
    orgId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_ship_type", ["shipType"])
    .index("by_active", ["active"])
    .index("by_org", ["orgId"]),
  
  // Quotes table
  quotes: defineTable({
    id: v.id("quotes"),
    leadId: v.id("leads"),
    shipId: v.id("ships"),
    startDate: v.number(),
    endDate: v.number(),
    totalPrice: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("calculated"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("converted")
    ),
    calculationBreakdown: v.optional(v.any()), // JSON object
    orgId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_lead", ["leadId"])
    .index("by_ship", ["shipId"])
    .index("by_status", ["status"])
    .index("by_dates", ["startDate", "endDate"]),
  
  // Bookings table
  bookings: defineTable({
    id: v.id("bookings"),
    leadId: v.id("leads"),
    shipId: v.id("ships"),
    startDate: v.number(),
    endDate: v.number(),
    totalPrice: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    conflictResolved: v.boolean(),
    state: v.optional(v.string()), // For XState integration
    orgId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_ship", ["shipId"])
    .index("by_lead", ["leadId"])
    .index("by_status", ["status"])
    .index("by_dates", ["startDate", "endDate"])
    .index("by_conflict", ["conflictResolved"]),
  
  // Add remaining tables (threads, thread_messages, files, settings, audit_logs, ai_providers, ai_usage)
  // Following same patterns...
});
```

#### 3. Add Performance Indexes
Ensure proper indexes for common query patterns:
- Org-based filtering
- Status-based queries
- Date-range queries
- Foreign key lookups

#### 4. Validate Schema
- Run `npx convex dev` to validate schema
- Check Convex dashboard for table definitions
- Verify all relationships are properly defined

#### 5. Document Schema Decisions
Update `ARCHITECTURE_DECISIONS.md` with:
- Schema design choices
- Index strategy
- Data type conversions from SQL

### Conversion Patterns

| SQL Type | Convex Type | Example |
|-----------|---------------|----------|
| `TEXT` | `v.string()` | `name: v.string()` |
| `INTEGER` | `v.number()` | `capacity: v.number()` |
| `BOOLEAN` | `v.boolean()` | `active: v.boolean()` |
| `TIMESTAMP` | `v.number()` | `createdAt: v.number()` (Unix timestamp) |
| `CHECK` constraints | `v.union()` | `status: v.union(v.literal('new'), v.literal('old'))` |
| `FOREIGN KEY` | Store ID as string | `userId: v.id("users")` |
| `JSONB` | `v.any()` or `v.object()` | `metadata: v.any()` |

### Success Criteria
- [ ] All 13 tables defined in Convex schema
- [ ] Proper indexes added for performance
- [ ] Schema validation passes
- [ ] All relationships properly defined
- [ ] Documentation updated with schema decisions

### Next Phase
Phase 6 - Migrate Core CRM Services

---

## Phase 6: Migrate Core CRM Services to Convex

### Objective
Migrate leads, fleet, quotes, and bookings services from Encore to Convex with proper query patterns and business logic.

### Services to Migrate

#### 1. CRM/Leads Service
**From**: `backend/crm/leads.ts` → **To**: `convex/leads.ts`

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./authMiddleware";

export const getLeads = query({
  args: {
    orgId: v.string(),
    status: v.optional(v.union(
      v.literal("new"), 
      v.literal("contacted"), 
      v.literal("qualified")
    )),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    let leadsQuery = ctx.db
      .query("leads")
      .filter(q => q.eq(q.field("orgId"), args.orgId));
      
    if (args.status) {
      leadsQuery = leadsQuery.filter(q => q.eq(q.field("status"), args.status));
    }
    
    leadsQuery = leadsQuery.order("desc", "createdAt");
    
    if (args.limit) {
      leadsQuery = leadsQuery.take(args.limit);
    }
    
    return await leadsQuery.collect();
  }
});

export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    source: v.optional(v.string()),
    orgId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    return await ctx.db.insert("leads", {
      ...args,
      status: "new",
      assignedTo: identity.tokenIdentifier,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const updateLead = mutation({
  args: {
    leadId: v.id("leads"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      status: v.optional(v.union(
        v.literal("new"), 
        v.literal("contacted"), 
        v.literal("qualified"),
        v.literal("converted"),
        v.literal("lost")
      ))
    })
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    return await ctx.db
      .patch("leads", args.leadId)
      .set({
        ...args.updates,
        updatedAt: Date.now()
      });
  }
});
```

#### 2. Fleet Services
**From**: `backend/fleet/ships.ts` → **To**: `convex/ships.ts`
**From**: `backend/fleet/services.ts` → **To**: `convex/services.ts`

#### 3. Quotes Services
**From**: `backend/quotes/quotes.ts` → **To**: `convex/quotes.ts`
**From**: `backend/quotes/calculator.ts` → **To**: `convex/calculator.ts`
**From**: `backend/quotes/pricing_rules.ts` → **To**: `convex/pricingRules.ts`

#### 4. Bookings Service
**From**: `backend/bookings/bookings.ts` → **To**: `convex/bookings.ts`

### Step-by-Step Migration Process

For Each Service:

#### 1. Create New Convex File
```bash
# Example for leads service
touch convex/leads.ts
```

#### 2. Import Required Dependencies
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./authMiddleware";
```

#### 3. Convert Encore API Decorators to Convex Functions
```typescript
// Before (Encore)
export const getLeads = api(
  { method: "GET", path: "/crm/leads", expose: true },
  async (params: GetLeadsParams): Promise<Lead[]> => {
    return await db.queryAll<Lead[]>(
      'SELECT * FROM leads WHERE org_id = $1',
      [params.orgId]
    );
  }
);

// After (Convex)
export const getLeads = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .filter(q => q.eq(q.field("orgId"), args.orgId))
      .collect();
  }
});
```

#### 4. Replace SQL Queries with Convex Query API
```typescript
// Before (Encore)
const leads = await db.queryAll<Lead[]>(
  'SELECT * FROM leads WHERE status = $1 AND created_at > $2 ORDER BY created_at DESC LIMIT $3',
  [status, since, limit]
);

// After (Convex)
let leadsQuery = ctx.db.query("leads")
  .filter(q => q.eq(q.field("status"), status))
  .filter(q => q.gt(q.field("createdAt"), since));

if (limit) {
  leadsQuery = leadsQuery.take(limit);
}

return await leadsQuery.order("desc", "createdAt").collect();
```

#### 5. Add Authentication Checks
```typescript
// Add to all protected functions
export const createLead = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    // Always check auth first
    const identity = await requireAuth(ctx);
    
    // Now implement business logic
    return await ctx.db.insert("leads", {
      ...args,
      orgId: identity.orgId,
      createdAt: Date.now()
    });
  }
});
```

#### 6. Test Each Function
- Test in Convex dashboard
- Verify data persistence
- Check query results
- Test error handling

#### 7. Update Component Registry
Mark each service as migrated in `COMPONENT_REGISTRY.md`.

### Common Conversion Patterns

| Encore Pattern | Convex Pattern |
|---------------|----------------|
| `db.queryAll()` | `ctx.db.query().collect()` |
| `db.queryOne()` | `ctx.db.query().first()` |
| `db.insert()` | `ctx.db.insert()` |
| `db.update()` | `ctx.db.patch()` |
| `api()` decorator | `query()` or `mutation()` |
| `getAuthData()` | `ctx.auth.getUserIdentity()` |

### Success Criteria
- [ ] All 4 core services migrated to Convex
- [ ] All functions tested in Convex dashboard
- [ ] Authentication properly integrated
- [ ] Business logic preserved
- [ ] Component registry updated

### Next Phase
Phase 7 - Migrate Supporting Services

---

## Phase 7: Migrate Supporting Services to Convex

### Objective
Migrate conversations, files, settings, and AI services to complete the backend migration.

### Services to Migrate

#### 1. Conversations Service
**From**: `backend/conversations/conversations.ts` → **To**: `convex/conversations.ts`

Special considerations:
- Convert webhook handling to Convex HTTP actions
- Implement threading logic with Convex queries
- Handle real-time updates

#### 2. Files Service
**From**: `backend/files/files.ts` → **To**: `convex/files.ts`

Special considerations:
- Migrate from object storage to Convex file storage API
- Handle file uploads via HTTP actions
- Implement file metadata management

#### 3. Settings Service
**From**: `backend/settings/settings.ts` → **To**: `convex/settings.ts`

Special considerations:
- Simple key-value storage patterns
- User-specific vs global settings
- Configuration validation

#### 4. AI Assistant Service
**From**: `backend/ai/assistant.ts` → **To**: `convex/ai.ts`

Special considerations:
- Replace Encore secrets with Convex environment variables
- Implement rate limiting
- Handle external API calls via Convex actions

### Step-by-Step Process

Follow the same migration process as Phase 6:

1. Create new Convex files
2. Import dependencies
3. Convert Encore patterns to Convex
4. Add authentication
5. Test functions
6. Update registry

### Special Implementation Notes

#### File Storage Migration
```typescript
// Before (Encore) - External object storage
export const uploadFile = api(
  { method: "POST", path: "/files/upload", expose: true },
  async (ctx: Context, req: UploadRequest): Promise<FileResponse> => {
    const file = await req.blob();
    const url = await uploadToObjectStorage(file);
    // Save metadata to database
  }
);

// After (Convex) - Built-in file storage
export const uploadFile = mutation({
  args: {
    file: v.any(), // Convex file type
    relatedEntityType: v.string(),
    relatedEntityId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    // Convex handles file storage automatically
    const fileId = await ctx.storage.store(args.file);
    
    // Save metadata
    return await ctx.db.insert("files", {
      id: fileId,
      filename: args.file.name,
      size: args.file.size,
      uploadedBy: identity.tokenIdentifier,
      relatedEntityType: args.relatedEntityType,
      relatedEntityId: args.relatedEntityId,
      createdAt: Date.now()
    });
  }
});
```

#### AI Service with External APIs
```typescript
export const chatWithAI = action({
  args: {
    message: v.string(),
    context: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    // External API call in action
    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: args.message,
        context: args.context
      })
    });
    
    const result = await response.json();
    
    // Save usage via mutation
    await ctx.scheduler.runAfter(0, mutations.saveAIUsage, {
      userId: identity.tokenIdentifier,
      tokensUsed: result.usage.tokens,
      cost: result.usage.cost
    });
    
    return result;
  }
});
```

### Success Criteria
- [ ] All 4 supporting services migrated
- [ ] File storage working with Convex
- [ ] AI service integrated with external APIs
- [ ] Webhook handling converted to HTTP actions
- [ ] All services tested end-to-end

### Next Phase
Phase 8 - Integrate XState

---

## Phase 8: Integrate XState for Complex Workflows

### Objective
Add state machines for booking, quote, and AI workflows to manage complex business logic and prevent invalid states.

### Step-by-Step Instructions

#### 1. Install XState
```bash
npm install xstate
```

#### 2. Study XState MCP Repository
Review XState documentation for:
- State machine patterns
- Convex integration examples
- Best practices for persistence

#### 3. Create Machines Directory
```bash
mkdir convex/machines
```

#### 4. Create Booking Machine
Create `convex/machines/bookingMachine.ts`:

```typescript
import { createMachine, assign } from 'xstate';
import { mutation } from '../_generated/server';

export const bookingMachine = createMachine({
  id: 'booking',
  initial: 'idle',
  context: {
    bookingId: null as string | null,
    conflictData: null as any,
    error: null as string | null
  },
  states: {
    idle: {
      on: {
        START_BOOKING: {
          target: 'checking_availability',
          actions: assign({
            bookingId: (_, event) => event.bookingId
          })
        }
      }
    },
    
    checking_availability: {
      invoke: {
        src: 'checkAvailability',
        onDone: {
          target: 'conflict_detected',
          cond: (context, event) => event.data.hasConflict,
          actions: assign({
            conflictData: (_, event) => event.data.conflictData
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message
          })
        }
      }
    },
    
    conflict_detected: {
      on: {
        RESOLVE_CONFLICT: {
          target: 'resolving',
          actions: assign({
            conflictData: null
          })
        },
        CANCEL_BOOKING: {
          target: 'cancelled'
        }
      }
    },
    
    resolving: {
      invoke: {
        src: 'resolveConflict',
        onDone: {
          target: 'confirmed',
          actions: assign({
            conflictData: null
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message
          })
        }
      }
    },
    
    confirmed: {
      type: 'final'
    },
    
    cancelled: {
      type: 'final'
    },
    
    error: {
      type: 'final'
    }
  }
});
```

#### 5. Create Quote Machine
Create `convex/machines/quoteMachine.ts`:

```typescript
import { createMachine, assign } from 'xstate';

export const quoteMachine = createMachine({
  id: 'quote',
  initial: 'configuring',
  context: {
    quoteId: null as string | null,
    configuration: {},
    calculation: null as any,
    error: null as string | null
  },
  states: {
    configuring: {
      on: {
        CALCULATE: {
          target: 'calculating',
          actions: assign({
            configuration: (_, event) => event.configuration
          })
        }
      }
    },
    
    calculating: {
      invoke: {
        src: 'performCalculation',
        onDone: {
          target: 'saving',
          actions: assign({
            calculation: (_, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message
          })
        }
      }
    },
    
    saving: {
      invoke: {
        src: 'saveQuote',
        onDone: {
          target: 'completed',
          actions: assign({
            quoteId: (_, event) => event.data.quoteId
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message
          })
        }
      }
    },
    
    completed: {
      on: {
        CONVERT_TO_BOOKING: 'converting'
      }
    },
    
    converting: {
      type: 'final'
    },
    
    error: {
      type: 'final'
    }
  }
});
```

#### 6. Create AI Assistant Machine
Create `convex/machines/aiMachine.ts`:

```typescript
import { createMachine, assign } from 'xstate';

export const aiMachine = createMachine({
  id: 'ai_assistant',
  initial: 'idle',
  context: {
    messageId: null as string | null,
    rateLimit: { remaining: 100, resetTime: 0 },
    response: null as any,
    error: null as string | null
  },
  states: {
    idle: {
      on: {
        SEND_MESSAGE: {
          target: 'rate_checking',
          actions: assign({
            messageId: (_, event) => event.messageId
          })
        }
      }
    },
    
    rate_checking: {
      invoke: {
        src: 'checkRateLimit',
        onDone: {
          target: 'querying',
          cond: (context, event) => event.data.allowed,
          actions: assign({
            rateLimit: (_, event) => event.data.rateLimit
          })
        },
        onError: {
          target: 'rate_limited',
          actions: assign({
            error: 'Rate limit exceeded'
          })
        }
      }
    },
    
    rate_limited: {
      type: 'final'
    },
    
    querying: {
      invoke: {
        src: 'queryAI',
        onDone: {
          target: 'responding',
          actions: assign({
            response: (_, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message
          })
        }
      }
    },
    
    responding: {
      invoke: {
        src: 'saveResponse',
        onDone: {
          target: 'completed'
        },
        onError: {
          target: 'error'
        }
      }
    },
    
    completed: {
      type: 'final'
    },
    
    error: {
      type: 'final'
    }
  }
});
```

#### 7. Integrate Machines with Convex
Create mutation functions for state persistence:

```typescript
// In convex/bookingMutations.ts
export const persistBookingState = mutation({
  args: {
    bookingId: v.id("bookings"),
    state: v.string(),
    stateData: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch("bookings", args.bookingId, {
      state: args.state,
      stateData: args.stateData,
      stateUpdatedAt: Date.now()
    });
  }
});

export const checkAvailability = mutation({
  args: {
    shipId: v.id("ships"),
    startDate: v.number(),
    endDate: v.number()
  },
  handler: async (ctx, args) => {
    // Check for conflicting bookings
    const conflicts = await ctx.db
      .query("bookings")
      .filter(q => 
        q.and(
          q.eq(q.field("shipId"), args.shipId),
          q.or(
            q.and(
              q.lte(q.field("startDate"), args.startDate),
              q.gte(q.field("endDate"), args.startDate)
            ),
            q.and(
              q.lte(q.field("startDate"), args.endDate),
              q.gte(q.field("endDate"), args.endDate)
            ),
            q.and(
              q.gte(q.field("startDate"), args.startDate),
              q.lte(q.field("endDate"), args.endDate)
            )
          )
        )
      )
      .collect();
      
    return {
      hasConflict: conflicts.length > 0,
      conflictData: conflicts.length > 0 ? conflicts : null
    };
  }
});
```

#### 8. Add State Fields to Schema
Update relevant tables to include state fields:

```typescript
// In convex/schema.ts - update bookings table
bookings: defineTable({
  // ... existing fields
  state: v.optional(v.string()),
  stateData: v.optional(v.any()),
  stateUpdatedAt: v.optional(v.number())
})
```

#### 9. Test State Machine Integration
- Test booking workflow with conflicts
- Test quote generation flow
- Test AI assistant rate limiting
- Verify state persistence

#### 10. Document State Machine Decisions
Update `ARCHITECTURE_DECISIONS.md` with:
- Which workflows use state machines
- State transition logic
- Integration patterns with Convex

### Success Criteria
- [ ] All 3 state machines implemented
- [ ] State persistence working with Convex
- [ ] Machine transitions tested end-to-end
- [ ] Integration with existing services complete
- [ ] Documentation updated with state machine patterns

### Next Phase
Phase 9 - Update Frontend

---

## Phase 9: Update Frontend to Use Convex Client

### Objective
Replace Encore client with Convex hooks in frontend to connect with the migrated backend.

### Step-by-Step Instructions

#### 1. Install Convex React Package
```bash
cd frontend
npm install convex
```

#### 2. Create Convex Provider
Update `frontend/App.tsx`:

```typescript
import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Dashboard } from './components/Dashboard';

// Create Convex client
const convex = new ConvexReactClient(process.env.CONVEX_URL!);

function App() {
  return (
    <ConvexProvider client={convex}>
      <Dashboard />
    </ConvexProvider>
  );
}

export default App;
```

#### 3. Replace Encore Client
Remove or update `frontend/client.ts`:

```typescript
// Old (Encore) - Remove this
import Client from './client';

// New (Convex) - Add this if needed
import { api } from '../convex/_generated/api';

export { api };
```

#### 4. Update All Components

##### Dashboard Component
```typescript
// Before (Encore)
import Client from '../client';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    Client.me.get().then(setUser);
  }, []);
}

// After (Convex)
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export function Dashboard() {
  const { data: user, isLoading } = useQuery(api.users.getMe);
  
  if (isLoading) return <div>Loading...</div>;
  return <div>Welcome, {user?.name}</div>;
}
```

##### Leads View Component
```typescript
// Before (Encore)
import Client from '../client';
const leads = await Client.crm.getLeads();

// After (Convex)
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export function LeadsView() {
  const { data: leads, isLoading } = useQuery(api.crm.getLeads);
  const createLead = useMutation(api.crm.createLead);
  
  const handleCreateLead = (leadData) => {
    createLead.mutate(leadData);
  };
  
  return (
    <div>
      {leads?.map(lead => (
        <div key={lead._id}>{lead.name}</div>
      ))}
    </div>
  );
}
```

#### 5. Update Environment Variables
Create or update `.env.local` in frontend:

```bash
# Generated by npx convex dev
CONVEX_URL=http://localhost:3210
```

#### 6. Handle Real-time Updates
For components that need real-time data:

```typescript
import { useQuery } from 'convex/react';

export function BookingsView() {
  // This will automatically update when data changes
  const { data: bookings } = useQuery(api.bookings.listBookings);
  
  return (
    <div>
      {bookings?.map(booking => (
        <div key={booking._id}>
          {booking.status} - Real-time updates enabled
        </div>
      ))}
    </div>
  );
}
```

#### 7. Components to Update

| Component | File Path | Changes Needed |
|-----------|-------------|---------------|
| Dashboard | `frontend/components/Dashboard.tsx` | Add ConvexProvider, update user fetching |
| LeadsView | `frontend/components/LeadsView.tsx` | Replace CRM API calls |
| FleetView | `frontend/components/FleetView.tsx` | Replace fleet API calls |
| QuotesView | `frontend/components/QuotesView.tsx` | Replace quotes API calls |
| BookingsView | `frontend/components/BookingsView.tsx` | Replace bookings API calls |
| ConversationsView | `frontend/components/ConversationsView.tsx` | Replace conversations API calls |
| SettingsAdminView | `frontend/components/SettingsAdminView.tsx` | Replace settings API calls |
| AIAssistantWidget | `frontend/components/AIAssistantWidget.tsx` | Replace AI API calls |
| AnalyticsView | `frontend/components/AnalyticsView.tsx` | Update all data sources |
| CalendarView | `frontend/components/CalendarView.tsx` | Update bookings data |

#### 8. Test All Views
- Test each component individually
- Verify data loads correctly
- Test CRUD operations
- Check real-time updates

#### 9. Update Build Configuration
Ensure `frontend/vite.config.ts` handles Convex integration:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.CONVEX_URL': JSON.stringify(process.env.CONVEX_URL)
  }
});
```

### Migration Pattern Examples

| Encore Pattern | Convex Pattern |
|---------------|----------------|
| `Client.crm.getLeads()` | `useQuery(api.crm.getLeads)` |
| `Client.crm.createLead(data)` | `useMutation(api.crm.createLead)` |
| `useEffect(() => fetchData())` | `useQuery(api.some.fetch)` (automatic) |
| Manual loading states | Built-in `isLoading`, `isError` |

### Success Criteria
- [ ] All components updated to use Convex hooks
- [ ] Encore client removed
- [ ] Real-time updates working
- [ ] All CRUD operations functional
- [ ] Build process successful

### Next Phase
Phase 10 - Validation and Cleanup

---

## Phase 10: Migration Validation and Cleanup

### Objective
Test the entire migrated system, remove old Encore code, and update all documentation.

### Step-by-Step Instructions

#### 1. End-to-End Testing

##### Leads Management
- [ ] Create new lead
- [ ] Update lead status
- [ ] View lead pipeline
- [ ] Search and filter leads

##### Fleet Management
- [ ] Add new ship
- [ ] Update ship status
- [ ] Create maintenance service
- [ ] View fleet utilization

##### Quote Generation
- [ ] Create new quote
- [ ] Test pricing calculations
- [ ] Convert quote to booking
- [ ] View quote history

##### Booking Management
- [ ] Create new booking
- [ ] Test conflict detection
- [ ] Update booking status
- [ ] Cancel booking

##### Conversations
- [ ] Create new thread
- [ ] Add messages to thread
- [ ] View conversation history

##### File Management
- [ ] Upload files
- [ ] View file metadata
- [ ] Download files

##### Settings
- [ ] Update application settings
- [ ] Configure user preferences
- [ ] Test AI configuration

##### AI Assistant
- [ ] Send message to AI
- [ ] Test rate limiting
- [ ] Verify response handling

#### 2. Authentication Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify role-based access control
- [ ] Test session management
- [ ] Verify logout functionality

#### 3. XState Workflow Testing
- [ ] Test booking conflict resolution workflow
- [ ] Test quote generation state machine
- [ ] Test AI assistant rate limiting
- [ ] Verify state persistence

#### 4. Performance Testing
- [ ] Test Convex query performance
- [ ] Verify real-time updates work
- [ ] Check loading times
- [ ] Test concurrent users

#### 5. Remove Old Encore Code
```bash
# Backup first (optional)
mv backend backend_backup_$(date +%Y%m%d)

# Remove old Encore directory
rm -rf backend
```

#### 6. Update Documentation

##### Update DEVELOPMENT.md
```markdown
# Replace Encore setup with Convex instructions
# Add Convex CLI commands
# Update environment setup
# Include BetterAuth configuration
```

##### Update API-DOCUMENTATION.md
- Replace Encore endpoint documentation with Convex function documentation
- Update authentication patterns
- Add real-time subscription examples

##### Finalize MIGRATION_LOG.md
- Mark all phases as completed
- Add completion summary
- Document any remaining tasks

##### Update CHANGELOG.md
```markdown
## v3.0.0 - Convex Migration (2025-10-25)

### Major Changes
- **Backend Framework**: Migrated from Encore.dev to Convex
- **Database**: Migrated from PostgreSQL to Convex document-relational
- **Authentication**: Migrated from Encore authHandler to BetterAuth
- **State Management**: Added XState for complex workflows
- **Real-time**: Enabled real-time updates throughout application

### New Features
- Real-time booking conflict detection
- AI assistant with rate limiting
- State machine-based workflows
- Improved developer experience

### Breaking Changes
- API endpoints updated to Convex patterns
- Environment variables changed
- Build process updated
```

#### 7. Final Health Check
- [ ] Verify all tests pass
- [ ] Check Convex dashboard for any issues
- [ ] Confirm no Encore dependencies remain
- [ ] Validate environment configuration
- [ ] Test deployment process

#### 8. Create Migration Report
Create final migration summary with:
- Tasks completed
- Issues encountered and resolved
- Performance improvements
- Lessons learned
- Recommendations for future

### Success Criteria
- [ ] All features tested end-to-end
- [ ] Authentication and authorization working
- [ ] Real-time updates functional
- [ ] XState workflows operational
- [ ] Old Encore code removed
- [ ] All documentation updated
- [ ] No build or runtime errors

### Migration Complete! 🎉

---

## Best Practices for AI Agents

### Always Follow This Sequence
1. 📖 Read `AI_AGENT_INDEX.md` first for orientation
2. 📊 Check `MIGRATION_LOG.md` for current status
3. 🏗️ Review `ARCHITECTURE_DECISIONS.md` to understand "why"
4. 📋 Consult this playbook for step-by-step guidance
5. 📦 Reference `COMPONENT_REGISTRY.md` for component details
6. 🚨 Check `ERROR_KNOWLEDGE_BASE.md` if issues arise
7. 📝 Update `MIGRATION_LOG.md` with progress

### Documentation Updates
- ✅ **Always update `MIGRATION_LOG.md`** after completing any task
- ✅ **Document all decisions in `ARCHITECTURE_DECISIONS.md`** when making architectural choices
- ✅ **Add new errors to `ERROR_KNOWLEDGE_BASE.md`** as they are encountered
- ✅ **Update component registry** when adding or modifying components
- ✅ **Keep this playbook synchronized** with all changes

### Code Quality Standards
- Use consistent TypeScript patterns
- Follow Convex best practices (queries for reads, mutations for writes, actions for external APIs)
- Implement proper error handling
- Add authentication checks to protected functions
- Include comprehensive testing

### Testing Requirements
- Test each function in Convex dashboard before integration
- Test frontend components after backend changes
- Verify real-time updates work correctly
- Test error scenarios and edge cases

### Troubleshooting Guide
1. **Check `ERROR_KNOWLEDGE_BASE.md` first** for known solutions
2. **Review MCP reference repositories** for patterns and examples
3. **Check Convex dashboard logs** for detailed error messages
4. **Verify schema matches data structure** for type errors
5. **Confirm auth is properly configured** for authorization issues
6. **Check environment variables** for build and connection issues

### Success Metrics

#### Migration Completion Checklist
- [ ] All 9 backend services migrated to Convex
- [ ] All 13 database tables defined in Convex schema
- [ ] All frontend components using Convex hooks
- [ ] 3 XState machines implemented and integrated
- [ ] Authentication working with BetterAuth
- [ ] All tests passing
- [ ] Documentation fully updated
- [ ] Old Encore code removed
- [ ] Migration log complete

#### Performance Metrics
- [ ] Convex query performance meets requirements
- [ ] Real-time updates working with <100ms latency
- [ ] Page load times improved compared to Encore
- [ ] Memory usage within acceptable limits

---

**Playbook Status**: Active  
**Last Updated**: 2025-10-25  
**Total Phases**: 10  
**Maintainers**: AI Agents working on Encore.dev → Convex migration
