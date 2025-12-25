import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Lấy URL upload cho file
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Lấy URL của file đã upload
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Mutation lấy URL (dùng trong callback không thể dùng useQuery)
export const getUrlMutation = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Xóa file khỏi storage
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    try {
      await ctx.storage.delete(args.storageId);
    } catch {
      // File có thể đã bị xóa hoặc không tồn tại
    }
  },
});

// Internal mutation để cleanup files không dùng
export const cleanupUnusedFiles = internalMutation({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    for (const storageId of args.storageIds) {
      try {
        await ctx.storage.delete(storageId);
      } catch {
        // File có thể đã bị xóa
      }
    }
  },
});

// Helper để lấy tất cả storageIds từ config của home_components
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

// Query để lấy tất cả storageIds đang được sử dụng
export const getUsedStorageIds = query({
  handler: async (ctx) => {
    const components = await ctx.db.query("home_components").collect();
    const usedIds = new Set<string>();

    for (const comp of components) {
      const ids = extractStorageIds(comp.config);
      ids.forEach((id) => usedIds.add(id));
    }

    return Array.from(usedIds);
  },
});
