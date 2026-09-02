import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getProfileByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!profile) return null;

    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_userId", (q) => q.eq("userId", profile.userId))
      .take(20);

    const skills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", profile.userId))
      .take(50);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", profile.userId))
      .first();

    return {
      ...profile,
      experiences,
      skills,
      userRole: user?.role || "free",
    };
  },
});

export const getCurrentUserProfile = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const targetUserId = args.userId || "demo_alex_carter";
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
      .first();

    if (!profile) {
      // Fall back to Alex Carter for preview if user hasn't set up profile
      const alexProfile = await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", "alex-carter"))
        .first();

      if (!alexProfile) return null;

      const experiences = await ctx.db
        .query("experiences")
        .withIndex("by_userId", (q) => q.eq("userId", alexProfile.userId))
        .take(20);

      const skills = await ctx.db
        .query("skills")
        .withIndex("by_userId", (q) => q.eq("userId", alexProfile.userId))
        .take(50);

      return {
        ...alexProfile,
        experiences,
        skills,
        userRole: "free" as const,
      };
    }

    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
      .take(20);

    const skills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
      .take(50);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", targetUserId))
      .first();

    return {
      ...profile,
      experiences,
      skills,
      userRole: user?.role || "free",
    };
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.string(),
    headline: v.optional(v.string()),
    about: v.optional(v.string()),
    location: v.optional(v.string()),
    targetRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        ...(args.headline ? { headline: args.headline } : {}),
        ...(args.about ? { about: args.about } : {}),
        ...(args.location ? { location: args.location } : {}),
        ...(args.targetRole ? { targetRole: args.targetRole } : {}),
      });
    }
  },
});

export const addSkill = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(50);

    const alreadyExists = existing.some(
      (s) => s.name.toLowerCase() === args.name.toLowerCase()
    );

    if (!alreadyExists) {
      await ctx.db.insert("skills", {
        userId: args.userId,
        name: args.name,
        category: args.category || "AI & Web Development",
        endorsements: 1,
      });
    }
  },
});

export const saveProfileDraft = mutation({
  args: {
    userId: v.string(),
    headline: v.string(),
    about: v.string(),
    skillsToAdd: v.array(v.string()),
    bulletPoints: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Replace existing draft
    const existing = await ctx.db
      .query("profileDrafts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(10);

    for (const d of existing) {
      await ctx.db.delete(d._id);
    }

    return await ctx.db.insert("profileDrafts", {
      userId: args.userId,
      headline: args.headline,
      about: args.about,
      skillsToAdd: args.skillsToAdd,
      bulletPoints: args.bulletPoints,
      status: "draft",
    });
  },
});

export const applyProfileDraft = mutation({
  args: {
    userId: v.string(),
    draftId: v.id("profileDrafts"),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get("profileDrafts", args.draftId);
    if (!draft || draft.userId !== args.userId) {
      throw new Error("Profile draft not found or unauthorized");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        headline: draft.headline,
        about: draft.about,
        completenessScore: 95,
      });

      // Add new skills
      for (const skillName of draft.skillsToAdd) {
        const existing = await ctx.db
          .query("skills")
          .withIndex("by_userId", (q) => q.eq("userId", args.userId))
          .take(50);

        if (!existing.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
          await ctx.db.insert("skills", {
            userId: args.userId,
            name: skillName,
            category: "AI & Modern Engineering",
            endorsements: 5,
          });
        }
      }

      await ctx.db.patch(draft._id, { status: "approved" });
    }
  },
});
