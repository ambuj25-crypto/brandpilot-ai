"use client";

import { useState } from "react";
import type { BusinessProfile } from "@/app/actions/business";
import BusinessContextForm from "@/components/BusinessContextForm";

type Props = {
  profile: BusinessProfile;
};

export default function BusinessProfileCard({ profile }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <BusinessContextForm
        existing={profile}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Brand Profile</h2>
            <p className="text-xs text-slate-400">
              Your AI content generation context
            </p>
          </div>
        </div>
        <button
          id="edit-profile-button"
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 hover:border-violet-500/30 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Business Name */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
            Business Name
          </p>
          <p className="text-white font-semibold text-sm">
            {profile.name || "—"}
          </p>
        </div>

        {/* Industry */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
            Industry
          </p>
          <p className="text-white font-semibold text-sm">
            {profile.industry || "—"}
          </p>
        </div>

        {/* Target Audience */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 sm:col-span-2">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
            Target Audience
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {profile.target_audience || "—"}
          </p>
        </div>

        {/* Tone */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 sm:col-span-2">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
            Tone of Voice
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-300 text-sm font-medium capitalize">
            {profile.tone || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
