import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("home_components").collect();
    const filtered =
      args.activeOnly === undefined ? items : items.filter((item) => item.active === args.activeOnly);
    return filtered.sort((a, b) => a.order - b.order);
  },
});

export const getById = query({
  args: { id: v.id("home_components") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    active: v.boolean(),
    order: v.optional(v.number()),
    config: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let order = args.order;
    if (order === undefined) {
      const items = await ctx.db.query("home_components").collect();
      const maxOrder = items.reduce((max, item) => Math.max(max, item.order), 0);
      order = maxOrder + 1;
    }
    return await ctx.db.insert("home_components", {
      name: args.name,
      type: args.type,
      active: args.active,
      order,
      config: args.config,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("home_components"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    active: v.optional(v.boolean()),
    order: v.optional(v.number()),
    config: v.optional(v.string()),
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
  args: { id: v.id("home_components") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
