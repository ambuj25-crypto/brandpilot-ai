"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/actions/auth";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    // Confirmation dialog — prevents accidental clicks
    const confirmed = confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    const result = await deleteAccount();

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, the server action redirects to /login
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        id="delete-account-button"
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Deleting…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Account
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs max-w-[240px] text-right">{error}</p>
      )}
    </div>
  );
}
