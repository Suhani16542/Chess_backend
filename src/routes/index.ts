import { Router, Request, Response } from "express";
import dns from "dns";
import net from "net";
import demoRoutes from "./demo.routes";

const router = Router();

interface TcpResult {
  success: boolean;
  timeMs: number;
  error: string | null;
  code: string | null;
}

const testTcpConnection = (host: string, port: number, timeout = 5000): Promise<TcpResult> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const startTime = Date.now();
    let isResolved = false;

    const cleanup = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.setTimeout(timeout);

    socket.connect(port, host, () => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve({
          success: true,
          timeMs: Date.now() - startTime,
          error: null,
          code: null,
        });
      }
    });

    socket.on("error", (err: any) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve({
          success: false,
          timeMs: Date.now() - startTime,
          error: err.message || String(err),
          code: err.code || "unknown",
        });
      }
    });

    socket.on("timeout", () => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve({
          success: false,
          timeMs: Date.now() - startTime,
          error: "Connection timed out",
          code: "ETIMEDOUT",
        });
      }
    });
  });
};

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
 * SMTP Debug Diagnostic Endpoint
 */
router.get("/debug/smtp", async (_req: Request, res: Response) => {
  const dnsStart = Date.now();
  let dnsSuccess = false;
  let dnsAddresses: string[] = [];
  let dnsError: string | null = null;
  let dnsCode: string | null = null;

  try {
    dnsAddresses = await dns.promises.resolve4("smtp.gmail.com");
    dnsSuccess = true;
  } catch (err: any) {
    dnsError = err.message || String(err);
    dnsCode = err.code || "unknown";
  }
  const dnsTimeMs = Date.now() - dnsStart;

  const [port587, port465] = await Promise.all([
    testTcpConnection("smtp.gmail.com", 587),
    testTcpConnection("smtp.gmail.com", 465),
  ]);

  res.status(200).json({
    timestamp: new Date().toISOString(),
    dns: {
      success: dnsSuccess,
      addresses: dnsAddresses,
      timeMs: dnsTimeMs,
      error: dnsError,
      code: dnsCode,
    },
    tcp: {
      587: port587,
      465: port465,
    },
  });
});

/**
 * Module routes
 */
router.use("/demo", demoRoutes);

export default router;
