"use client";

import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  Globe,
  MapPin,
  Search,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Send,
  Loader2,
  HelpCircle,
} from "lucide-react";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "remote" | "hybrid" | "on-site">("all");
  const [selectedJobId, setSelectedJobId] = useState<Id<"jobs"> | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const jobs = useQuery(api.jobs.list, {
    workplaceType: selectedType === "all" ? undefined : selectedType,
    searchTerm: searchTerm.trim() || undefined,
  });

  const matches = useQuery(api.matches.listMatchesForUser, {
    userId: "demo_alex_carter",
  });

  const savedJobs = useQuery(api.jobs.getSavedJobs, {
    userId: "demo_alex_carter",
  });

  const runMatcher = useAction(api.matches.findMatchesForUser);
  const saveJob = useMutation(api.jobs.saveJob);
  const unsaveJob = useMutation(api.jobs.unsaveJob);

  const savedJobIds = new Set(savedJobs?.map((s) => s._id.toString()));

  const matchMap = new Map<string, any>(
    matches?.map((m) => [m.jobId.toString(), m]) || []
  );

  const handleRunMatcher = async () => {
    setIsMatching(true);
    try {
      await runMatcher({ userId: "demo_alex_carter", limit: 12 });
    } catch (err) {
      console.error("Match action failed:", err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleToggleSave = async (jobId: Id<"jobs">) => {
    if (savedJobIds.has(jobId.toString())) {
      await unsaveJob({ userId: "demo_alex_carter", jobId });
    } else {
      await saveJob({ userId: "demo_alex_carter", jobId });
    }
  };

  // Find currently selected job details
  const activeJob = jobs?.find((j) => j._id === selectedJobId) || jobs?.[0];
  const activeMatch = activeJob ? matchMap.get(activeJob._id.toString()) : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner with Vector Match Action */}
      <Card className="border border-blue-200/80 dark:border-blue-900/50 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-md overflow-hidden relative">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <CardContent className="p-6 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Convex 768-D Vector Search & AI Matcher</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              AI Job Recommendations for Alex Carter
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Match your candidate profile against 20+ live tech job listings from Vercel, Linear, Supabase, Anthropic, and Cursor.
            </p>
          </div>

          <Button
            onClick={handleRunMatcher}
            disabled={isMatching}
            size="lg"
            className="bg-white text-blue-700 hover:bg-white/90 shadow-md font-bold text-xs sm:text-sm shrink-0 gap-2 cursor-pointer"
          >
            {isMatching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Computing Cosine Similarity...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Match Me with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, skill (React, Next.js, AI SDK)..."
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-xs text-zinc-900 shadow-2xs placeholder:text-zinc-400 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* Workplace Type Tabs */}
        <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/80 p-1 rounded-xl">
          {(["all", "remote", "hybrid", "on-site"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                selectedType === type
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Jobs List (5 cols on lg+) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-zinc-500 font-medium">
            <span>Showing {jobs?.length || 0} open positions</span>
            <span>Sorted by relevance</span>
          </div>

          {jobs === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
              No jobs matching your filter. Try adjusting your search query.
            </div>
          ) : (
            jobs.map((job) => {
              const match = matchMap.get(job._id.toString());
              const isSelected = activeJob?._id === job._id;
              const isSaved = savedJobIds.has(job._id.toString());

              return (
                <Card
                  key={job._id}
                  onClick={() => setSelectedJobId(job._id)}
                  className={`p-4 cursor-pointer transition-all border ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-600/20 shadow-md bg-blue-50/20 dark:bg-blue-950/20"
                      : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/90 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {job.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3 w-3 text-zinc-400" />
                        <span className="font-medium">{job.company?.name}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3 text-zinc-400" />
                        <span>{job.location}</span>
                      </p>
                    </div>

                    {match && (
                      <Badge variant="match" className="text-xs shrink-0 font-bold px-2">
                        {match.matchPercentage}% Match
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                    <span className="capitalize px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium">
                      {job.workplaceType}
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-[11px]">
                      ${(job.salaryRange.min / 1000).toFixed(0)}k - $
                      {(job.salaryRange.max / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[10px] text-zinc-400 py-0.5">
                        +{job.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Job Detail Panel (7 cols on lg+) */}
        <div className="lg:col-span-7 sticky top-20">
          {activeJob ? (
            <Card className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
              <CardHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {activeJob.company?.name}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-xs text-zinc-400">{activeJob.postedAt}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                      {activeJob.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        {activeJob.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        ${activeJob.salaryRange.min.toLocaleString()} - $
                        {activeJob.salaryRange.max.toLocaleString()} USD
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Globe className="h-3.5 w-3.5 text-blue-500" />
                        {activeJob.workplaceType}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleToggleSave(activeJob._id)}
                    variant={savedJobIds.has(activeJob._id.toString()) ? "secondary" : "outline"}
                    size="sm"
                    className="gap-1.5 shrink-0"
                  >
                    {savedJobIds.has(activeJob._id.toString()) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-blue-600" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Vector Match Card inside Detail */}
                {activeMatch && (
                  <div className="mt-4 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <span>Vector Profile Match: {activeMatch.matchPercentage}%</span>
                      </div>
                      <Badge variant="match" className="text-xs font-bold">
                        Score: {(activeMatch.similarityScore * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                      {activeMatch.rationale}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <div>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                          ✓ Matching Skills ({activeMatch.matchingSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeMatch.matchingSkills.map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                          + Missing Skill Gaps ({activeMatch.missingSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeMatch.missingSkills.map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6 space-y-6 max-h-[480px] overflow-y-auto">
                {/* Description */}
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2">
                    About the Role
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {activeJob.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2">
                    Role Requirements
                  </h4>
                  <ul className="space-y-1.5">
                    {activeJob.requirements.map((req, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recruiter Card */}
                {activeJob.recruiter && (
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 ring-1 ring-zinc-200 dark:ring-zinc-700">
                        <AvatarImage src={activeJob.recruiter.avatarUrl} />
                        <AvatarFallback>
                          {activeJob.recruiter.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs text-zinc-400 font-medium">Hiring Manager / Recruiter</div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {activeJob.recruiter.name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {activeJob.recruiter.title}
                        </div>
                      </div>
                    </div>

                    <Link href={`/outreach?jobId=${activeJob._id}`}>
                      <Button variant="primary" size="sm" className="text-xs gap-1.5">
                        <Send className="h-3.5 w-3.5" />
                        <span>Draft Outreach</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 bg-zinc-50/80 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <Link href={`/outreach?jobId=${activeJob._id}`} className="flex-1">
                  <Button variant="outline" className="w-full text-xs gap-1.5">
                    <Send className="h-3.5 w-3.5 text-blue-600" />
                    <span>Draft Recruiter Message</span>
                  </Button>
                </Link>

                <Link href="/agent" className="flex-1">
                  <Button variant="gradient" className="w-full text-xs gap-1.5 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Ask AI Career Agent</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 text-sm">
              Select a job from the list to view requirements and AI match insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
