import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth";

// List all services
export const listServices = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const services = await ctx.db
      .query("services")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .order("asc")
      .collect();
    
    return { services };
  },
});

// Create service
export const createService = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    unitPrice: v.number(),
    unitType: v.union(
      v.literal("per_hour"),
      v.literal("per_person"),
      v.literal("flat")
    ),
    defaultQuantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    
    const serviceId = await ctx.db.insert("services", {
      ...args,
      orgId: user.orgId,
      defaultQuantity: args.defaultQuantity || 1,
      published: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return serviceId;
  },
});

// Update service
export const updateService = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    unitPrice: v.optional(v.number()),
    unitType: v.optional(v.union(
      v.literal("per_hour"),
      v.literal("per_person"),
      v.literal("flat")
    )),
    defaultQuantity: v.optional(v.number()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const { id, ...updates } = args;
    
    const service = await ctx.db.get(id);
    if (!service || service.orgId !== user.orgId) {
      throw new Error("Service not found");
    }
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});
