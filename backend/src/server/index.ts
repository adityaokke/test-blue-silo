import cors from "cors";
import express from "express";
import connectDB from "../config/db";
import { appEnv } from "../config/env";
import authRoutes from "./http/routes/auth";
import ticketRoutes from "./http/routes/ticket";
import ticketLogRoutes from "./http/routes/ticketLog";
import userRoutes from "./http/routes/user";
import { errorMiddleware } from "./shared/middleware/error";

export const startServer = async () => {
  const app = express();
  app.use(
    cors({
      origin: appEnv.WEB_URL,
      credentials: true,
    }),
  );
  app.use(express.json());

  // ─── Routes ───────────────────────────────────────────────────────
  app.use("/api/auth", authRoutes);
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/tickets/:ticketId/logs", ticketLogRoutes);
  app.use("/api/users", userRoutes);

  // ─── 404 ──────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // ─── Error middleware last ────────────────────────────────────────────────────
  app.use(errorMiddleware);

  await connectDB();

  app.listen(appEnv.PORT, () => {
    console.log(`Server running on port ${appEnv.PORT}`);
  });
};
