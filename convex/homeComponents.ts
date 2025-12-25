import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper để lấy tất cả storageIds từ config
function extractStorageIds(config: string | undefined): Id<"_storage">[] {
  if (!config) return [];
  try {
    const parsed = JSON.parse(config);
    const ids: Id<"_storage">[] = [];

    const extract = (obj: unknown) => {
      if (!obj || typeof obj !== "object") return;
      if (Array.isArray(obj)) {
        obj.forEach(extract);
      } else {
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          if (key === "storageId" && typeof value === "string") {
            ids.push(value as Id<"_storage">);
          } else {
            extract(value);
          }
        }
      }
    };

    extract(parsed);
    return ids;
  } catch {
    return [];
  }
}

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

    // Nếu config thay đổi, cleanup files cũ không còn dùng
    if (rest.config !== undefined) {
      const existing = await ctx.db.get(id);
      if (existing) {
        const oldIds = new Set(extractStorageIds(existing.config));
        const newIds = new Set(extractStorageIds(rest.config));

        // Xóa các file cũ không còn trong config mới
        for (const oldId of oldIds) {
          if (!newIds.has(oldId)) {
            try {
              await ctx.storage.delete(oldId);
            } catch {
              // File có thể đã bị xóa
            }
          }
        }
      }
    }

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
    // Lấy component trước khi xóa để cleanup files
    const component = await ctx.db.get(args.id);
    if (component) {
      // Xóa các files trong storage
      const storageIds = extractStorageIds(component.config);
      for (const storageId of storageIds) {
        try {
          await ctx.storage.delete(storageId);
        } catch {
          // File có thể đã bị xóa
        }
      }
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});
