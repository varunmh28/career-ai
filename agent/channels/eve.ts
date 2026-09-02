import { type AuthFn, localDev, vercelOidc, withAuthChallenges } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";
import { createClerkClient } from "@clerk/backend";

function getClerkClient() {
  if (
    typeof process !== "undefined" &&
    !process.env.CLERK_SECRET_KEY &&
    typeof process.loadEnvFile === "function"
  ) {
    try {
      process.loadEnvFile(".env.local");
    } catch {}
  }

  return createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
}

export function clerkAuth(): AuthFn<Request> {
  return withAuthChallenges(
    async (request: Request) => {
      try {
        const clerk = getClerkClient();
        const requestState = await clerk.authenticateRequest(request);
        if (!requestState.isSignedIn) {
          return null;
        }

        const auth = requestState.toAuth();
        return {
          attributes: {
            sessionId: auth.sessionId ?? "",
          },
          authenticator: "oidc",
          issuer: "https://clerk.com",
          principalId: auth.userId,
          principalType: "user",
          subject: auth.userId,
        };
      } catch (err) {
        console.error("Clerk route auth error in eve channel:", err);
        return null;
      }
    },
    [{ scheme: "Bearer" }]
  );
}

export default eveChannel({
  auth: [clerkAuth(), vercelOidc(), localDev()],
});
