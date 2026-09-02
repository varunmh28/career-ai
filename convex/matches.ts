import { action, internalMutation, internalQuery, query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export type CandidateMatchInfo = {
  profileId: Id<"profiles">;
  userId: string;
  fullName: string;
  headline: string;
  about: string;
  targetRole?: string;
  embedding?: number[];
  skillNames: string[];
};

export type HydratedJobInfo = Doc<"jobs"> & {
  company: {
    name: string;
    slug: string;
    logoUrl?: string;
    location: string;
  } | null;
  recruiter: {
    _id: Id<"recruiters">;
    name: string;
    title: string;
    avatarUrl?: string;
    email: string;
  } | null;
};

export const getCandidateForMatching = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<CandidateMatchInfo | null> => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) return null;

    const skills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(50);

    return {
      profileId: profile._id,
      userId: profile.userId,
      fullName: profile.fullName,
      headline: profile.headline,
      about: profile.about,
      targetRole: profile.targetRole,
      embedding: profile.embedding,
      skillNames: skills.map((s) => s.name),
    };
  },
});

export const getHydratedJobs = internalQuery({
  args: { jobIds: v.array(v.id("jobs")) },
  handler: async (ctx, args): Promise<HydratedJobInfo[]> => {
    const results: HydratedJobInfo[] = [];
    for (const id of args.jobIds) {
      const job = await ctx.db.get("jobs", id);
      if (job) {
        const company = await ctx.db.get("companies", job.companyId);
        const recruiter = await ctx.db
          .query("recruiters")
          .withIndex("by_companyId", (q) => q.eq("companyId", job.companyId))
          .first();

        results.push({
          ...job,
          company: company
            ? {
                name: company.name,
                slug: company.slug,
                logoUrl: company.logoUrl,
                location: company.location,
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
    }
    return results;
  },
});

export const saveMatchesBatch = internalMutation({
  args: {
    userId: v.string(),
    matches: v.array(
      v.object({
        jobId: v.id("jobs"),
        similarityScore: v.number(),
        matchPercentage: v.number(),
        matchingSkills: v.array(v.string()),
        missingSkills: v.array(v.string()),
        rationale: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const m of args.matches) {
      const existing = await ctx.db
        .query("matches")
        .withIndex("by_user_and_job", (q) =>
          q.eq("userId", args.userId).eq("jobId", m.jobId)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          similarityScore: m.similarityScore,
          matchPercentage: m.matchPercentage,
          matchingSkills: m.matchingSkills,
          missingSkills: m.missingSkills,
          rationale: m.rationale,
        });
      } else {
        await ctx.db.insert("matches", {
          userId: args.userId,
          jobId: m.jobId,
          similarityScore: m.similarityScore,
          matchPercentage: m.matchPercentage,
          matchingSkills: m.matchingSkills,
          missingSkills: m.missingSkills,
          rationale: m.rationale,
          status: "recommended",
        });
      }
    }
  },
});

// Main Action: Vector search and similarity matching
export const findMatchesForUser = action({
  args: {
    userId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    Array<{
      job: HydratedJobInfo;
      jobId: Id<"jobs">;
      similarityScore: number;
      matchPercentage: number;
      matchingSkills: string[];
      missingSkills: string[];
      rationale: string;
    }>
  > => {
    const targetUserId = args.userId || "demo_alex_carter";
    const candidate: CandidateMatchInfo | null = await ctx.runQuery(
      internal.matches.getCandidateForMatching,
      {
        userId: targetUserId,
      }
    );

    if (!candidate) {
      throw new Error(`Candidate profile not found for userId: ${targetUserId}`);
    }

    let searchVector = candidate.embedding;

    // If profile embedding is missing, generate it on the fly
    if (!searchVector || searchVector.length !== 768) {
      const profileText = `
Candidate: ${candidate.fullName}
Headline: ${candidate.headline}
Target Role: ${candidate.targetRole || "Software Engineer"}
About: ${candidate.about}
Skills: ${candidate.skillNames.join(", ")}
      `.trim();

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured on Convex.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/gemini-embedding-001",
            content: { parts: [{ text: profileText }] },
            outputDimensionality: 768,
          }),
        }
      );
      const data = await response.json();
      searchVector = data.embedding?.values;

      if (searchVector && searchVector.length === 768) {
        await ctx.runMutation(internal.embeddings.patchProfileEmbedding, {
          profileId: candidate.profileId,
          embedding: searchVector,
        });
      }
    }

    if (!searchVector || searchVector.length !== 768) {
      throw new Error("Failed to resolve 768-dimensional embedding for candidate.");
    }

    // Execute vector search over active jobs
    const vectorResults: Array<{ _id: Id<"jobs">; _score: number }> =
      await ctx.vectorSearch("jobs", "by_embedding", {
        vector: searchVector,
        limit: args.limit || 8,
        filter: (q) => q.eq("isActive", true),
      });

    const jobIds = vectorResults.map((r) => r._id);
    const scoreMap = new Map<string, number>(
      vectorResults.map((r) => [r._id.toString(), r._score])
    );

    const hydratedJobs: HydratedJobInfo[] = await ctx.runQuery(
      internal.matches.getHydratedJobs,
      {
        jobIds,
      }
    );

    const candidateSkillSet = new Set(
      candidate.skillNames.map((s: string) => s.toLowerCase().trim())
    );

    const computedMatches = hydratedJobs.map((job: HydratedJobInfo) => {
      const rawScore = scoreMap.get(job._id.toString()) || 0.65;

      // Calculate human-friendly match percentage (e.g. 52% - 96%)
      const matchPercentage = Math.min(
        96,
        Math.max(52, Math.round(rawScore * 100))
      );

      const allJobSkills = [...job.requiredSkills, ...job.preferredSkills];
      const matchingSkills = allJobSkills.filter((s) =>
        candidateSkillSet.has(s.toLowerCase().trim())
      );
      const missingSkills = job.requiredSkills.filter(
        (s) => !candidateSkillSet.has(s.toLowerCase().trim())
      );

      let rationale = `Strong foundation in ${matchingSkills.slice(0, 3).join(", ")}.`;
      if (missingSkills.length > 0) {
        rationale += ` Key skill growth area: ${missingSkills.slice(0, 3).join(", ")}.`;
      }

      return {
        job,
        jobId: job._id as Id<"jobs">,
        similarityScore: rawScore,
        matchPercentage,
        matchingSkills,
        missingSkills,
        rationale,
      };
    });

    // Sort by matchPercentage descending
    computedMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Persist matches to database
    await ctx.runMutation(internal.matches.saveMatchesBatch, {
      userId: targetUserId,
      matches: computedMatches.map((m) => ({
        jobId: m.jobId,
        similarityScore: m.similarityScore,
        matchPercentage: m.matchPercentage,
        matchingSkills: m.matchingSkills,
        missingSkills: m.missingSkills,
        rationale: m.rationale,
      })),
    });

    return computedMatches;
  },
});

// Query matches for user
export const listMatchesForUser = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const targetUserId = args.userId || "demo_alex_carter";
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
      .take(20);

    const enriched = [];
    for (const m of matches) {
      const job = await ctx.db.get("jobs", m.jobId);
      if (job) {
        const company = await ctx.db.get("companies", job.companyId);
        const recruiter = await ctx.db
          .query("recruiters")
          .withIndex("by_companyId", (q) => q.eq("companyId", job.companyId))
          .first();

        enriched.push({
          ...m,
          job: {
            ...job,
            company: company
              ? {
                  name: company.name,
                  slug: company.slug,
                  logoUrl: company.logoUrl,
                  location: company.location,
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
          },
        });
      }
    }

    enriched.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return enriched;
  },
});

export const updateMatchStatus = mutation({
  args: {
    matchId: v.id("matches"),
    status: v.union(
      v.literal("recommended"),
      v.literal("saved"),
      v.literal("applied"),
      v.literal("dismissed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.matchId, { status: args.status });
  },
});
