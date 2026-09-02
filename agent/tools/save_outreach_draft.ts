import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
import { convexClient, api } from "../lib/convex";
import { Id } from "../../convex/_generated/dataModel";

export default defineTool({
  description:
    "Saves a generated recruiter outreach draft to Convex. REQUIRES USER APPROVAL before saving.",
  approval: always(),
  inputSchema: z.object({
    jobId: z.string().describe("Target job ID in Convex."),
    recruiterId: z.string().optional().describe("Recruiter ID if available."),
    subject: z.string().describe("Email subject line."),
    body: z.string().describe("Message body text."),
    tone: z.string().default("confident").describe("Selected tone."),
    userId: z.string().optional().describe("Candidate user ID."),
  }),
  async execute(input, ctx) {
    const principalId = ctx?.session?.auth?.current?.principalId;
    const targetUserId = input.userId || principalId || "demo_alex_carter";

    const draftId = await convexClient.mutation(api.outreach.saveOutreachDraft, {
      userId: targetUserId,
      jobId: input.jobId as Id<"jobs">,
      recruiterId: input.recruiterId ? (input.recruiterId as Id<"recruiters">) : undefined,
      subject: input.subject,
      body: input.body,
      tone: input.tone,
    });

    return {
      success: true,
      draftId,
      message: "Outreach message successfully saved to your drafts after user approval.",
      details: {
        subject: input.subject,
        tone: input.tone,
      },
    };
  },
});
