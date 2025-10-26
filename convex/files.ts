import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

// Note: Convex file storage will be added in Phase 9
// For now, just manage file metadata

export const listFiles = query({
  args: {
    ownerType: v.union(v.literal("ship"), v.literal("prospect")),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    const files = await ctx.db
      .query("files")
      .withIndex("by_owner", (q) => 
        q.eq("ownerType", args.ownerType).eq("ownerId", args.ownerId)
      )
      .collect();
    
    return { files };
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    const file = await ctx.db.get(args.fileId);
    if (!file || file.orgId !== user.orgId) {
      throw new Error("File not found");
    }
    
    await ctx.db.delete(args.fileId);
    
    return { success: true };
  },
});

export const setPrimaryFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    const file = await ctx.db.get(args.fileId);
    if (!file || file.orgId !== user.orgId) {
      throw new Error("File not found");
    }
    
    // Unset other primary files for same owner
    const otherFiles = await ctx.db
      .query("files")
      .withIndex("by_owner", (q) => 
        q.eq("ownerType", file.ownerType).eq("ownerId", file.ownerId)
      )
      .collect();
    
    for (const f of otherFiles) {
      if (f.isPrimary) {
        await ctx.db.patch(f._id, { isPrimary: false });
      }
    }
    
    await ctx.db.patch(args.fileId, { isPrimary: true });
    
    return { success: true };
  },
});
