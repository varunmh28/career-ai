import CareerChat from "@/components/CareerChat";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-8 md:py-12 bg-zinc-50 dark:bg-black font-sans">
      <div className="max-w-4xl w-full text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Powered by Vercel Eve, Google Gemini & Clerk Auth
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Supercharge your career with an autonomous AI advisor
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Real-time job market insights, resume review, and interview prep backed by
          durable backend AI agent sessions.
        </p>

        {/* Embedded Chat UI directly on home page */}
        <CareerChat />

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
            <div className="text-xl mb-1.5">📊</div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Live Market Insights
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Autonomous tool calls query in-demand skills and trending focus areas.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
            <div className="text-xl mb-1.5">⚡</div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Durable Streaming
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Backed by Eve sessions that persist across reloads and stream responses.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
            <div className="text-xl mb-1.5">🔒</div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Authenticated & Secure
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Protected by Clerk session auth wired into the Eve channel route walk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
