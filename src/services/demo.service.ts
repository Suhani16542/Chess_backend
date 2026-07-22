import { DemoLead, IDemoLead } from "../models/DemoLead.model";
import { DemoLeadInput } from "../validations/demo.validation";
import {
  sendAdminLeadEmail,
  sendUserConfirmationEmail,
} from "./email.service";
import { adminLeadTemplate } from "../templates/adminLeadTemplate";
import { userConfirmationTemplate } from "../templates/userConfirmationTemplate";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { ApiError } from "../utils/ApiError";

export interface CreateDemoLeadResult {
  lead: IDemoLead;
  emailResults: { adminEmail: boolean; userEmail: boolean };
}

/**
 * Business logic for the demo lead module.
 * 1. Saves the lead to MongoDB.
 * 2. Dispatches admin + student emails sequentially.
 * 3. Returns result — email failures are non-blocking.
 */
export const createDemoLead = async (
  input: DemoLeadInput
): Promise<CreateDemoLeadResult> => {
  // Check for existing lead with same email to avoid duplicates
  const existing = await DemoLead.findOne({ email: input.email }).lean();
  if (existing) {
    throw ApiError.conflict(
      "A demo request with this email already exists. Our team will contact you soon."
    );
  }

  // Save lead to database
  const lead = await DemoLead.create(input);
  logger.info(`[DemoService] New demo lead saved. ID: ${lead._id}, Email: ${lead.email}`);

  const submittedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  const academyEmails = env.ACADEMY_EMAIL.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  const adminResult = await sendAdminLeadEmail(
    academyEmails,
    `New Demo Request from ${input.studentName} — ${input.city}`,
    adminLeadTemplate({
      studentName: input.studentName,
      parentName: input.parentName,
      email: input.email,
      phone: input.phone,
      age: input.age,
      city: input.city,
      chessExperience: input.chessExperience,
      preferredTime: input.preferredTime,
      message: input.message,
      submittedAt,
    })
  );

  const userResult = await sendUserConfirmationEmail(
    input.email,
    `Demo Class Confirmed — ${input.studentName} | Chess Academy`,
    userConfirmationTemplate({
      studentName: input.studentName,
      parentName: input.parentName,
      preferredTime: input.preferredTime,
      chessExperience: input.chessExperience,
    }),
    env.ACADEMY_EMAIL
  );

  return {
    lead,
    emailResults: {
      adminEmail: adminResult.success,
      userEmail: userResult.success,
    },
  };
};
