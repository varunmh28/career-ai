import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("free"), v.literal("pro")),
    bio: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  profiles: defineTable({
    userId: v.string(), // Clerk user ID or Alex Carter demo ID
    username: v.string(),
    fullName: v.string(),
    headline: v.string(),
    about: v.string(),
    location: v.string(),
    avatarUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    targetRole: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
    completenessScore: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  experiences: defineTable({
    userId: v.string(),
    company: v.string(),
    title: v.string(),
    location: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    description: v.string(),
    skills: v.array(v.string()),
  }).index("by_userId", ["userId"]),

  skills: defineTable({
    userId: v.string(),
    name: v.string(),
    category: v.string(),
    endorsements: v.number(),
  }).index("by_userId", ["userId"]),

  companies: defineTable({
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    industry: v.string(),
    location: v.string(),
    size: v.string(),
    about: v.string(),
    website: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  jobs: defineTable({
    companyId: v.id("companies"),
    title: v.string(),
    slug: v.string(),
    location: v.string(),
    workplaceType: v.union(
      v.literal("remote"),
      v.literal("hybrid"),
      v.literal("on-site")
    ),
    employmentType: v.union(
      v.literal("full-time"),
      v.literal("contract"),
      v.literal("part-time")
    ),
    salaryRange: v.object({
      min: v.number(),
      max: v.number(),
      currency: v.string(),
    }),
    description: v.string(),
    requirements: v.array(v.string()),
    requiredSkills: v.array(v.string()),
    preferredSkills: v.array(v.string()),
    experienceLevel: v.union(
      v.literal("entry"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("lead")
    ),
    embedding: v.optional(v.array(v.float64())),
    isActive: v.boolean(),
    postedAt: v.string(),
  })
    .index("by_companyId", ["companyId"])
    .index("by_isActive", ["isActive"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 768,
      filterFields: ["isActive", "workplaceType"],
    }),

  matches: defineTable({
    userId: v.string(),
    jobId: v.id("jobs"),
    similarityScore: v.number(), // 0 - 1
    matchPercentage: v.number(), // 0 - 100
    matchingSkills: v.array(v.string()),
    missingSkills: v.array(v.string()),
    rationale: v.string(),
    status: v.union(
      v.literal("recommended"),
      v.literal("saved"),
      v.literal("applied"),
      v.literal("dismissed")
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_jobId", ["jobId"])
    .index("by_user_and_job", ["userId", "jobId"]),

  posts: defineTable({
    userId: v.string(),
    authorName: v.string(),
    authorHeadline: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
    likesCount: v.number(),
    commentsCount: v.number(),
  }).index("by_userId", ["userId"]),

  comments: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
  }).index("by_postId", ["postId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  }).index("by_post_and_user", ["postId", "userId"]),

  follows: defineTable({
    followerId: v.string(),
    followingId: v.string(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_and_following", ["followerId", "followingId"]),

  savedJobs: defineTable({
    userId: v.string(),
    jobId: v.id("jobs"),
  })
    .index("by_user_and_job", ["userId", "jobId"])
    .index("by_userId", ["userId"]),

  recruiters: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    title: v.string(),
    avatarUrl: v.optional(v.string()),
    email: v.string(),
    linkedinUrl: v.optional(v.string()),
  }).index("by_companyId", ["companyId"]),

  outreachDrafts: defineTable({
    userId: v.string(),
    jobId: v.id("jobs"),
    recruiterId: v.optional(v.id("recruiters")),
    subject: v.string(),
    body: v.string(),
    tone: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("saved")
    ),
  }).index("by_userId", ["userId"]),

  profileDrafts: defineTable({
    userId: v.string(),
    headline: v.string(),
    about: v.string(),
    skillsToAdd: v.array(v.string()),
    bulletPoints: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("approved")),
  }).index("by_userId", ["userId"]),

  careerPlans: defineTable({
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
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("draft")
    ),
  }).index("by_userId", ["userId"]),

  aiRuns: defineTable({
    userId: v.string(),
    feature: v.string(),
    input: v.string(),
    output: v.string(),
    status: v.union(v.literal("success"), v.literal("error")),
  }).index("by_userId", ["userId"]),
});
