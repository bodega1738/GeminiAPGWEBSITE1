import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db
      .query("leads")
      .order("desc")
      .collect();
    
    return { leads };
  },
});

export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    source: v.union(
      v.literal("facebook"),
      v.literal("instagram"),
      v.literal("whatsapp"),
      v.literal("website"),
      v.literal("referral")
    ),
    vesselType: v.string(),
    bookingDate: v.optional(v.string()),
    partySize: v.number(),
    budget: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      ...args,
      notes: args.notes || "",
      status: "new",
      priority: "medium",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return leadId;
  },
});

export const updateLead = mutation({
  args: {
    id: v.id("leads"),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("proposal"),
      v.literal("booked"),
      v.literal("lost")
    )),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    vesselType: v.optional(v.string()),
    bookingDate: v.optional(v.string()),
    partySize: v.optional(v.number()),
    budget: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

export const getDashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    const allLeads = await ctx.db.query("leads").collect();
    
    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter(l => l.status === "new").length;
    const qualifiedLeads = allLeads.filter(l => l.status === "qualified").length;
    const bookedLeads = allLeads.filter(l => l.status === "booked").length;
    const proposalLeads = allLeads.filter(l => l.status === "proposal").length;
    
    const conversionRate = totalLeads > 0 
      ? Math.round((bookedLeads / totalLeads) * 100 * 100) / 100
      : 0;
    
    const avgResponseTime = allLeads
      .filter(l => l.responseTime)
      .reduce((sum, l) => sum + (l.responseTime || 0), 0) / (allLeads.filter(l => l.responseTime).length || 1);
    
    const totalRevenue = allLeads
      .filter(l => l.status === "booked")
      .reduce((sum, l) => sum + l.budget, 0);
    
    return {
      total_leads: totalLeads,
      new_leads: newLeads,
      qualified_leads: qualifiedLeads,
      conversion_rate: conversionRate,
      avg_response_time: Math.round(avgResponseTime),
      total_revenue: totalRevenue,
      pending_proposals: proposalLeads,
    };
  },
});
