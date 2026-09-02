import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { defineAgent } from "eve";

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY,
});

export default defineAgent({
  model: google("gemini-2.5-flash"),
});
