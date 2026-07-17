import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { createDemoLead } from "../services/demo.service";
import { DemoLeadInput } from "../validations/demo.validation";

/**
 * POST /api/demo
 * Submit a new demo class request.
 * Body is pre-validated and parsed by validate middleware.
 */
export const submitDemoLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = req.body as DemoLeadInput;

    const { lead, emailResults } = await createDemoLead(input);

    const response = ApiResponse.created(
      "Your demo class request has been submitted successfully! We will contact you soon.",
      {
        leadId: lead._id,
        studentName: lead.studentName,
        email: lead.email,
        status: lead.status,
        createdAt: lead.createdAt,
        _meta: {
          adminEmailSent: emailResults.adminEmail,
          confirmationEmailSent: emailResults.userEmail,
        },
      }
    );

    res.status(201).json(response);
  }
);
