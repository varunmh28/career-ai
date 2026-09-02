import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const listOutreachDrafts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const drafts = await ctx.db
      .query("outreachDrafts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(20);

    const enriched = [];
    for (const d of drafts) {
      const job = await ctx.db.get("jobs", d.jobId);
      const recruiter = d.recruiterId
        ? await ctx.db.get("recruiters", d.recruiterId)
        : null;
      const company = job ? await ctx.db.get("companies", job.companyId) : null;

      enriched.push({
        ...d,
        job: job
          ? {
              title: job.title,
              location: job.location,
              companyName: company?.name || "Tech Company",
            }
          : null,
        recruiter: recruiter
          ? {
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

export const saveOutreachDraft = mutation({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
    recruiterId: v.optional(v.id("recruiters")),
    subject: v.string(),
    body: v.string(),
    tone: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("outreachDrafts", {
      userId: args.userId,
      jobId: args.jobId,
      recruiterId: args.recruiterId,
      subject: args.subject,
      body: args.body,
      tone: args.tone,
      status: "saved",
    });
  },
});

export const updateOutreachDraft = mutation({
  args: {
    draftId: v.id("outreachDrafts"),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.draftId, {
      subject: args.subject,
      body: args.body,
    });
  },
});
