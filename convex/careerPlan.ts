import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCareerPlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("careerPlans")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const saveCareerPlan = mutation({
  args: {
    userId: v.string(),
    targetRole: v.string(),
    timeline: v.string(),
    milestones: v.array(
      v.object({
        week: v.string(),
        title: v.string(),
        tasks: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("careerPlans")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(10);

    for (const p of existing) {
      await ctx.db.delete(p._id);
    }

    return await ctx.db.insert("careerPlans", {
      userId: args.userId,
      targetRole: args.targetRole,
      timeline: args.timeline,
      milestones: args.milestones,
      status: "active",
    });
  },
});
