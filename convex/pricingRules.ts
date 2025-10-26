import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth";

// List all pricing rules
export const listPricingRules = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const pricingRules = await ctx.db
      .query("pricingRules")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .collect();
    
    return { pricingRules };
  },
});

// Create pricing rule
export const createPricingRule = mutation({
  args: {
    name: v.string(),
    condition: v.object({
      field: v.string(),
      operator: v.string(),
      value: v.number(),
    }),
    action: v.object({
      type: v.string(),
      value: v.number(),
    }),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    
    const ruleId = await ctx.db.insert("pricingRules", {
      ...args,
      orgId: user.orgId,
      version: 1,
      published: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return ruleId;
  },
});

// Update pricing rule
export const updatePricingRule = mutation({
  args: {
    id: v.id("pricingRules"),
    name: v.optional(v.string()),
    condition: v.optional(v.object({
      field: v.string(),
      operator: v.string(),
      value: v.number(),
    })),
    action: v.optional(v.object({
      type: v.string(),
      value: v.number(),
    })),
    priority: v.optional(v.number()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const { id, ...updates } = args;
    
    const rule = await ctx.db.get(id);
    if (!rule || rule.orgId !== user.orgId) {
      throw new Error("Pricing rule not found");
    }
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});
