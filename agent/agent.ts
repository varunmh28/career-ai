import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { defineAgent } from "eve";

function resolveApiKey(): string | undefined {
  if (typeof process !== "undefined") {
    if (
      !process.env.GEMINI_API_KEY &&
      !process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
      !process.env.GOOGLE_API_KEY
    ) {
      if (typeof process.loadEnvFile === "function") {
        try {
          process.loadEnvFile(".env.local");
        } catch {}
      }
    }
    const key =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (key && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = key;
    }
    return key;
  }
  return undefined;
}

const google = createGoogleGenerativeAI({
  get apiKey() {
    return resolveApiKey();
  },
});

export default defineAgent({
  model: google("gemini-2.5-flash"),
});
