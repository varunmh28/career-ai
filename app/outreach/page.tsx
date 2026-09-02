"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Check,
  Copy,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  User,
  Loader2,
} from "lucide-react";

function OutreachContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") as Id<"jobs"> | null;

  const jobs = useQuery(api.jobs.list, {});
  const drafts = useQuery(api.outreach.listOutreachDrafts, {
    userId: "demo_alex_carter",
  });

  const [selectedJobId, setSelectedJobId] = useState<Id<"jobs"> | null>(
    initialJobId
  );
  const [tone, setTone] = useState<"confident" | "technical" | "concise" | "enthusiastic">("confident");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<{
    subject: string;
    body: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeJob =
    jobs?.find((j) => j._id === selectedJobId) || jobs?.[0];

  const handleGenerate = () => {
    if (!activeJob) return;
    setIsGenerating(true);

    setTimeout(() => {
      const recruiterName = activeJob.recruiter?.name
        ? activeJob.recruiter.name.split(" ")[0]
        : "there";
      const companyName = activeJob.company?.name || "your team";

      setGeneratedDraft({
        subject: `Next.js & AI Application Engineer — Alex Carter / ${activeJob.title}`,
        body: `Hi ${recruiterName},

I noticed that ${companyName} is expanding the engineering team for the ${activeJob.title} position.

Over the past few years, I've specialized in high-performance React and Next.js applications, recently diving deep into the Vercel AI SDK, streaming LLM outputs, and vector search with Convex.

Given ${companyName}'s focus on ${activeJob.requirements[0] || "modern engineering architectures"}, I would love to share how my background in modern frontend performance and agentic web apps can add immediate value.

Are you available for a brief 10-minute chat this week?

Best regards,
Alex Carter
alex.carter@example.com | github.com/alexcarter-dev`,
      });
      setIsGenerating(false);
    }, 900);
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(
      `Subject: ${generatedDraft.subject}\n\n${generatedDraft.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          AI Recruiter Outreach & Direct Messages
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Craft personalized, high-conversion direct messages to technical recruiters at Vercel, Linear, and Supabase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Controls (5 cols on lg+) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Select Opening & Configure Tone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              {/* Job Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Job Opening
                </label>
                <select
                  value={selectedJobId || activeJob?._id || ""}
                  onChange={(e) =>
                    setSelectedJobId(e.target.value as Id<"jobs">)
                  }
                  className="w-full h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-900 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
                >
                  {jobs?.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.company?.name} — {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Recruiter Preview */}
              {activeJob?.recruiter && (
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-1 ring-blue-200 dark:ring-blue-800">
                    <AvatarImage src={activeJob.recruiter.avatarUrl} />
                    <AvatarFallback>
                      {activeJob.recruiter.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs font-bold text-blue-950 dark:text-blue-100">
                      {activeJob.recruiter.name}
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-300">
                      {activeJob.recruiter.title}
                    </div>
                  </div>
                </div>
              )}

              {/* Tone Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Outreach Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["confident", "technical", "concise", "enthusiastic"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`p-2.5 rounded-xl border text-xs font-medium capitalize transition cursor-pointer text-center ${
                          tone === t
                            ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !activeJob}
                variant="gradient"
                className="w-full text-xs font-bold gap-1.5 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Tailored Pitch...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Outreach</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Message & Saved Drafts (7 cols on lg+) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
                <Mail className="h-4 w-4 text-emerald-600" />
                Message Preview
              </CardTitle>
              {generatedDraft && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3">
              {generatedDraft ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={generatedDraft.subject}
                      onChange={(e) =>
                        setGeneratedDraft({
                          ...generatedDraft,
                          subject: e.target.value,
                        })
                      }
                      className="w-full h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">
                      Message Body
                    </label>
                    <Textarea
                      value={generatedDraft.body}
                      onChange={(e) =>
                        setGeneratedDraft({
                          ...generatedDraft,
                          body: e.target.value,
                        })
                      }
                      rows={11}
                      className="text-xs leading-relaxed font-sans"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-zinc-400 space-y-2">
                  <Mail className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p>Select a job opening on the left and click "Generate AI Outreach".</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Drafts List */}
          {drafts && drafts.length > 0 && (
            <Card className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Saved Outreach Drafts ({drafts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-2">
                {drafts.map((d) => (
                  <div
                    key={d._id}
                    className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                      <span>{d.subject}</span>
                      <Badge variant="secondary" className="text-[9px] uppercase">
                        {d.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">
                      {d.body}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OutreachPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-500">
          Loading outreach workbench...
        </div>
      }
    >
      <OutreachContent />
    </Suspense>
  );
}
