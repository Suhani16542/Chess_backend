import { Router, Request, Response } from "express";
import demoRoutes from "./demo.routes";

const router = Router();

/**
 * Health check endpoint
 */
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Chess Academy API is running",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

/**
 * Module routes
 */
router.use("/demo", demoRoutes);

export default router;
