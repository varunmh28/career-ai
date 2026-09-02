import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 md:py-24 bg-zinc-50 dark:bg-black font-sans">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Powered by Vercel Eve & Google Gemini
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Supercharge your career with an autonomous AI advisor
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Get real-time job market insights, resume review, and interview prep backed by
          durable backend AI agent sessions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/chat"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-medium text-sm transition shadow-sm cursor-pointer"
          >
            Start Career Consultation →
          </Link>
          <a
            href="https://eve.dev/docs/guides/frontend/nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium text-sm transition cursor-pointer"
          >
            Eve Docs
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
            <div className="text-xl mb-2">📊</div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Live Market Insights
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Autonomous tool calls query in-demand skills and trending focus areas.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
            <div className="text-xl mb-2">⚡</div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Durable Streaming
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Backed by Eve sessions that persist across reloads and stream responses.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
            <div className="text-xl mb-2">🎯</div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              Tailored Guidance
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Actionable advice for technical interviews, resumes, and career transitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
