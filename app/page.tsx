"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LeftProfileRail } from "@/components/feed/LeftProfileRail";
import { PostComposer } from "@/components/feed/PostComposer";
import { PostCard } from "@/components/feed/PostCard";
import { RightJobMatchesRail } from "@/components/feed/RightJobMatchesRail";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedPage() {
  const posts = useQuery(api.feed.getFeed, { limit: 30 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Profile Rail (3 cols on md+) */}
        <aside className="md:col-span-3">
          <div className="sticky top-20">
            <LeftProfileRail />
          </div>
        </aside>

        {/* Center Feed Column (6 cols on md+) */}
        <section className="md:col-span-6 space-y-4">
          <PostComposer />

          {/* Posts Stream */}
          <div className="space-y-4">
            {posts === undefined ? (
              // Loading Skeletons
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-sm">
                No posts in the feed yet. Be the first to share an update!
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post as any} />
              ))
            )}
          </div>
        </section>

        {/* Right Job Matches Rail (3 cols on md+) */}
        <aside className="md:col-span-3">
          <div className="sticky top-20">
            <RightJobMatchesRail />
          </div>
        </aside>
      </div>
    </div>
  );
}
