import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .first();
    
    if (!settings) {
      // Create default settings
      const settingsId = await ctx.db.insert("settings", {
        orgId: user.orgId,
        toggles: {
          messaging: false,
          audit: false,
          exports: false,
          invites: false,
          aiAssistant: false,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      return await ctx.db.get(settingsId);
    }
    
    return settings;
  },
});

export const updateSettings = mutation({
  args: {
    toggles: v.optional(v.object({
      messaging: v.optional(v.boolean()),
      audit: v.optional(v.boolean()),
      exports: v.optional(v.boolean()),
      invites: v.optional(v.boolean()),
      aiAssistant: v.optional(v.boolean()),
    })),
    activeAiProviderKeyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .first();
    
    if (!settings) {
      throw new Error("Settings not found");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});
