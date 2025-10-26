# 🚨 Maritime CRM - Error Knowledge Base

## Knowledge Base Purpose

This document captures all errors, issues, and solutions encountered during the Encore.dev → Convex migration. It serves as a comprehensive troubleshooting guide for future AI agents and developers to prevent encountering the same problems repeatedly.

---

## Error Categories

- **Migration Errors**: Issues during Encore.dev → Convex migration
- **Convex Errors**: Convex-specific issues and limitations
- **BetterAuth Errors**: Authentication and authorization problems
- **XState Errors**: State machine implementation issues
- **Frontend Errors**: React, Vite, and build problems
- **Build Errors**: Compilation, bundling, and deployment issues
- **Runtime Errors**: Production environment problems

---

## Pre-populated Common Errors

### ERROR-001: Encore API Decorator Not Found

**Category**: Migration  
**Severity**: High  
**First Encountered**: 2025-10-25  
**Frequency**: Common during initial migration

**Error Message**:
```
Cannot find name 'api' from 'encore.dev/api'
```

**Context**:
- Trying to use Encore patterns in Convex environment
- migrating Encore backend services to Convex
- Phase 6+ of migration when converting service code

**Root Cause**:
Encore's `api()` decorator doesn't exist in Convex. This is a fundamental pattern difference between the two frameworks.

**Solution**:
```typescript
// Before (Encore)
import { api } from 'encore.dev/api';

export const getLeads = api(
  { method: "GET", path: "/crm/leads", expose: true },
  async (): Promise<Lead[]> => {
    // implementation
  }
);

// After (Convex)
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('leads').collect();
  }
});
```

**Prevention**:
- Always import from `convex/server`, not `encore.dev/api`
- Study Convex patterns before migrating service code
- Use `query()`, `mutation()`, and `action()` instead of `api()`

**Related Errors**: ERROR-002, ERROR-006  
**References**: [Convex Functions Documentation](https://docs.convex.dev/functions)

---

### ERROR-002: PostgreSQL Query Syntax in Convex

**Category**: Migration  
**Severity**: High  
**First Encountered**: 2025-10-25  
**Frequency**: Common during database migration

**Error Message**:
```
db.queryAll is not a function
```

**Context**:
- Trying to use Encore's database client in Convex functions
- migrating SQL queries to Convex
- Phase 5-6 of migration when converting database access

**Root Cause**:
Encore uses SQL queries with `db.queryAll()` while Convex uses a completely different query API with method chaining.

**Solution**:
```typescript
// Before (Encore)
import { db } from '../db';

export const getActiveLeads = api(
  { method: "GET", path: "/crm/leads/active", expose: true },
  async (): Promise<Lead[]> => {
    return await db.queryAll<Lead[]>(
      'SELECT * FROM leads WHERE status = $1',
      ['active']
    );
  }
);

// After (Convex)
export const getActiveLeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('leads')
      .filter(q => q.eq(q.field('status'), 'active'))
      .collect();
  }
});
```

**Prevention**:
- Review Convex query patterns before migrating database code
- Use `.filter()`, `.order()`, `.collect()` instead of SQL
- Replace SQL WHERE clauses with Convex filter methods

**Related Errors**: ERROR-001, ERROR-006  
**References**: [Convex Database Queries](https://docs.convex.dev/database)

---

### ERROR-003: Auth Middleware Not Applied

**Category**: BetterAuth  
**Severity**: Critical  
**First Encountered**: 2025-10-25  
**Frequency**: Common during auth migration

**Error Message**:
```
Unauthorized access - no auth data found
```

**Context**:
- Protected Convex function not checking authentication
- Phase 4 of migration when implementing auth
- Testing authenticated endpoints

**Root Cause**:
Forgot to add authentication check in Convex function, leaving it publicly accessible.

**Solution**:
```typescript
import { mutation, query } from './_generated/server';

// Create auth middleware helper
const requireAuth = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthorized');
  }
  return identity;
};

// Use in protected functions
export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    // Now you have authenticated user info
    return await ctx.db.insert('leads', {
      ...args,
      created_by: identity.tokenIdentifier,
      created_at: Date.now()
    });
  }
});
```

**Prevention**:
- Always check auth in protected functions
- Create reusable auth middleware helpers
- Test auth flows early in migration

**Related Errors**: ERROR-003, ERROR-007  
**References**: [BetterAuth Documentation](https://www.better-auth.com/docs)

---

### ERROR-004: XState Machine Not Persisting State

**Category**: XState  
**Severity**: Medium  
**First Encountered**: 2025-10-25  
**Frequency**: Common during state machine integration

**Error Message**:
```
State machine resets on page refresh
```

**Context**:
- XState machine state not saved to database
- Phase 8 of migration when implementing workflows
- Testing state persistence

**Root Cause**:
State machine only exists in memory, not persisted to Convex database. Page refresh loses all state.

**Solution**:
```typescript
// In convex/machines/bookingMachine.ts
import { createMachine, assign } from 'xstate';
import { mutation } from '../_generated/server';

// Machine with persistence
export const bookingMachine = createMachine({
  id: 'booking',
  initial: 'idle',
  context: {
    bookingId: null,
    state: null
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
          target: 'confirmed',
          actions: assign({
            state: 'confirmed'
          })
        },
        onError: {
          target: 'conflict_detected',
          actions: assign({
            state: 'conflict'
          })
        }
      }
    }
  }
});

// Persist state to Convex
export const persistBookingState = mutation({
  args: {
    bookingId: v.id('bookings'),
    state: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch('bookings', args.bookingId, {
      state: args.state,
      state_updated_at: Date.now()
    });
  }
});
```

**Prevention**:
- Always persist state machine state to database
- Restore state on machine initialization
- Use state field in relevant Convex tables

**Related Errors**: ERROR-008  
**References**: [XState Documentation](https://xstate.js.org/docs)

---

### ERROR-005: Convex Function Timeout

**Category**: Convex  
**Severity**: High  
**First Encountered**: 2025-10-25  
**Frequency**: Common with external API calls

**Error Message**:
```
Function execution timed out after 60s
```

**Context**:
- Long-running operation in Convex function
- External API calls or complex calculations
- Usually during AI assistant or quote calculation

**Root Cause**:
Convex functions have 60-second timeout limit. Long operations exceed this limit.

**Solution**:
```typescript
// Use actions for long-running operations
import { action } from './_generated/server';

export const calculateComplexQuote = action({
  args: {
    shipId: v.id('ships'),
    duration: v.number()
  },
  handler: async (ctx, args) => {
    // Use external APIs or complex calculations here
    const result = await fetchExternalPricingAPI(args);
    
    // Save to database via separate mutation
    await ctx.scheduler.runAfter(0, mutation, {
      quoteData: result
    });
    
    return result;
  }
});

// Keep mutations for database operations only
export const saveQuote = mutation({
  args: {
    quoteData: v.any()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('quotes', args.quoteData);
  }
});
```

**Prevention**:
- Use actions for external API calls
- Use mutations for database operations only
- Break complex operations into smaller steps

**Related Errors**: ERROR-007, ERROR-008  
**References**: [Convex Actions](https://docs.convex.dev/functions/actions)

---

### ERROR-006: Type Mismatch in Convex Schema

**Category**: Convex  
**Severity**: Medium  
**First Encountered**: 2025-10-25  
**Frequency**: Common during schema definition

**Error Message**:
```
Type 'string' is not assignable to type 'number'
```

**Context**:
- Inserting data that doesn't match schema definition
- Phase 5 of migration when defining schema
- Data migration or testing

**Root Cause**:
Schema definition doesn't match the data structure being inserted.

**Solution**:
```typescript
// Define schema properly
import { defineTable, v } from 'convex/server';

export default defineTable({
  leads: {
    name: v.string(),
    status: v.union(v.literal('new'), v.literal('contacted'), v.literal('qualified')),
    priority: v.number(), // Must be number, not string
    created_at: v.number() // Unix timestamp
  }
});

// Correct insertion
export const createLead = mutation({
  args: {
    name: v.string(),
    status: v.string(),
    priority: v.number() // Pass number, not string
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('leads', {
      ...args,
      created_at: Date.now()
    });
  }
});
```

**Prevention**:
- Define schema first, validate data before insertion
- Use proper TypeScript types in function arguments
- Test schema validation early

**Related Errors**: ERROR-001, ERROR-002  
**References**: [Convex Schema](https://docs.convex.dev/database/schema)

---

### ERROR-007: Missing Environment Variables

**Category**: Build  
**Severity**: High  
**First Encountered**: 2025-10-25  
**Frequency**: Common during frontend setup

**Error Message**:
```
CONVEX_URL is not defined
```

**Context**:
- Running frontend without Convex configuration
- Phase 9 of migration when updating frontend
- Development environment setup

**Root Cause**:
Environment variables not set up for Convex integration.

**Solution**:
```bash
# Run Convex dev first
npx convex dev

# This generates .env.local with:
# CONVEX_DEPLOYMENT=dev
# CONVEX_URL=http://localhost:3210
```

```typescript
// In frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite will replace this with the actual value
    'import.meta.env.CONVEX_URL': JSON.stringify(process.env.CONVEX_URL)
  }
});
```

**Prevention**:
- Always run `npx convex dev` before starting frontend
- Check environment variables are set
- Include Convex setup in development instructions

**Related Errors**: ERROR-003, ERROR-005  
**References**: [Convex Development](https://docs.convex.dev/get-started)

### ERROR-009: BetterAuth Package Installation Failed

**Category**: Build  
**Severity**: High  
**First Encountered**: 2025-10-25  
**Frequency**: Common during Phase 4 auth migration

**Error Message**:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, 
open '/home/user/maritime-crm-dashboard/@convex-dev/better-auth/convex-adapter/package.json'
```

**Context**:
- Installing BetterAuth for Convex integration
- Phase 4 of migration
- Incorrect package name used

**Root Cause**:
Used incorrect package name `@convex-dev/better-auth/convex-adapter`. The correct package is `@convex-dev/better-auth` (no `/convex-adapter` suffix).

**Solution**:
```bash
# Correct installation
npm install convex@latest
npm install @convex-dev/better-auth
npm install better-auth@1.3.27 --save-exact
```

**Required Files**:
1. `convex/convex.config.ts` - Register Better Auth component
2. `convex/auth.config.ts` - Configure auth providers

**Prevention**:
- Always verify package names on npmjs.com before installing
- Use official documentation for package names
- Check Convex version is 1.25.0 or higher

**Related Errors**: ERROR-007  
**References**: 
- https://www.npmjs.com/package/@convex-dev/better-auth
- https://convex-better-auth.netlify.app/framework-guides/react

### ERROR-010: Attempted to Install Wrong TypeScript Package

**Category**: Build  
**Severity**: Critical  
**First Encountered**: 2025-10-26  

**Error Message**:
```
Need to install the following packages: tsc@2.0.4
```

**Context**:
- Running `npx tsc` without TypeScript installed
- Phase 4 of migration when testing TypeScript compilation
- MCP servers were available but alternative approach was attempted

**Root Cause**:
Running `npx tsc` without TypeScript installed. npx tries to install a package called `tsc` which is NOT the official TypeScript compiler.

**Solution**:
- Press 'n' to cancel package installation
- Use `npx convex dev` instead (has built-in type checking)
- Or install real TypeScript: `npm install --save-dev typescript`

**Prevention**:
- Never install packages named `tsc`
- Use `typescript` package for TypeScript compiler
- Let Convex dev handle type checking automatically
- Convex has built-in TypeScript checking - no need for external compiler

**Related Errors**: ERROR-007  
**References**: 
- https://www.typescriptlang.org/docs/
- https://docs.convex.dev/get-started

---

### ERROR-008: Circular Dependency in Convex Functions

**Category**: Convex  
**Severity**: Medium  
**First Encountered**: 2025-10-25  
**Frequency**: Common in complex service migrations

**Error Message**:
```
Circular dependency detected
```

**Context**:
- Convex function A imports function B which imports A
- Complex service interactions during migration
- Phase 6+ of migration

**Root Cause**:
Poor module organization with circular imports between functions.

**Solution**:
```typescript
// Problem: circular dependency
// convex/leads.ts imports from convex/bookings.ts
// convex/bookings.ts imports from convex/leads.ts

// Solution: Extract shared logic
// convex/utils/validation.ts
export const validateLeadData = (data: any) => {
  // Shared validation logic
};

// convex/leads.ts
import { validateLeadData } from './utils/validation';
export const createLead = mutation({
  // Implementation
});

// convex/bookings.ts
import { validateLeadData } from './utils/validation';
export const createBooking = mutation({
  // Implementation without importing leads functions
});
```

**Prevention**:
- Keep functions independent and single-purpose
- Use shared utilities for common logic
- Plan module organization before coding

**Related Errors**: ERROR-005, ERROR-006  
**References**: [Convex Best Practices](https://docs.convex.dev/best-practices)

---

## Migration-Specific Issues

### Issue: Dynamic SQL Query Construction

**Problem**: Encore allows dynamic SQL query building, Convex doesn't support this pattern.

**Solution**: Use Convex's filter and map methods instead:
```typescript
// Before (Encore)
const query = `SELECT * FROM leads WHERE ${field} = $1`;
return await db.queryAll(query, [value]);

// After (Convex)
const leadsQuery = ctx.db.query('leads');
switch (field) {
  case 'status':
    return leadsQuery.filter(q => q.eq(q.field('status'), value)).collect();
  case 'assigned_to':
    return leadsQuery.filter(q => q.eq(q.field('assigned_to'), value)).collect();
  default:
    throw new Error('Invalid filter field');
}
```

### Issue: Encore Secrets vs Convex Environment Variables

**Problem**: Different secret management systems between Encore and Convex.

**Solution**: Migrate secrets to Convex dashboard environment variables:
```typescript
// Encore
const apiKey = secret('API_KEY');

// Convex
const apiKey = process.env.API_KEY;
```

### Issue: Encore's getAuthData() vs Convex's ctx.auth

**Problem**: Different authentication patterns and APIs.

**Solution**: Replace Encore auth patterns with Convex auth:
```typescript
// Encore
const auth = getAuthData<AuthData>()!;
const userId = auth.userId;

// Convex
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error('Unauthorized');
const userId = identity.tokenIdentifier;
```

---

## Debugging Checklist

When encountering unknown errors, follow this systematic approach:

1. **Check Convex Dashboard Logs**
   - Look for detailed error messages and stack traces
   - Check function execution times and failures

2. **Verify Schema Matches Data Structure**
   - Ensure data types match schema definitions
   - Check for required vs optional field mismatches

3. **Confirm Auth is Properly Configured**
   - Verify BetterAuth setup in Convex
   - Check user identity is being passed correctly

4. **Check Environment Variables**
   - Ensure CONVEX_URL is set
   - Verify all required environment variables exist

5. **Review Recent Code Changes**
   - Look for recent modifications that could cause issues
   - Check for import/export problems

6. **Search This Knowledge Base**
   - Look for similar errors and solutions
   - Check frequency and related errors

7. **Check Convex Documentation**
   - Refer to official docs for pattern examples
   - Look for best practices and limitations

8. **Check MCP Reference Repositories**
   - Search Convex, BetterAuth, XState repos
   - Look for similar implementations

---

## Quick Reference: Error Codes

| Error Code | Common Cause | Quick Fix |
|------------|--------------|-----------|
| **401 Unauthorized** | Auth not configured or token invalid | Check BetterAuth setup, verify user login |
| **403 Forbidden** | User lacks required role/permissions | Implement role checks, verify user permissions |
| **404 Not Found** | Document doesn't exist in Convex table | Verify document ID, check table name |
| **409 Conflict** | Booking overlap or constraint violation | Implement conflict detection, validate data |
| **500 Internal Error** | Unhandled exception in Convex function | Add error handling, check function logic |
| **Timeout** | Function exceeded 60s limit | Use actions for long operations |
| **Type Error** | Schema/data mismatch | Update schema or fix data types |
| **Import Error** | Wrong import paths or missing modules | Verify imports, check file structure |

---

## Resources and Links

- **Convex Documentation**: https://docs.convex.dev
- **BetterAuth Documentation**: https://www.better-auth.com/docs
- **XState Documentation**: https://xstate.js.org/docs
- **Convex Discord**: https://convex.dev/community
- **MCP Reference Repositories**: See `AI_AGENT_INDEX.md`
- **Migration Log**: `MIGRATION_LOG.md` for current status
- **Architecture Decisions**: `ARCHITECTURE_DECISIONS.md` for context

---

## Contributing to This Knowledge Base

AI agents working on migration must follow these guidelines:

- **Add New Errors**: Document any new errors encountered
- **Use ERROR-XXX Format**: Continue numbering from last entry (ERROR-008)
- **Include Full Context**: Error messages, stack traces, what you were doing
- **Document Working Solutions**: Provide actual code that fixes the issue
- **Add Prevention Tips**: Help future agents avoid the same problem
- **Link Related Errors**: Cross-reference similar issues
- **Update Frequency**: Mark if error recurs multiple times

**Template for New Entries**:
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

---

**Knowledge Base Status**: Active  
**Last Updated**: 2025-10-25  
**Total Errors Documented**: 8  
**Next Update**: When new errors are encountered during migration  
**Maintainers**: AI Agents working on Encore.dev → Convex migration
