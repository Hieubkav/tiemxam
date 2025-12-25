import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  home_components: defineTable({
    name: v.string(),
    type: v.string(),
    active: v.boolean(),
    order: v.number(),
    config: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_active", ["active"]),
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    thumbnail: v.optional(v.string()),
    active: v.boolean(),
    contentStorageIds: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["active"])
    .index("by_updatedAt", ["updatedAt"]),
  visitors: defineTable({
    visitorId: v.string(),
    firstSeen: v.number(),
    lastSeen: v.number(),
    visitCount: v.number(),
  }).index("by_visitorId", ["visitorId"]),
  visits: defineTable({
    visitorId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    path: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_visitorId", ["visitorId"]),
  settings: defineTable({
    key: v.string(),
    siteName: v.optional(v.string()),
    logoStorageId: v.optional(v.string()),
    faviconStorageId: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    primaryColor: v.optional(v.string()),
    phone: v.optional(v.string()),
    zalo: v.optional(v.string()),
    facebook: v.optional(v.string()),
    address: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("staff")),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_active", ["active"]),
  menus: defineTable({
    name: v.string(),
    url: v.string(),
    order: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_active", ["active"]),
});
