"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

/**
 * Delete the currently authenticated user's account.
 *
 * This requires the SUPABASE_SERVICE_ROLE_KEY env var because
 * `admin.deleteUser()` uses the admin/service-role API.
 *
 * Add this to your .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *
 * You can find it in:
 *   Supabase Dashboard → Project Settings → API → service_role (secret)
 */
export async function deleteAccount(): Promise<{ error?: string }> {
  // 1. Get the current user from the request cookies
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  // 2. Use the service-role client to delete the user
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return {
      error:
        "Server configuration error: SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "Add it to .env.local from Supabase Dashboard → Project Settings → API.",
    };
  }

  const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: error.message };
  }

  // 3. Sign out the local session and redirect to login
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login");
}
