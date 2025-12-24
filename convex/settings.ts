import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SETTINGS_KEY = "default";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();
  },
});

export const upsert = mutation({
  args: {
    siteName: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    phone: v.optional(v.string()),
    zalo: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("settings", {
      key: SETTINGS_KEY,
      ...args,
      updatedAt: now,
    });
  },
});
