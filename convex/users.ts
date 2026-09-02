import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

export const upsertCurrentUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      role: "free",
    });

    const username = args.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    // Also lazily create profile if none exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.clerkId))
      .first();

    if (!existingProfile) {
      await ctx.db.insert("profiles", {
        userId: args.clerkId,
        username,
        fullName: args.name,
        headline: "Software Engineer | Member @ CareerPrime",
        about: "Welcome to my professional profile on CareerPrime.",
        location: "London, UK",
        avatarUrl: args.imageUrl,
        completenessScore: 70,
      });
    }

    return userId;
  },
});
