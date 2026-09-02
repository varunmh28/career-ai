"use client";

import { useEveAgent } from "eve/react";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Send,
  RotateCcw,
  Check,
  X,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  Briefcase,
} from "lucide-react";

const SUGGESTIONS = [
  {
    title: "1. Match with Live Tech Jobs",
    prompt: "Scan all 20+ live tech jobs and rank the top vector similarity matches for Alex Carter.",
    icon: "🎯",
  },
  {
    title: "2. Optimize Alex's Profile",
    prompt: "Generate an optimized profile rewrite for Alex Carter targeting the Next.js & AI Engineer role, including headline, about section, and new skills.",
    icon: "✨",
  },
  {
    title: "3. Recruiter Outreach Message",
    prompt: "Draft a personalized direct message to Sarah Jenkins (Recruiter @ Vercel) for the Next.js & AI Systems Engineer role.",
    icon: "✉️",
  },
  {
    title: "4. 90-Day Career Transition Plan",
    prompt: "Create a 90-day transition roadmap for Alex Carter to become a Senior Next.js AI Engineer, with weekly milestones and deliverables.",
    icon: "🚀",
  },
];

export default function AgentPage() {
  const agent = useEveAgent();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const isResuming = agent.status === "resuming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agent.data.messages, agent.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isResuming) return;
    setInput("");
    try {
      await agent.send(text, isBusy ? { turnPolicy: "steer" } : undefined);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSuggestion = async (promptText: string) => {
    if (isBusy || isResuming) return;
    try {
      await agent.send(promptText);
    } catch (err) {
      console.error("Failed to send prompt:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="pro" className="text-[10px] px-2 py-0.5">
              PRO AGENT
            </Badge>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-blue-600" />
              CareerPrime AI Agent Workspace
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Powered by Vercel Eve durable execution, Convex 768-D Vector Search & Google Gemini
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                agent.status === "streaming"
                  ? "bg-emerald-500 animate-pulse"
                  : agent.status === "submitted"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-zinc-400"
              }`}
            />
            <span className="capitalize">{agent.status}</span>
          </div>

          {agent.data.messages.length > 0 && (
            <Button
              onClick={() => agent.reset()}
              disabled={isBusy}
              variant="outline"
              size="sm"
              className="text-xs gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-[420px] max-h-[600px]">
          {agent.data.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md mb-3">
                💼
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Alex Carter Career Transition Assistant
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mb-6 leading-relaxed">
                Execute live profile rewrites, vector match candidate skills against 20+ jobs, draft recruiter outreach, and save plans with human approval.
              </p>

              {/* Quick suggestion prompt cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl w-full text-left">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(s.prompt)}
                    disabled={isBusy || isResuming}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-700 bg-zinc-50/70 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800/80 transition text-left cursor-pointer shadow-2xs group"
                  >
                    <div className="font-bold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 transition flex items-center gap-1.5 mb-1">
                      <span>{s.icon}</span>
                      <span>{s.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {s.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            agent.data.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role !== "user" && (
                  <Avatar className="h-8 w-8 ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                      CP
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-xs shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200 border border-zinc-200/70 dark:border-zinc-700/60 rounded-tl-xs shadow-2xs"
                  }`}
                >
                  {message.parts.map((part, pIdx) => {
                    if (part.type === "text") {
                      return (
                        <div key={pIdx} className="whitespace-pre-wrap">
                          {part.text}
                        </div>
                      );
                    }

                    if (part.type === "reasoning") {
                      return (
                        <details
                          key={pIdx}
                          className="mb-2 text-[11px] text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-white/50 dark:bg-black/20"
                        >
                          <summary className="cursor-pointer font-semibold">
                            Agent Reasoning & Strategy
                          </summary>
                          <div className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                            {part.text}
                          </div>
                        </details>
                      );
                    }

                    if (part.type === "dynamic-tool") {
                      return (
                        <div
                          key={pIdx}
                          className="my-2 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                            <span className="flex items-center gap-1.5">
                              <span>⚡ Tool:</span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {part.toolName}
                              </span>
                            </span>
                            <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
                              {part.state}
                            </span>
                          </div>

                          {"output" in part && Boolean(part.output) ? (
                            <pre className="mt-1 overflow-x-auto text-[11px] text-zinc-700 dark:text-zinc-300 p-2 bg-black/5 dark:bg-white/5 rounded-lg max-h-48">
                              {JSON.stringify(part.output, null, 2)}
                            </pre>
                          ) : null}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0 mt-0.5">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}

          {agent.status === "streaming" && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 px-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              <span>Career Agent is synthesizing guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
        >
          <div className="relative flex items-center rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition shadow-2xs">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isResuming}
              placeholder={
                isBusy
                  ? "Steer agent or send follow-up..."
                  : "Ask about jobs, profile rewrites, outreach drafts, or skill roadmaps..."
              }
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              {isBusy ? (
                <Button
                  type="button"
                  onClick={() => void agent.cancel()}
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs font-bold"
                >
                  Stop
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim() || isResuming}
                  variant="primary"
                  size="sm"
                  className="h-8 text-xs gap-1 font-bold"
                >
                  <span>Send</span>
                  <Send className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
