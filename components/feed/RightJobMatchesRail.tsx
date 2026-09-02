"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";

export function RightJobMatchesRail() {
  const matches = useQuery(api.matches.listMatchesForUser, {
    userId: "demo_alex_carter",
  });

  return (
    <div className="space-y-4">
      {/* AI Matches Card */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Top AI Vector Matches
            </CardTitle>
            <Badge variant="pro" className="text-[9px] px-1.5 py-0">
              768-D AI
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Ranked by semantic profile match
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-1 space-y-3">
          {matches && matches.length > 0 ? (
            matches.slice(0, 4).map((m) => (
              <Link
                key={m._id}
                href="/jobs"
                className="block p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 hover:border-blue-200 dark:hover:border-blue-900 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {m.job?.title}
                  </h5>
                  <Badge variant="match" className="text-[10px] shrink-0">
                    {m.matchPercentage}%
                  </Badge>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-1.5">
                  {m.job?.company?.name} • {m.job?.location}
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.matchingSkills.slice(0, 2).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                  {m.missingSkills.slice(0, 1).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-zinc-500">
              <p>Scanning 20+ live jobs for embeddings...</p>
              <Link href="/jobs" className="mt-2 inline-block">
                <Button size="sm" variant="outline" className="text-xs">
                  Run Matcher
                </Button>
              </Link>
            </div>
          )}

          <Link href="/jobs" className="block pt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1 hover:text-blue-600"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            High-Demand Skills in 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>Next.js 16 + Server Actions</span>
            <span className="font-semibold text-emerald-600">+142%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>Vercel AI SDK & Agent Loops</span>
            <span className="font-semibold text-emerald-600">+210%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>Vector RAG with Convex</span>
            <span className="font-semibold text-emerald-600">+98%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>LLM Structured Outputs (Zod)</span>
            <span className="font-semibold text-emerald-600">+175%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
