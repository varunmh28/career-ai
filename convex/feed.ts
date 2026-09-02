import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(args.limit || 30);

    const enriched = [];
    for (const post of posts) {
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_postId", (q) => q.eq("postId", post._id))
        .take(10);

      enriched.push({
        ...post,
        comments,
      });
    }

    return enriched;
  },
});

export const createPost = mutation({
  args: {
    userId: v.string(),
    authorName: v.string(),
    authorHeadline: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      userId: args.userId,
      authorName: args.authorName,
      authorHeadline: args.authorHeadline,
      authorAvatar: args.authorAvatar,
      content: args.content,
      likesCount: 0,
      commentsCount: 0,
    });
  },
});

export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId)
      )
      .first();

    const post = await ctx.db.get("posts", args.postId);
    if (!post) return;

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, {
        likesCount: Math.max(0, post.likesCount - 1),
      });
    } else {
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId: args.userId,
      });
      await ctx.db.patch(args.postId, {
        likesCount: post.likesCount + 1,
      });
    }
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get("posts", args.postId);
    if (!post) return;

    await ctx.db.insert("comments", {
      postId: args.postId,
      userId: args.userId,
      authorName: args.authorName,
      authorAvatar: args.authorAvatar,
      content: args.content,
    });

    await ctx.db.patch(args.postId, {
      commentsCount: post.commentsCount + 1,
    });
  },
});
