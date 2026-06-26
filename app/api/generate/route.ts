import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateSocialPost } from "@/utils/gemini";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Fetch the user's business context
    const { data: businessContext, error: dbError } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (dbError) {
      console.error("Error fetching business context:", dbError);
      // We can proceed with an empty context if the business profile doesn't exist yet
    }

    const generatedText = await generateSocialPost(prompt, businessContext || {});

    return NextResponse.json({ success: true, text: generatedText });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
