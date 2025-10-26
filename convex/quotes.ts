import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth";
import { calculateQuote } from "./calculator";

// List all quotes
export const listQuotes = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    
    const quotes = await ctx.db
      .query("quotes")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .order("desc")
      .collect();
    
    return { quotes };
  },
});

// Calculate quote (preview, not saved)
export const calculateQuotePreview = mutation({
  args: {
    shipId: v.id("ships"),
    hours: v.number(),
    people: v.number(),
    services: v.array(
      v.object({
        serviceId: v.id("services"),
        quantity: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Get ship
    const ship = await ctx.db.get(args.shipId);
    if (!ship || ship.orgId !== user.orgId) {
      throw new Error("Ship not found");
    }
    
    // Get services
    const services = await Promise.all(
      args.services.map(async (s) => {
        const service = await ctx.db.get(s.serviceId);
        if (!service || service.orgId !== user.orgId) {
          throw new Error("Service not found");
        }
        return { ...service, quantity: s.quantity };
      })
    );
    
    // Get pricing rules
    const pricingRules = await ctx.db
      .query("pricingRules")
      .withIndex("by_org", (q) => q.eq("orgId", user.orgId))
      .collect();
    
    // Calculate quote
    const calculation = calculateQuote({
      shipId: args.shipId,
      hours: args.hours,
      people: args.people,
      services: args.services,
      pricingRules,
      shipRate: ship.hourlyRate,
      serviceRates: services.map(s => ({ serviceId: s._id, rate: s.unitPrice })),
    });
    
    return calculation;
  },
});

// Save quote
export const saveQuote = mutation({
  args: {
    prospectId: v.optional(v.id("leads")),
    shipId: v.id("ships"),
    hours: v.number(),
    people: v.number(),
    services: v.array(
      v.object({
        serviceId: v.id("services"),
        quantity: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Get ship and services for calculation
    const ship = await ctx.db.get(args.shipId);
    if (!ship || ship.orgId !== user.orgId) {
      throw new Error("Ship not found");
    }

    const servicesData = await Promise.all(
      args.services.map(async (s) => {
        const service = await ctx.db.get(s.serviceId);
        if (!service || service.orgId !== user.orgId) {
          throw new Error("Service not found");
        }
        return service;
      })
    );

    const pricingRules = await ctx.db
      .query("pricingRules")
      .withIndex("by_org_and_published", (q) => 
        q.eq("orgId", user.orgId).eq("published", true)
      )
      .collect();

    // Call calculator function directly
    const calculation = calculateQuote({
      shipId: args.shipId,
      hours: args.hours,
      people: args.people,
      services: args.services,
      pricingRules,
      shipRate: ship.hourlyRate,
      serviceRates: servicesData.map(s => ({ serviceId: s._id, rate: s.unitPrice })),
    });
    
    // Get quote version
    const publishedRules = await ctx.db
      .query("pricingRules")
      .withIndex("by_org_and_published", (q) => 
        q.eq("orgId", user.orgId).eq("published", true)
      )
      .collect();
    
    const version = Math.max(...publishedRules.map(r => r.version || 0), 0);
    
    // Save quote
    const quoteId = await ctx.db.insert("quotes", {
      ...args,
      orgId: user.orgId,
      createdBy: user._id,
      subtotal: calculation.subtotal,
      tax: calculation.tax,
      total: calculation.total,
      publishedConfigVersion: version > 0 ? version : undefined,
      immutableSnapshot: {
        breakdown: calculation,
        appliedRules: calculation.appliedRules,
        shipSnapshot: await ctx.db.get(args.shipId),
        servicesSnapshot: await Promise.all(
          args.services.map(s => ctx.db.get(s.serviceId))
        ),
      },
      createdAt: Date.now(),
    });
    
    return quoteId;
  },
});
