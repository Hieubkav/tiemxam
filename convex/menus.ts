import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("menus").collect();
    const filtered =
      args.activeOnly === undefined
        ? items
        : items.filter((item) => item.active === args.activeOnly);
    return filtered.sort((a, b) => a.order - b.order);
  },
});

export const getById = query({
  args: { id: v.id("menus") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    order: v.optional(v.number()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let order = args.order;
    if (order === undefined) {
      const items = await ctx.db.query("menus").collect();
      order = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0;
    }
    return await ctx.db.insert("menus", {
      name: args.name,
      url: args.url,
      order,
      active: args.active,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("menus"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    order: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) patch[key] = value;
    }
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("menus") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
