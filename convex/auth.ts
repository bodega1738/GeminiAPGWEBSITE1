import { query, QueryCtx, MutationCtx } from "./_generated/server";

// Simple auth using Convex built-in (BetterAuth UI will be added in Phase 9)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    
    return user;
  },
});

export const requireAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .first();
    
  if (!user || user.status !== "Active") {
    throw new Error("User not active");
  }
  
  return user;
};

export const requireAdmin = async (ctx: QueryCtx | MutationCtx) => {
  const user = await requireAuth(ctx);
  if (user.role !== "Admin") {
    throw new Error("Admin access required");
  }
  return user;
};
