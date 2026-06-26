import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import { withBackoff } from "@/utils/gemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_NAME = "gemini-3.1-flash-lite";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { history, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch user's business context
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const businessContext = business
      ? `Business Name: ${business.name || "N/A"}\nIndustry: ${business.industry || "N/A"}\nTarget Audience: ${business.target_audience || "N/A"}\nTone: ${business.tone || "N/A"}`
      : "No business profile set up yet.";

    const systemInstruction = `You are a proactive Social Media Strategist. Use the business context provided below. Your goal is to help the user plan a content schedule. First, suggest ideas. Then, ask for specific details like pricing or timelines. Work with them until you have a solid plan.

Business Context:
${businessContext}`;

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction,
    });

    // Map frontend message history to Gemini's expected format
    const geminiHistory = (history || []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    const responseText = await withBackoff(async () => {
      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(message);
      return result.response.text();
    });

    return NextResponse.json({ success: true, text: responseText });
  } catch (error: any) {
    console.error("[Chat API] Error:", error);
    const message: string = error?.message || "Failed to get a response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
