"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ─────────────────────────────────────────────────────────────────────
export type ScheduledPost = {
  id: string;
  user_id: string;
  content: string;
  scheduled_date: string; // ISO timestamp
  platform: string;
};

// ── Fetch all posts for the logged-in user, ordered by date ───────────────────
export async function getScheduledPosts(): Promise<ScheduledPost[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: true });

  if (error || !data) return [];

  return data as ScheduledPost[];
}

// ── Insert a new scheduled post ───────────────────────────────────────────────
export async function saveScheduledPost(
  content: string,
  date: string,
  platform: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  if (!content.trim()) return { error: "Content is required." };
  if (!date) return { error: "Date is required." };
  if (!platform) return { error: "Platform is required." };

  const { error } = await supabase.from("scheduled_posts").insert({
    user_id: user.id,
    content: content.trim(),
    scheduled_date: new Date(date).toISOString(),
    platform,
  });

  if (error) return { error: error.message };

  revalidatePath("/calendar");
  return { success: true };
}
