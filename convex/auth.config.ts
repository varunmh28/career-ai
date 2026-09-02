export default {
  providers: [
    {
      domain:
        process.env.CLERK_JWT_ISSUER_DOMAIN ||
        "https://holy-catfish-7590.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
