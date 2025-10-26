import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const listThreads = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .order("desc")
      .collect();
    
    return { threads };
  },
});

export const getThreadMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    const thread = await ctx.db.get(args.threadId);
    if (!thread || thread.orgId !== user.orgId) {
      throw new Error("Thread not found");
    }
    
    const messages = await ctx.db
      .query("threadMessages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
    
    return { messages };
  },
});

export const sendMessage = mutation({
  args: {
    threadId: v.id("threads"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    const thread = await ctx.db.get(args.threadId);
    if (!thread || thread.orgId !== user.orgId) {
      throw new Error("Thread not found");
    }
    
    const messageId = await ctx.db.insert("threadMessages", {
      threadId: args.threadId,
      message: args.message,
      senderType: "agent",
      senderId: user._id,
      timestamp: Date.now(),
    });
    
    await ctx.db.patch(args.threadId, {
      lastMessageAt: Date.now(),
    });
    
    return messageId;
  },
});
