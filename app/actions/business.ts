"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ────────────────────────────────────────────────────────────────────
export type BusinessProfile = {
  id: string;
  user_id: string;
  name: string | null;
  industry: string | null;
  target_audience: string | null;
  tone: string | null;
  created_at: string;
};

// ── Get Business Profile ─────────────────────────────────────────────────────
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return data as BusinessProfile;
}

// ── Save Business Profile (upsert) ──────────────────────────────────────────
export async function saveBusinessProfile(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const target_audience = formData.get("target_audience") as string;
  const tone = formData.get("tone") as string;

  // Check if a profile already exists for this user
  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // UPDATE existing row
    const { error } = await supabase
      .from("businesses")
      .update({ name, industry, target_audience, tone })
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    // INSERT new row
    const { error } = await supabase
      .from("businesses")
      .insert({ user_id: user.id, name, industry, target_audience, tone });

    if (error) return { error: error.message };
  }

  // Revalidate the dashboard so it picks up the new data
  revalidatePath("/dashboard");
  return { success: true };
}
