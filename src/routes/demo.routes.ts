import { Router } from "express";
import { submitDemoLead } from "../controllers/demo.controller";
import { validate } from "../middlewares/validate.middleware";
import { demoLeadLimiter } from "../middlewares/rateLimiter";
import { demoLeadSchema } from "../validations/demo.validation";

const router = Router();

/**
 * @route   POST /api/demo
 * @desc    Submit a free demo class request
 * @access  Public
 */
router.post(
  "/",
  demoLeadLimiter,
  validate(demoLeadSchema),
  submitDemoLead
);

export default router;
