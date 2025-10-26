import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth";

// List all bookings
export const listBookings = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .order("desc")
      .collect();
    
    return { bookings };
  },
});

// Quick book (with availability check)
export const quickBook = mutation({
  args: {
    prospectId: v.optional(v.id("leads")),
    shipId: v.id("ships"),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Check ship availability
    const conflictBookings = await ctx.db
      .query("bookings")
      .withIndex("by_ship_and_time", (q) => 
        q.eq("shipId", args.shipId)
          .gte("startTime", args.startTime)
          .lt("startTime", args.endTime)
      )
      .collect();
    
    if (conflictBookings.length > 0) {
      throw new Error("Ship is not available for the selected time period");
    }
    
    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      orgId: user.orgId,
      createdBy: user._id,
      status: "confirmed",
      createdAt: Date.now(),
    });
    
    return bookingId;
  },
});

// Create booking from quote
export const createBookingFromQuote = mutation({
  args: {
    quoteId: v.id("quotes"),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Get quote
    const quote = await ctx.db.get(args.quoteId);
    if (!quote || quote.orgId !== user.orgId) {
      throw new Error("Quote not found");
    }
    
    // Check ship availability
    const conflictBookings = await ctx.db
      .query("bookings")
      .withIndex("by_ship_and_time", (q) => 
        q.eq("shipId", quote.shipId)
          .gte("startTime", args.startTime)
          .lt("startTime", args.endTime)
      )
      .collect();
    
    if (conflictBookings.length > 0) {
      throw new Error("Ship is not available for the selected time period");
    }
    
    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      quoteId: args.quoteId,
      prospectId: quote.prospectId,
      shipId: quote.shipId,
      startTime: args.startTime,
      endTime: args.endTime,
      orgId: user.orgId,
      createdBy: user._id,
      status: "confirmed",
      createdAt: Date.now(),
    });
    
    return bookingId;
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const { id, status } = args;
    
    const booking = await ctx.db.get(id);
    if (!booking || booking.orgId !== user.orgId) {
      throw new Error("Booking not found");
    }
    
    await ctx.db.patch(id, { status });
    
    return id;
  },
});
