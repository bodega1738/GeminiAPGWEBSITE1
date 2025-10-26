import { query, action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";
import { api } from "./_generated/api";

// Query AI assistant (placeholder for now)
export const queryAssistant = action({
  args: {
    prompt: v.string(),
    contextType: v.optional(v.string()),
    contextId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    // Placeholder response (no API key needed)
    const answer = `Simulated AI response to: "${args.prompt}". This is a placeholder. Real OpenAI integration will be added when API key is configured in Phase 10.`;
    
    // Log usage
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (user) {
      await ctx.runMutation(api.ai.logUsage, {
        prompt: args.prompt,
        response: answer,
      });
    }
    
    return {
      answer,
      sources: ["Simulated response"],
      confidence: 0.85,
    };
  },
});

// Get usage stats
export const getUsageStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        queriesThisMonth: 0,
        queriesLimit: 100,
        queriesRemaining: 100,
      };
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    
    if (!user) {
      return {
        queriesThisMonth: 0,
        queriesLimit: 100,
        queriesRemaining: 100,
      };
    }
    
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    
    const usageRecords = await ctx.db
      .query("aiUsage")
      .withIndex("by_user_and_month", (q) => 
        q.eq("userId", user._id).gte("timestamp", monthStart)
      )
      .collect();
    
    return {
      queriesThisMonth: usageRecords.length,
      queriesLimit: 100,
      queriesRemaining: Math.max(0, 100 - usageRecords.length),
    };
  },
});

// Log usage (internal)
export const logUsage = mutation({
  args: {
    prompt: v.string(),
    response: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    
    if (!user) return;
    
    await ctx.db.insert("aiUsage", {
      orgId: user.orgId,
      userId: user._id,
      providerKeyName: "openai-placeholder",
      prompt: args.prompt,
      response: args.response,
      confidence: 0.85,
      sources: [],
      timestamp: Date.now(),
    });
  },
});
