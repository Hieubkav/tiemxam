import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const track = mutation({
  args: {
    visitorId: v.optional(v.string()),
    path: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let isNew = false;
    if (args.visitorId) {
      const existing = await ctx.db
        .query("visitors")
        .withIndex("by_visitorId", (q) => q.eq("visitorId", args.visitorId as string))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          lastSeen: now,
          visitCount: existing.visitCount + 1,
        });
      } else {
        isNew = true;
        await ctx.db.insert("visitors", {
          visitorId: args.visitorId,
          firstSeen: now,
          lastSeen: now,
          visitCount: 1,
        });
      }
    }
    await ctx.db.insert("visits", {
      visitorId: args.visitorId,
      path: args.path,
      userAgent: args.userAgent,
      createdAt: now,
    });
    return { visitorId: args.visitorId ?? null, isNew };
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").collect();
    const visits = await ctx.db.query("visits").collect();
    return {
      uniqueVisitors: visitors.length,
      totalVisits: visits.length,
    };
  },
});
