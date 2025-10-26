import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Schema follows Convex best practices from MCP study:
// - camelCase field names (not snake_case)
// - v.number() for timestamps (Unix milliseconds, not Date objects)
// - v.union() with v.literal() for enums
// - v.id("tableName") for foreign keys
// - v.optional() for nullable fields
// - Comprehensive indexes for all common query patterns

export default defineSchema({
  // User Management
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("Admin"), v.literal("Staff")),
    status: v.union(v.literal("Pending"), v.literal("Active"), v.literal("Revoked")),
    orgId: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_org", ["orgId"])
    .index("by_org_and_status", ["orgId", "status"]),

  // CRM - Leads
  leads: defineTable({
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
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("proposal"),
      v.literal("booked"),
      v.literal("lost")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    vesselType: v.string(),
    bookingDate: v.optional(v.string()),
    partySize: v.number(),
    budget: v.number(),
    notes: v.string(),
    responseTime: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_created", ["createdAt"]),

  // Fleet - Ships
  ships: defineTable({
    orgId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    hourlyRate: v.number(),
    capacity: v.number(),
    images: v.array(v.string()),
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
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_and_status", ["orgId", "status"])
    .index("by_org_and_published", ["orgId", "published"]),

  // Fleet - Services
  services: defineTable({
    orgId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    unitPrice: v.number(),
    unitType: v.union(
      v.literal("per_hour"),
      v.literal("per_person"),
      v.literal("flat")
    ),
    defaultQuantity: v.number(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_and_published", ["orgId", "published"]),

  // Quotes - Pricing Rules
  pricingRules: defineTable({
    orgId: v.string(),
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
    version: v.number(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_and_published", ["orgId", "published"])
    .index("by_priority", ["priority"]),

  // Quotes
  quotes: defineTable({
    orgId: v.string(),
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
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    publishedConfigVersion: v.optional(v.number()),
    immutableSnapshot: v.object({
      breakdown: v.array(v.any()),
      appliedRules: v.array(v.any()),
      shipSnapshot: v.any(),
      servicesSnapshot: v.array(v.any()),
    }),
  })
    .index("by_org", ["orgId"])
    .index("by_prospect", ["prospectId"])
    .index("by_created", ["createdAt"]),

  // Bookings
  bookings: defineTable({
    orgId: v.string(),
    quoteId: v.optional(v.id("quotes")),
    shipId: v.id("ships"),
    prospectId: v.optional(v.id("leads")),
    startTime: v.number(),
    endTime: v.number(),
    createdBy: v.id("users"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_ship", ["shipId"])
    .index("by_ship_and_time", ["shipId", "startTime"])
    .index("by_time_range", ["startTime", "endTime"]),

  // Conversations - Threads
  threads: defineTable({
    orgId: v.string(),
    prospectId: v.optional(v.id("leads")),
    sourcePlatform: v.string(),
    chatId: v.string(),
    lastMessageAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_and_platform", ["orgId", "sourcePlatform", "chatId"])
    .index("by_last_message", ["lastMessageAt"]),

  // Conversations - Messages
  threadMessages: defineTable({
    threadId: v.id("threads"),
    message: v.string(),
    senderType: v.union(
      v.literal("prospect"),
      v.literal("agent"),
      v.literal("ai")
    ),
    senderId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_timestamp", ["timestamp"]),

  // Settings
  settings: defineTable({
    orgId: v.string(),
    toggles: v.object({
      messaging: v.optional(v.boolean()),
      audit: v.optional(v.boolean()),
      exports: v.optional(v.boolean()),
      invites: v.optional(v.boolean()),
      aiAssistant: v.optional(v.boolean()),
    }),
    activeAiProviderKeyName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_org", ["orgId"]),

  // Files
  files: defineTable({
    orgId: v.string(),
    ownerType: v.union(v.literal("ship"), v.literal("prospect")),
    ownerId: v.string(),
    filename: v.string(),
    contentType: v.string(),
    sizeBytes: v.number(),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
    isPublic: v.boolean(),
    isPrimary: v.boolean(),
  })
    .index("by_org", ["orgId"])
    .index("by_owner", ["ownerType", "ownerId"])
    .index("by_uploaded", ["uploadedAt"]),

  // Audit Logs
  auditLogs: defineTable({
    orgId: v.string(),
    userId: v.optional(v.id("users")),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_entity", ["entityType", "entityId"]),

  // AI Providers
  aiProviders: defineTable({
    orgId: v.string(),
    keyName: v.string(),
    providerType: v.string(),
    config: v.any(),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_and_key", ["orgId", "keyName"]),

  // AI Usage
  aiUsage: defineTable({
    orgId: v.string(),
    userId: v.id("users"),
    providerKeyName: v.string(),
    contextType: v.optional(v.string()),
    contextId: v.optional(v.string()),
    prompt: v.string(),
    response: v.string(),
    confidence: v.optional(v.number()),
    sources: v.optional(v.array(v.string())),
    timestamp: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_user_and_month", ["userId", "timestamp"]),
});
