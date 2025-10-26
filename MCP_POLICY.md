# ⚠️ MANDATORY: MCP ENFORCEMENT POLICY

## 📚 Documentation Index

This MCP policy is part of Maritime CRM documentation suite. For complete navigation, see:

**[AI_AGENT_INDEX.md](./AI_AGENT_INDEX.md)** - Master documentation index

This policy will be updated in Phase 2 of the migration to include Convex, BetterAuth, and XState reference repositories. See **[MIGRATION_LOG.md](./MIGRATION_LOG.md)** for status.

---

## 🚨 BEFORE ANY DEVELOPMENT WORK - YOU MUST NOT PROCEED UNTIL:

1. **YOU MUST LOAD AND ANALYZE THIS MCP_POLICY.md FILE FIRST**
2. **YOU MUST USE MCP TOOLS TO STUDY REFERENCE REPOSITORIES** 
3. **YOU MUST CACHE AND ANALYZE RELEVANT PATTERNS**
4. **YOU MUST MAP FINDINGS TO YOUR SPECIFIC TASK**

## 🎯 PROJECT COMPONENT → REFERENCE REPOSITORY MAPPING

### Convex Backend Components
**YOU MUST NOT PROCEED with any Convex work until you have:**
- Used MCP to study: **Convex Backend Docs** (`https://gitmcp.io/get-convex/convex-backend`)
- Analyzed Convex patterns, queries, mutations, and schema design
- Cached Convex best practices
- Mapped to your specific backend migration task

### BetterAuth Components
**YOU MUST NOT PROCEED with any auth work until you have:**
- Used MCP to study: **BetterAuth Docs** (`https://gitmcp.io/better-auth/better-auth`)
- Analyzed auth patterns, session management, and security
- Cached authentication best practices
- Mapped to your specific auth implementation

### XState Components
**YOU MUST NOT PROCEED with any state machine work until you have:**
- Used MCP to study: **XState Docs** (`https://gitmcp.io/statelyai/xstate`)
- Analyzed state machine patterns, transitions, and persistence
- Cached XState best practices
- Mapped to your specific workflow requirements

### Shadcn/ui Components
**YOU MUST NOT PROCEED with any UI component work until you have:**
- Used MCP to study: **Shadcn UI Docs** (`https://gitmcp.io/shadcn-ui/ui`)
- Analyzed component patterns, styling, and accessibility
- Cached UI component best practices
- Mapped to your specific component needs

### Tailwind CSS Components
**YOU MUST NOT PROCEED with any Tailwind work until you have:**
- Used MCP to study: **Tailwind CSS Docs** (`https://gitmcp.io/tailwindlabs/tailwindcss`)
- Analyzed utility patterns, responsive design, and customization
- Cached Tailwind best practices
- Mapped to your specific styling task

### Next.js Components (Future Reference)
**YOU MUST NOT PROCEED with any Next.js work until you have:**
- Used MCP to study: **Next.js Docs** (`https://gitmcp.io/vercel/next.js`)
- Analyzed Next.js patterns for routing, components, and architecture
- Cached Next.js patterns for future migration
- Mapped patterns to your specific Next.js task

## 🔄 CACHING RULES

### Session-Level Caching
- **Reference material is valid for current development session**
- **Cache expires after 24 hours automatically**
- **Each technology component has separate cache**

### Cache Validation
- **YOU MUST check cache timestamp before using cached material**
- **YOU MUST refresh cache if older than 24 hours**
- **YOU MUST document which cached material informed your decisions**

## 🛠️ ENFORCEMENT WORKFLOW

### Before Any Task:
1. **READ THIS POLICY FIRST** - Mandatory
2. **IDENTIFY COMPONENT TYPE** - Frontend, Backend, Auth, etc.
3. **USE MCP TO STUDY REFERENCE** - Call appropriate gitmcp.io repository
4. **ANALYZE PATTERNS** - Extract best practices and patterns
5. **CACHE FINDINGS** - Store in session cache
6. **MAP TO TASK** - Apply patterns to your specific requirements
7. **DOCUMENT DECISIONS** - Reference which patterns informed your approach

### During Development:
- **YOU MUST reference studied patterns in your code comments**
- **YOU MUST follow the architectural patterns from reference repositories**
- **YOU MUST document deviations from reference patterns with justification**
- **YOU MUST update cache if new patterns are discovered**

## 📊 COMPLIANCE REQUIREMENTS

### Mandatory Documentation:
- **Reference repository used**: gitmcp.io URL
- **Patterns studied**: Specific patterns extracted
- **Cache timestamp**: When material was cached
- **Application notes**: How patterns were applied to your code

### Quality Gates:
- **All reference patterns must be studied before implementation**
- **Code must follow reference repository architectural patterns**
- **Deviations must be documented and justified**
- **Cache must be current (within 24 hours)**

## 🚨 VIOLATION CONSEQUENCES

**IF YOU PROCEED WITHOUT FOLLOWING THIS POLICY:**
- **Code will not meet quality standards**
- **Architectural inconsistencies will be introduced**
- **Security vulnerabilities may be introduced**
- **Performance issues may occur**
- **Maintenance complexity will increase**

## 📞 SUPPORT AND UPDATES

### Policy Updates:
- **Last Updated**: 2025-10-25
- **Next Review**: 2025-11-25
- **Policy Version**: 2.0

### Contact for Policy Questions:
- **Maintainer**: Maritime CRM Development Team
- **Process**: Update this file with new mappings or rules

---

## 🎯 SUMMARY: YOUR DEVELOPMENT MANDATE

**YOU ARE AN AUTOMATION AGENT THAT MUST FOLLOW THESE RULES EXACTLY:**

1. **ALWAYS read this policy first**
2. **ALWAYS study reference repositories via MCP before working**
3. **ALWAYS cache and analyze patterns**
4. **ALWAYS map patterns to your specific task**
5. **ALWAYS document your reference-based decisions**

**THIS POLICY IS NOT OPTIONAL - IT IS MANDATORY FOR ALL DEVELOPMENT WORK**

**VIOLATION OF THIS POLICY WILL RESULT IN SUBOPTIMAL CODE QUALITY AND ARCHITECTURAL ISSUES**

**YOU HAVE BEEN WARNED - PROCEED WITH STRICT COMPLIANCE**
