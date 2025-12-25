import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("posts").collect();
    const filtered =
      args.activeOnly === undefined ? items : items.filter((item) => item.active === args.activeOnly);
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    thumbnail: v.optional(v.string()),
    active: v.boolean(),
    contentStorageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error("Slug already exists");
    }
    const now = Date.now();
    return await ctx.db.insert("posts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      thumbnail: args.thumbnail,
      active: args.active,
      contentStorageIds: args.contentStorageIds,
      createdAt: now,
      updatedAt: now,
      publishedAt: args.active ? now : undefined,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    active: v.optional(v.boolean()),
    contentStorageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, contentStorageIds, ...rest } = args;
    const doc = await ctx.db.get(id);
    if (!doc) {
      throw new Error("Post not found");
    }
    if (rest.slug !== undefined && rest.slug !== doc.slug) {
      const existing = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", rest.slug as string))
        .first();
      if (existing && existing._id !== id) {
        throw new Error("Slug already exists");
      }
    }

    // Cleanup removed images
    if (contentStorageIds !== undefined) {
      const oldIds = doc.contentStorageIds ?? [];
      const newIds = new Set(contentStorageIds);
      const removedIds = oldIds.filter((id) => !newIds.has(id));
      for (const storageId of removedIds) {
        try {
          await ctx.storage.delete(storageId as Id<"_storage">);
        } catch {
          // File may already be deleted
        }
      }
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) patch[key] = value;
    }
    if (contentStorageIds !== undefined) {
      patch.contentStorageIds = contentStorageIds;
    }
    if (rest.active === true && !doc.publishedAt) {
      patch.publishedAt = Date.now();
    }
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (doc?.contentStorageIds) {
      for (const storageId of doc.contentStorageIds) {
        try {
          await ctx.storage.delete(storageId as Id<"_storage">);
        } catch {
          // File may already be deleted
        }
      }
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});
