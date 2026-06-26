import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getScheduledPosts } from "@/app/actions/calendar";
import CalendarClient from "@/components/CalendarClient";
import { CalendarDays, LayoutDashboard, Sparkles } from "lucide-react";

export const metadata = {
  title: "Content Calendar · ContentAI",
  description: "Visualize and manage your upcoming scheduled social media posts.",
};

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const posts = await getScheduledPosts();

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* ── Top nav ─────────────────────────────────────────────────────────── */}
      <nav className="border-b border-white/8 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">ContentAI</span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/studio"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              AI Studio
            </Link>
            <Link
              href="/calendar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white bg-white/8 font-medium"
            >
              <CalendarDays className="h-4 w-4 text-purple-400" />
              Calendar
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-10 relative">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
          <p className="text-purple-400 text-sm font-medium mb-2">Upcoming Content</p>
          <h1 className="text-4xl font-bold text-white mb-3">
            Content{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Calendar
            </span>
          </h1>
          <p className="text-slate-400 text-base">
            Schedule posts across platforms and visualize your content pipeline.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Total Scheduled",
              value: posts.length,
              color: "from-violet-500/20 to-violet-500/5",
            },
            {
              label: "Upcoming",
              value: posts.filter((p) => new Date(p.scheduled_date) > new Date()).length,
              color: "from-emerald-500/20 to-emerald-500/5",
            },
            {
              label: "Platforms",
              value: new Set(posts.map((p) => p.platform)).size || 0,
              color: "from-cyan-500/20 to-cyan-500/5",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-gradient-to-br ${s.color} border border-white/10 rounded-xl p-4 text-center`}
            >
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Calendar client (form + timeline) */}
        <CalendarClient initialPosts={posts} />
      </main>
    </div>
  );
}
