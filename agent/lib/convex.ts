import { ConvexHttpClient } from "convex/browser";
import { api, internal } from "../../convex/_generated/api";

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  process.env.CONVEX_CLOUD_URL ||
  "https://fast-wolverine-268.convex.cloud";

export const convexClient = new ConvexHttpClient(convexUrl);
export { api, internal };
