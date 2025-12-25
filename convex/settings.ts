import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();

    if (existing) {
      // Cleanup old logo if changed
      if (args.logoStorageId !== undefined && existing.logoStorageId && args.logoStorageId !== existing.logoStorageId) {
        try {
          await ctx.storage.delete(existing.logoStorageId as Id<"_storage">);
        } catch {}
      }
      // Cleanup old favicon if changed
      if (args.faviconStorageId !== undefined && existing.faviconStorageId && args.faviconStorageId !== existing.faviconStorageId) {
        try {
          await ctx.storage.delete(existing.faviconStorageId as Id<"_storage">);
        } catch {}
      }
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
