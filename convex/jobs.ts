import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    workplaceType: v.optional(
      v.union(v.literal("remote"), v.literal("hybrid"), v.literal("on-site"))
    ),
    searchTerm: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(args.limit || 50);

    if (args.workplaceType) {
      jobs = jobs.filter((j) => j.workplaceType === args.workplaceType);
    }

    if (args.searchTerm && args.searchTerm.trim().length > 0) {
      const term = args.searchTerm.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(term)) ||
          j.location.toLowerCase().includes(term)
      );
    }

    const enriched = [];
    for (const job of jobs) {
      const company = await ctx.db.get("companies", job.companyId);
      const recruiter = await ctx.db
        .query("recruiters")
        .withIndex("by_companyId", (q) => q.eq("companyId", job.companyId))
        .first();

      enriched.push({
        ...job,
        company: company
          ? {
              name: company.name,
              slug: company.slug,
              logoUrl: company.logoUrl,
              location: company.location,
              about: company.about,
            }
          : null,
        recruiter: recruiter
          ? {
              _id: recruiter._id,
              name: recruiter.name,
              title: recruiter.title,
              avatarUrl: recruiter.avatarUrl,
              email: recruiter.email,
            }
          : null,
      });
    }

    return enriched;
  },
});

export const getById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get("jobs", args.jobId);
    if (!job) return null;

    const company = await ctx.db.get("companies", job.companyId);
    const recruiter = await ctx.db
      .query("recruiters")
      .withIndex("by_companyId", (q) => q.eq("companyId", job.companyId))
      .first();

    return {
      ...job,
      company: company
        ? {
            name: company.name,
            slug: company.slug,
            logoUrl: company.logoUrl,
            location: company.location,
            about: company.about,
            website: company.website,
            size: company.size,
          }
        : null,
      recruiter: recruiter
        ? {
            _id: recruiter._id,
            name: recruiter.name,
            title: recruiter.title,
            avatarUrl: recruiter.avatarUrl,
            email: recruiter.email,
            linkedinUrl: recruiter.linkedinUrl,
          }
        : null,
    };
  },
});

export const saveJob = mutation({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (!existing) {
      await ctx.db.insert("savedJobs", {
        userId: args.userId,
        jobId: args.jobId,
      });
    }
  },
});

export const unsaveJob = mutation({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getSavedJobs = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("savedJobs")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(50);

    const jobs = [];
    for (const s of saved) {
      const job = await ctx.db.get("jobs", s.jobId);
      if (job) {
        const company = await ctx.db.get("companies", job.companyId);
        jobs.push({
          ...job,
          savedAt: s._creationTime,
          company: company
            ? {
                name: company.name,
                slug: company.slug,
                logoUrl: company.logoUrl,
                location: company.location,
              }
            : null,
        });
      }
    }
    return jobs;
  },
});
