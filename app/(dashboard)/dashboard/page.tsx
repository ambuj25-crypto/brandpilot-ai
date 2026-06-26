import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles, LayoutDashboard } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { getBusinessProfile } from "@/app/actions/business";
import BusinessContextForm from "@/components/BusinessContextForm";
import BusinessProfileCard from "@/components/BusinessProfileCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "there";

  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  // Fetch the business profile for the current user
  const businessProfile = await getBusinessProfile();

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* Top nav */}
      <nav className="border-b border-white/8 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">ContentAI</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white bg-white/8 font-medium"
            >
              <LayoutDashboard className="h-4 w-4 text-violet-400" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-slate-300 max-w-[160px] truncate">{user.email}</span>
            </div>
            <SignOutButton />
            <DeleteAccountButton />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome header */}
        <div className="mb-12 relative">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
          <p className="text-violet-400 text-sm font-medium mb-2">Welcome back 👋</p>
          <h1 className="text-4xl font-bold text-white mb-3">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{displayName}</span>!
          </h1>
          <p className="text-slate-400 text-lg">
            {businessProfile
              ? "Your workspace is ready. Start creating AI-powered content."
              : "Let\u2019s set up your brand profile so AI can create content tailored to your business."}
          </p>
        </div>

        {/* ── Business Profile Section ───────────────────────────────────── */}
        <div className="mb-10">
          {businessProfile ? (
            <BusinessProfileCard profile={businessProfile} />
          ) : (
            <BusinessContextForm />
          )}

          <div className="mt-6">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Open AI Content Studio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Posts Scheduled", value: "0", icon: "📅", color: "from-violet-500/20 to-violet-500/5" },
            { label: "AI Credits Left", value: "100", icon: "⚡", color: "from-cyan-500/20 to-cyan-500/5" },
            { label: "Connected Accounts", value: "0", icon: "🔗", color: "from-indigo-500/20 to-indigo-500/5" },
            { label: "Total Impressions", value: "—", icon: "📈", color: "from-emerald-500/20 to-emerald-500/5" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:border-white/20 transition-all duration-200`}
            >
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Account info card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-lg">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-slate-400 text-sm">Email</span>
              <span className="text-white text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-slate-400 text-sm">User ID</span>
              <span className="text-slate-300 text-xs font-mono bg-white/5 px-2 py-1 rounded-lg">
                {user.id.slice(0, 8)}…
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 text-sm">Auth Provider</span>
              <span className="text-white text-sm font-medium capitalize">
                {user.app_metadata?.provider ?? "email"}
              </span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 pt-5 border-t border-red-500/10">
            <h3 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-3">Danger Zone</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Delete your account</p>
                <p className="text-xs text-slate-500">Permanently remove your account and all data.</p>
              </div>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
