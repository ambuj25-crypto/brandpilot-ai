import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_NAME = "gemini-3.1-flash-lite";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 s, 4 s, 8 s

/**
 * Classifies an error thrown by the Gemini SDK and re-throws a
 * user-friendly message where appropriate.
 */
function classifyError(error: any): never {
  const message: string = error?.message || String(error) || "Unknown error";
  const lower = message.toLowerCase();

  if (lower.includes("leaked") || lower.includes("api_key_invalid")) {
    throw new Error(
      "SECURITY ALERT: Your API Key was leaked and disabled by Google. You must generate a new one."
    );
  }

  // Surface the raw message so callers can inspect status codes
  throw new Error(message);
}

/**
 * Wraps any async Gemini call with exponential-backoff retry logic.
 * Retries up to MAX_RETRIES times on 429 (rate-limit) errors.
 */
export async function withBackoff<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      const message: string = error?.message || String(error) || "";
      const lower = message.toLowerCase();

      // Never retry security/forbidden errors
      if (lower.includes("leaked") || lower.includes("api_key_invalid")) {
        classifyError(error);
      }

      const isRateLimit =
        lower.includes("429") ||
        lower.includes("quota") ||
        lower.includes("rate limit") ||
        lower.includes("resource_exhausted");

      if (isRateLimit && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[Gemini] Rate-limited. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES})…`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
        continue;
      }

      classifyError(error);
    }
  }
}

export async function generateSocialPost(prompt: string, context: any) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const systemInstruction = `You are an expert social media manager. Use the provided business context (Name, Industry, Target Audience, Tone) to write a highly engaging social media post. Return the response formatted clearly with a 'Caption:' section and a 'Hashtags:' section.`;

  const businessContextStr = `
Business Name: ${context.name || "N/A"}
Industry: ${context.industry || "N/A"}
Target Audience: ${context.target_audience || "N/A"}
Tone: ${context.tone || "N/A"}
  `.trim();

  const fullPrompt = `
${systemInstruction}

Business Context:
${businessContextStr}

User Request:
${prompt}
  `.trim();

  return withBackoff(async () => {
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  });
}