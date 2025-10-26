import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth";

export const listShips = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const ships = await ctx.db
      .query("ships")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .collect();
    
    return { ships };
  },
});

export const createShip = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    hourlyRate: v.number(),
    capacity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    
    const shipId = await ctx.db.insert("ships", {
      ...args,
      orgId: user.orgId,
      images: [],
      status: "available",
      published: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return shipId;
  },
});

export const updateShip = mutation({
  args: {
    id: v.id("ships"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    hourlyRate: v.optional(v.number()),
    capacity: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const { id, ...updates } = args;
    
    const ship = await ctx.db.get(id);
    if (!ship || ship.orgId !== user.orgId) {
      throw new Error("Ship not found");
    }
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

export const updateShipStatus = mutation({
  args: {
    id: v.id("ships"),
    status: v.union(
      v.literal("available"),
      v.literal("booked"),
      v.literal("maintenance"),
      v.literal("offline"),
      v.literal("reserved")
    ),
    statusReason: v.optional(v.string()),
    statusStart: v.optional(v.number()),
    statusEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const { id, ...updates } = args;
    
    const ship = await ctx.db.get(id);
    if (!ship || ship.orgId !== user.orgId) {
      throw new Error("Ship not found");
    }
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});
