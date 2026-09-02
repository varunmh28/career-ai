"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Sparkles, UserCheck } from "lucide-react";

export function LeftProfileRail() {
  const profile = useQuery(api.profiles.getCurrentUserProfile, {
    userId: "demo_alex_carter",
  });

  const savedJobs = useQuery(api.jobs.getSavedJobs, {
    userId: "demo_alex_carter",
  });

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        {/* Cover */}
        <div className="h-16 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <CardContent className="pt-0 px-4 pb-4 -mt-8 flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-zinc-900 shadow-md">
            <AvatarImage
              src={profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop"}
              alt={profile?.fullName || "Alex Carter"}
            />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>

          <Link
            href="/in/alex-carter"
            className="mt-2.5 font-bold text-sm text-zinc-900 dark:text-zinc-50 hover:text-blue-600 transition"
          >
            {profile?.fullName || "Alex Carter"}
          </Link>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 px-1">
            {profile?.headline || "Frontend Developer | Open to opportunities"}
          </p>

          <div className="w-full border-t border-zinc-100 dark:border-zinc-800/80 my-3.5 pt-3 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Profile Strength</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {profile?.completenessScore || 62}%
              </span>
            </div>
            <Progress
              value={profile?.completenessScore || 62}
              className="h-1.5"
              indicatorClassName={
                (profile?.completenessScore || 62) > 80
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              {(profile?.completenessScore || 62) < 80
                ? "Weak headline & missing Next.js / AI skills"
                : "Optimized for Next.js AI roles"}
            </p>
          </div>

          <div className="w-full space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
            <Link
              href="/jobs"
              className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition py-1"
            >
              <span className="flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
                Saved Jobs
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                {savedJobs?.length || 1}
              </span>
            </Link>

            <Link
              href="/jobs"
              className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition py-1"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                Target Role
              </span>
              <span className="font-semibold text-blue-600 text-[11px]">
                {profile?.targetRole || "AI Engineer"}
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pro Agent Card */}
      <Card className="border border-blue-200/80 dark:border-blue-900/50 bg-linear-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/10 shadow-2xs">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="pro" className="text-[10px] py-0 px-2">
              PRO AGENT
            </Badge>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Vercel Eve Agent
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
            Let the AI agent optimize your profile, analyze skill gaps against live jobs, and draft outreach with human approval.
          </p>
          <Link href="/agent">
            <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Launch Career Agent
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
