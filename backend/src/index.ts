import express from "express";
import connectDB from "./config/db";
import { appEnv } from "./config/env";
import authRoutes from "./server/http/routes/auth";
import ticketRoutes from "./server/http/routes/ticket";

const start = async () => {
  const app = express();

  app.use(express.json());

  // ─── Routes ───────────────────────────────────────────────────────
  app.use("/api/auth", authRoutes);
  app.use("/api/tickets", ticketRoutes);

  // ─── 404 ──────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  await connectDB();

  app.listen(appEnv.PORT, () => {
    console.log(`Server running on port ${appEnv.PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});