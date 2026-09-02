import { action, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Helper function to call Google Gemini embedding API (768 dimensions)
async function fetchGeminiEmbedding(text: string, apiKey: string): Promise<number[]> {
  const cleanText = text.replace(/\s+/g, " ").trim().slice(0, 2048);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text: cleanText }],
        },
        outputDimensionality: 768,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini embedding error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const values = data.embedding?.values;
  if (!Array.isArray(values) || values.length !== 768) {
    throw new Error(
      `Invalid embedding returned from Gemini: expected 768 values, got ${values?.length}`
    );
  }

  return values;
}

// Internal queries for embedding generation
export const getJobsNeedingEmbeddings = internalQuery({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(100);

    return jobs.map((j) => ({
      _id: j._id,
      title: j.title,
      location: j.location,
      workplaceType: j.workplaceType,
      experienceLevel: j.experienceLevel,
      description: j.description,
      requiredSkills: j.requiredSkills,
      preferredSkills: j.preferredSkills,
      requirements: j.requirements,
      hasEmbedding: Boolean(j.embedding && j.embedding.length === 768),
    }));
  },
});

export const getProfileForEmbedding = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) return null;

    const skills = await ctx.db
      .query("skills")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(50);

    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(20);

    return {
      _id: profile._id,
      fullName: profile.fullName,
      headline: profile.headline,
      about: profile.about,
      targetRole: profile.targetRole,
      skills: skills.map((s) => s.name),
      experiences: experiences.map(
        (e) => `${e.title} at ${e.company} (${e.description}) [${e.skills.join(", ")}]`
      ),
    };
  },
});

// Internal mutations to patch embeddings
export const patchJobEmbedding = internalMutation({
  args: {
    jobId: v.id("jobs"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, { embedding: args.embedding });
  },
});

export const patchProfileEmbedding = internalMutation({
  args: {
    profileId: v.id("profiles"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, { embedding: args.embedding });
  },
});

// Action to generate embedding for raw text
export const generateTextEmbedding = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Convex.");
    }
    return await fetchGeminiEmbedding(args.text, apiKey);
  },
});

// Main Action: Backfill embeddings for all jobs and candidate profile
export const backfillAllEmbeddings = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Convex.");
    }

    let jobsUpdated = 0;
    const jobs = await ctx.runQuery(internal.embeddings.getJobsNeedingEmbeddings, {});

    for (const job of jobs) {
      const semanticText = `
Job Title: ${job.title}
Workplace: ${job.workplaceType}
Level: ${job.experienceLevel}
Location: ${job.location}
Required Skills: ${job.requiredSkills.join(", ")}
Preferred Skills: ${job.preferredSkills.join(", ")}
Requirements: ${job.requirements.join(". ")}
Description: ${job.description}
      `.trim();

      const embedding = await fetchGeminiEmbedding(semanticText, apiKey);
      await ctx.runMutation(internal.embeddings.patchJobEmbedding, {
        jobId: job._id,
        embedding,
      });
      jobsUpdated++;
    }

    // Backfill Alex Carter profile embedding
    let profilesUpdated = 0;
    const alexProfile = await ctx.runQuery(internal.embeddings.getProfileForEmbedding, {
      userId: "demo_alex_carter",
    });

    if (alexProfile) {
      const profileText = `
Candidate Name: ${alexProfile.fullName}
Headline: ${alexProfile.headline}
Target Role: ${alexProfile.targetRole || "Software Engineer"}
About: ${alexProfile.about}
Skills: ${alexProfile.skills.join(", ")}
Experience: ${alexProfile.experiences.join(". ")}
      `.trim();

      const profileEmbedding = await fetchGeminiEmbedding(profileText, apiKey);
      await ctx.runMutation(internal.embeddings.patchProfileEmbedding, {
        profileId: alexProfile._id,
        embedding: profileEmbedding,
      });
      profilesUpdated++;
    }

    return {
      success: true,
      jobsUpdated,
      profilesUpdated,
      message: `Successfully backfilled embeddings for ${jobsUpdated} jobs and ${profilesUpdated} candidate profile(s).`,
    };
  },
});
