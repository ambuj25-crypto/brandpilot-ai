"use client";

import { useState, useTransition } from "react";
import { saveScheduledPost } from "@/app/actions/calendar";
import type { ScheduledPost } from "@/app/actions/calendar";
import {
  Calendar,
  Smartphone,
  MessageSquare,
  Briefcase,
  Users,
  Globe,
  PlusCircle,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLATFORMS = ["Instagram", "Twitter / X", "LinkedIn", "Facebook", "Other"] as const;

function platformIcon(platform: string) {
  const cls = "h-4 w-4";
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Smartphone className={cls} />;
    case "twitter / x":
    case "twitter":
      return <MessageSquare className={cls} />;
    case "linkedin":
      return <Briefcase className={cls} />;
    case "facebook":
      return <Users className={cls} />;
    default:
      return <Globe className={cls} />;
  }
}

function platformColor(platform: string): string {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300";
    case "twitter / x":
    case "twitter":
      return "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-300";
    case "linkedin":
      return "from-blue-600/20 to-blue-800/20 border-blue-500/30 text-blue-300";
    case "facebook":
      return "from-blue-500/20 to-indigo-600/20 border-blue-400/30 text-blue-200";
    default:
      return "from-slate-500/20 to-slate-700/20 border-slate-500/30 text-slate-300";
  }
}

function formatDay(isoDate: string): { weekday: string; date: string; time: string } {
  const d = new Date(isoDate);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

/** Groups posts by calendar date (YYYY-MM-DD) */
function groupByDate(posts: ScheduledPost[]): Map<string, ScheduledPost[]> {
  const map = new Map<string, ScheduledPost[]>();
  for (const post of posts) {
    const key = new Date(post.scheduled_date).toISOString().slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(post);
  }
  return map;
}

// ── Add Post Form ─────────────────────────────────────────────────────────────

function AddPostForm({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    startTransition(async () => {
      const result = await saveScheduledPost(content, date, platform);
      if (result.error) {
        setStatus("error");
        setErrorMsg(result.error);
      } else {
        setStatus("success");
        setContent("");
        setDate("");
        setPlatform(PLATFORMS[0]);
        setTimeout(() => {
          setStatus("idle");
          setOpen(false);
          onSuccess();
        }, 1200);
      }
    });
  };

  return (
    <div className="mb-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Schedule New Post
        </button>
      ) : (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-purple-400" />
            Schedule a New Post
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Write your caption and hashtags here…"
                required
                className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* Date + Platform row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Platform
                </label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p} className="bg-[#1a1a24]">
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Feedback */}
            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-none" />
                {errorMsg}
              </p>
            )}
            {status === "success" && (
              <p className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 flex-none" />
                Post scheduled!
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending ? "Saving…" : "Save Post"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: ScheduledPost }) {
  const { time } = formatDay(post.scheduled_date);
  const colors = platformColor(post.platform);
  const isUpcoming = new Date(post.scheduled_date) > new Date();

  return (
    <div
      className={`relative flex gap-4 bg-gradient-to-br ${colors} border rounded-xl p-4 backdrop-blur-sm hover:scale-[1.01] transition-all duration-200`}
    >
      {/* Platform badge */}
      <div className="flex-none flex flex-col items-center gap-1 pt-0.5">
        {platformIcon(post.platform)}
        <span className="text-[10px] font-medium opacity-80 whitespace-nowrap">
          {post.platform.split(" ")[0]}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/90 leading-relaxed line-clamp-3 break-words">
          {post.content}
        </p>
      </div>

      {/* Time + status */}
      <div className="flex-none flex flex-col items-end gap-1.5 text-right">
        <span className="flex items-center gap-1 text-xs text-white/50">
          <Clock className="h-3 w-3" />
          {time}
        </span>
        {isUpcoming && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Calendar Client Component ────────────────────────────────────────────

interface CalendarClientProps {
  initialPosts: ScheduledPost[];
}

export default function CalendarClient({ initialPosts }: CalendarClientProps) {
  // We refresh by re-triggering a router refresh after a save
  const [posts] = useState<ScheduledPost[]>(initialPosts);

  const grouped = groupByDate(posts);
  const dateKeys = Array.from(grouped.keys()).sort();
  const isEmpty = dateKeys.length === 0;

  return (
    <>
      <AddPostForm onSuccess={() => window.location.reload()} />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-base font-medium">No posts scheduled yet</p>
          <p className="text-slate-600 text-sm mt-1">
            Click "Schedule New Post" above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {dateKeys.map((key) => {
            const dayPosts = grouped.get(key)!;
            const { weekday, date } = formatDay(dayPosts[0].scheduled_date);
            const isToday =
              new Date(key).toDateString() === new Date().toDateString();

            return (
              <div key={key}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isToday
                        ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                        : "bg-white/5 border border-white/10 text-slate-400"
                      }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {isToday ? "Today" : weekday} · {date}
                  </div>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-slate-600">
                    {dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Post cards */}
                <div className="space-y-3">
                  {dayPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
