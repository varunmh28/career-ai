"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";

interface Comment {
  _id: Id<"comments">;
  authorName: string;
  authorAvatar?: string;
  content: string;
  _creationTime: number;
}

interface PostCardProps {
  post: {
    _id: Id<"posts">;
    authorName: string;
    authorHeadline: string;
    authorAvatar?: string;
    content: string;
    likesCount: number;
    commentsCount: number;
    _creationTime: number;
    comments: Comment[];
  };
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [hasLiked, setHasLiked] = useState(false);

  const toggleLike = useMutation(api.feed.toggleLike);
  const addComment = useMutation(api.feed.addComment);

  const handleLike = async () => {
    setHasLiked(!hasLiked);
    try {
      await toggleLike({
        postId: post._id,
        userId: "demo_alex_carter",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({
        postId: post._id,
        userId: "demo_alex_carter",
        authorName: "Alex Carter",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
        content: commentText.trim(),
      });
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
      <CardContent className="p-4 space-y-3">
        {/* Author Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-1 ring-zinc-200 dark:ring-zinc-800">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {post.authorName}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {post.authorHeadline}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 pt-2 text-[11px]">
          <span>{post.likesCount + (hasLiked ? 1 : 0)} reactions</span>
          <span>{post.comments.length || post.commentsCount} comments</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              hasLiked
                ? "text-rose-600 bg-rose-50 dark:bg-rose-950/30 font-bold"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
            <span>Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 space-y-3">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a constructive thought..."
                className="flex-1 h-8 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <Button type="submit" size="sm" className="h-8 text-xs gap-1">
                <Send className="h-3 w-3" />
                Reply
              </Button>
            </form>

            <div className="space-y-2">
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-2.5 p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/60 text-xs"
                >
                  <Avatar className="h-7 w-7 ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>
                      {comment.authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {comment.authorName}
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5 leading-normal">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
