"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Accelerate your career with Pro AI tooling
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Unlock vector similarity job matching, profile optimization, and recruiter outreach powered by Vercel Eve & Convex.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Free Plan */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col justify-between">
          <div>
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Free Member</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  CURRENT
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Full access to the professional network and standard job directory.
              </CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  $0
                </span>
                <span className="text-xs text-zinc-400">/ forever</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-3">
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Included in Free:
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Interactive LinkedIn-style social feed</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Browse 20+ verified tech job listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Candidate profile with experience & skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Save jobs & follow companies</span>
                </li>
              </ul>
            </CardContent>
          </div>

          <CardFooter className="p-6 pt-0">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full text-xs font-semibold">
                Explore Feed
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-zinc-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-linear-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-xs">
            POPULAR FOR JOB SEEKERS
          </div>

          <div>
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold">CareerPrime Pro</CardTitle>
                <Crown className="h-4 w-4 text-amber-500" />
              </div>
              <CardDescription className="text-xs mt-1">
                Full AI agent capabilities with vector matching and human approval.
              </CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  $29
                </span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-3">
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Everything in Free, plus:
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0 font-bold" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    768-D Vector Search & Similarity Match %
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Vercel Eve AI Profile Optimizer (Headline & About)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Personalized Recruiter Outreach Message Writer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>90-Day Transition Roadmap & Milestones</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Human-in-the-loop approval gates before saving</span>
                </li>
              </ul>
            </CardContent>
          </div>

          <CardFooter className="p-6 pt-0">
            <Show when="signed-in">
              <Link href="/agent" className="w-full">
                <Button variant="gradient" className="w-full text-xs font-bold gap-1.5 shadow-md">
                  <Sparkles className="h-4 w-4" />
                  <span>Activate Pro Agent Features</span>
                </Button>
              </Link>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="gradient" className="w-full text-xs font-bold gap-1.5 shadow-md">
                  <Sparkles className="h-4 w-4" />
                  <span>Sign In to Upgrade</span>
                </Button>
              </SignInButton>
            </Show>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
