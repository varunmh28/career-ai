"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Building2,
  Calendar,
  CheckCircle2,
  MapPin,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const username = (params?.username as string) || "alex-carter";

  const profile = useQuery(api.profiles.getProfileByUsername, {
    username,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [optimizerOutput, setOptimizerOutput] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  const addSkillMutation = useMutation(api.profiles.addSkill);
  const updateProfileMutation = useMutation(api.profiles.updateProfile);

  const handleImproveWithAI = async () => {
    setIsOptimizing(true);
    setShowOptimizerModal(true);

    // Simulate AI generation / structured response
    setTimeout(() => {
      setOptimizerOutput({
        headline:
          "Next.js & Fullstack AI Engineer | React 19, Vercel AI SDK, TypeScript | Building Resilient Agentic Web Apps",
        about:
          "Passionate Fullstack & AI Application Engineer specializing in Next.js 16 App Router, React Server Components, and LLM-powered interfaces. Experienced in crafting streaming user experiences, integrating vector search & RAG workflows, and architecting resilient cloud backends with Convex & TypeScript.\n\nConstantly exploring the frontier of autonomous agent workflows, human-in-the-loop systems, and scalable fullstack software.",
        skillsToAdd: [
          "Next.js App Router",
          "TypeScript",
          "Vercel AI SDK",
          "Vector Embeddings & RAG",
          "Convex",
          "Tailwind CSS",
          "LLM Tool Calling",
        ],
        bulletPoints: [
          "Architected reactive AI web applications utilizing Next.js 16 Server Components, streaming LLM completions, and vector similarity search.",
          "Engineered real-time client-server synchronization layers with Convex, decreasing data latency by 45% across active user sessions.",
          "Spearheaded conversion of legacy React UI components into modern, accessible Shadcn/Tailwind design system modules.",
        ],
      });
      setIsOptimizing(false);
    }, 1200);
  };

  const handleApproveAndApply = async () => {
    if (!profile || !optimizerOutput) return;
    setIsApplying(true);
    try {
      await updateProfileMutation({
        userId: profile.userId,
        headline: optimizerOutput.headline,
        about: optimizerOutput.about,
        targetRole: "Next.js AI Engineer",
      });

      for (const sk of optimizerOutput.skillsToAdd) {
        await addSkillMutation({
          userId: profile.userId,
          name: sk,
          category: "AI & Modern Engineering",
        });
      }

      setShowOptimizerModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim() || !profile) return;

    await addSkillMutation({
      userId: profile.userId,
      name: newSkillInput.trim(),
    });
    setNewSkillInput("");
    setShowAddSkillModal(false);
  };

  if (profile === undefined) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-48 rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-64 rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Profile not found</h2>
        <p className="text-zinc-500 text-sm mt-1">The requested user profile does not exist.</p>
        <Link href="/" className="mt-4 inline-block">
          <Button size="sm">Return to Feed</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        {/* Banner Cover */}
        <div className="h-40 sm:h-52 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700 relative">
          <div className="absolute inset-0 bg-black/15" />
        </div>

        <CardContent className="p-6 sm:p-8 pt-0 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-white dark:ring-zinc-900 shadow-xl">
                <AvatarImage
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop"}
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {profile.fullName}
                  </h1>
                  <Badge variant="pro" className="text-[10px] py-0 px-2">
                    PRO
                  </Badge>
                </div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-xl leading-snug">
                  {profile.headline}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    {profile.location}
                  </span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Target: {profile.targetRole || "Next.js AI Engineer"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <Button
                onClick={handleImproveWithAI}
                variant="gradient"
                className="gap-2 font-bold text-xs sm:text-sm shadow-md flex-1 sm:flex-initial"
              >
                <Sparkles className="h-4 w-4" />
                <span>Improve with AI</span>
              </Button>
              <Link href="/agent">
                <Button variant="outline" size="sm" className="text-xs">
                  Chat Agent
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile Strength & Completeness Card */}
          <div className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Profile Completeness & AI Optimization Score
                </span>
                <span className="font-extrabold text-blue-600">
                  {profile.completenessScore || 62}%
                </span>
              </div>
              <Progress
                value={profile.completenessScore || 62}
                className="h-2"
                indicatorClassName={
                  (profile.completenessScore || 62) > 80
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }
              />
            </div>
            <Button
              onClick={handleImproveWithAI}
              variant="outline"
              size="sm"
              className="text-xs shrink-0 gap-1 hover:text-blue-600"
            >
              <span>Boost Score to 95%</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            About & Career Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {profile.about}
          </p>
        </CardContent>
      </Card>

      {/* Experience History */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          {profile.experiences.map((exp) => (
            <div
              key={exp._id}
              className="flex items-start gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 last:pb-0"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 dark:border-blue-900">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {exp.title}
                </h4>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {exp.company} • {exp.location}
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1.5">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Skills & Endorsements ({profile.skills.length})
          </CardTitle>
          <Button
            onClick={() => setShowAddSkillModal(true)}
            variant="outline"
            size="sm"
            className="text-xs gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Skill</span>
          </Button>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {profile.skills.map((skill) => (
              <div
                key={skill._id}
                className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {skill.name}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {skill.category || "Engineering"}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">
                  {skill.endorsements} endorsements
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Profile Optimization Modal (Human in the loop diff preview) */}
      <Dialog open={showOptimizerModal} onOpenChange={setShowOptimizerModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="pro" className="text-[10px]">
                EVE AI OPTIMIZER
              </Badge>
              <DialogTitle className="text-base font-bold">
                Profile Transformation Preview
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Review AI-generated changes for Alex Carter before applying them to your live profile.
            </DialogDescription>
          </DialogHeader>

          {isOptimizing ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Eve Agent is analyzing 20+ live Next.js AI job requirements...
              </p>
            </div>
          ) : optimizerOutput ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto text-xs pr-1">
              {/* Headline Diff */}
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  New Optimized Headline
                </span>
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {optimizerOutput.headline}
                </p>
                <p className="text-[10px] text-zinc-400 line-through">
                  Old: {profile.headline}
                </p>
              </div>

              {/* About Diff */}
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  New About Section
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {optimizerOutput.about}
                </p>
              </div>

              {/* Recommended Skills */}
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  New Skills to Add ({optimizerOutput.skillsToAdd.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {optimizerOutput.skillsToAdd.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptimizerModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveAndApply}
              disabled={isApplying || isOptimizing}
              variant="gradient"
              size="sm"
              className="text-xs gap-1.5 font-bold cursor-pointer"
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Applying Changes...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve & Apply to Live Profile</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Skill Modal */}
      <Dialog open={showAddSkillModal} onOpenChange={setShowAddSkillModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Add a Skill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="e.g. Next.js, Vercel AI SDK, Convex, TypeScript"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-900 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <DialogFooter>
              <Button type="submit" size="sm" className="text-xs">
                Add Skill
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
