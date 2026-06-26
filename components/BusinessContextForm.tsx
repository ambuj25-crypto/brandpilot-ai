"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveBusinessProfile,
  type BusinessProfile,
} from "@/app/actions/business";

type Props = {
  /** Pass existing profile to pre-fill the form for editing */
  existing?: BusinessProfile | null;
  /** Called when user wants to cancel editing */
  onCancel?: () => void;
};

const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Funny",
  "Energetic",
  "Inspirational",
  "Casual",
  "Bold",
  "Educational",
];

export default function BusinessContextForm({ existing, onCancel }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await saveBusinessProfile(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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
          <h2 className="text-lg font-bold text-white">
            {existing ? "Edit Business Profile" : "Set Up Your Brand"}
          </h2>
          <p className="text-xs text-slate-400">
            {existing
              ? "Update your brand details below."
              : "Tell us about your business so AI can tailor content for you."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Name */}
        <div>
          <label
            htmlFor="business-name"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Business Name
          </label>
          <input
            id="business-name"
            name="name"
            type="text"
            required
            defaultValue={existing?.name ?? ""}
            placeholder="e.g. Acme Corp"
            className="w-full bg-white/5 border border-white/10 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
          />
        </div>

        {/* Industry / Niche */}
        <div>
          <label
            htmlFor="business-industry"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Industry / Niche
          </label>
          <input
            id="business-industry"
            name="industry"
            type="text"
            required
            defaultValue={existing?.industry ?? ""}
            placeholder="e.g. Health & Fitness, SaaS, E-commerce"
            className="w-full bg-white/5 border border-white/10 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
          />
        </div>

        {/* Target Audience */}
        <div>
          <label
            htmlFor="business-audience"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Target Audience
          </label>
          <textarea
            id="business-audience"
            name="target_audience"
            required
            rows={3}
            defaultValue={existing?.target_audience ?? ""}
            placeholder="e.g. Small business owners aged 25-40 who want to grow their social media presence"
            className="w-full bg-white/5 border border-white/10 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 resize-none"
          />
        </div>

        {/* Tone of Voice */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tone of Voice
          </label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((t) => (
              <label key={t} className="cursor-pointer">
                <input
                  type="radio"
                  name="tone"
                  value={t.toLowerCase()}
                  defaultChecked={
                    existing?.tone
                      ? existing.tone.toLowerCase() === t.toLowerCase()
                      : t === "Professional"
                  }
                  className="peer sr-only"
                />
                <span className="block px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 peer-checked:bg-violet-600 peer-checked:border-violet-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-violet-600/30 bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20">
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <svg
              className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <svg
              className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-emerald-400 text-xs">
              Business profile saved successfully!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving…
              </span>
            ) : existing ? (
              "Update Profile"
            ) : (
              "Save & Continue"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
