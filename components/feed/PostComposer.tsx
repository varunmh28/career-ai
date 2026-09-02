"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Send, Sparkles } from "lucide-react";

export function PostComposer() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPost = useMutation(api.feed.createPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost({
        userId: "demo_alex_carter",
        authorName: "Alex Carter",
        authorHeadline: "Junior/Mid Frontend Developer @ WebSolutions",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
        content: content.trim(),
      });
      setContent("");
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-800">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a career update, AI project, or transition milestone..."
                rows={2}
                className="w-full resize-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mt-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Image className="h-3.5 w-3.5 text-blue-500" />
                <span>Media</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setContent(
                    "Just deployed my new AI agent portfolio using Next.js 16 + Vercel Eve! Excited to build more agentic fullstack systems."
                  )
                }
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-purple-600 transition px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span>AI Prompt</span>
              </button>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || isSubmitting}
              className="text-xs gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
