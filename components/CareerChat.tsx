"use client";

import { useEveAgent } from "eve/react";
import { useState, useRef, useEffect } from "react";

const SUGGESTED_PROMPTS = [
  "What are the top in-demand skills for an AI Engineer in 2026?",
  "How should I structure a senior fullstack developer resume?",
  "Can you give me 3 practice behavioral interview questions?",
  "What skills should I learn to transition from backend to AI engineering?",
];

export default function CareerChat() {
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

  const handleQuickPrompt = async (promptText: string) => {
    if (isBusy || isResuming) return;
    try {
      await agent.send(promptText);
    } catch (err) {
      console.error("Failed to send quick prompt:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm min-h-[580px] my-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Career AI Advisor
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800">
              Vercel Eve
            </span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Durable AI agent for resume strategy, interview prep, and tech market insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span
              className={`w-2 h-2 rounded-full ${
                agent.status === "streaming"
                  ? "bg-emerald-500 animate-pulse"
                  : agent.status === "submitted"
                  ? "bg-amber-500 animate-pulse"
                  : agent.status === "error"
                  ? "bg-rose-500"
                  : "bg-zinc-400"
              }`}
            />
            <span className="capitalize">{agent.status}</span>
          </div>

          {agent.data.messages.length > 0 && (
            <button
              onClick={() => agent.reset()}
              disabled={isBusy}
              className="text-xs px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition disabled:opacity-50 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 max-h-[500px]">
        {agent.data.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xl mb-4 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              💼
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Ask your AI Career Advisor
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
              Get actionable career guidance, test technical roles, or check market trends.
            </p>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full text-left">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={isBusy || isResuming}
                  className="p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer text-left shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          agent.data.messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 capitalize">
                  {message.role === "user" ? "You" : "Career Advisor"}
                </span>
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-2xs ${
                  message.role === "user"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-xs"
                    : "bg-zinc-100/90 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 rounded-tl-xs"
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
                        className="mb-3 text-xs text-zinc-500 border border-zinc-300 dark:border-zinc-700 rounded p-2"
                      >
                        <summary className="cursor-pointer font-medium">
                          Agent Reasoning
                        </summary>
                        <div className="mt-1 whitespace-pre-wrap">{part.text}</div>
                      </details>
                    );
                  }

                  if (part.type === "dynamic-tool") {
                    return (
                      <div
                        key={pIdx}
                        className="my-2 p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono"
                      >
                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                          <span>⚡ Tool:</span>
                          <span>{part.toolName}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
                            {part.state}
                          </span>
                        </div>
                        {"output" in part && Boolean(part.output) ? (
                          <pre className="mt-1 overflow-x-auto text-[11px] text-zinc-700 dark:text-zinc-300 p-1.5 bg-black/5 dark:bg-white/5 rounded">
                            {JSON.stringify(part.output, null, 2)}
                          </pre>
                        ) : null}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))
        )}

        {/* In-flight streaming indicator */}
        {agent.status === "streaming" && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 px-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Advisor is responding...</span>
          </div>
        )}

        {/* Error notification */}
        {agent.error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
            <span>Error: {agent.error.message}</span>
            <button
              onClick={() => agent.reset()}
              className="font-medium underline ml-2 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer form */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800"
      >
        <div className="relative flex items-center rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900 focus-within:border-zinc-900 dark:focus-within:border-zinc-300 transition shadow-xs">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isResuming}
            placeholder={
              isResuming
                ? "Resuming session..."
                : isBusy
                ? "Send a follow-up or correction..."
                : "Ask about careers, skills, resume advice, or interview prep..."
            }
            rows={1}
            className="w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {isBusy ? (
              <button
                type="button"
                onClick={() => void agent.cancel()}
                className="px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition cursor-pointer"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isResuming}
                className="px-3.5 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
