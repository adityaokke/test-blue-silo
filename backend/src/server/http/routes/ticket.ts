import { Router } from "express";
import { authenticate, requireRole } from "../middleware";
import * as ticketController from "../../../modules/tickets/controller";

const router = Router();

// L1 — create ticket
router.post(
  "/",
  // authenticate,
  // requireRole("L1"),
  ticketController.createTicket,
);

// // All roles — get ticket list
// router.get("/", authenticate, ticketController.getTickets);

// // All roles — get ticket detail
// router.get("/:id", authenticate, ticketController.getTicketById);

// // L1 — update status
// router.patch(
//   "/:id/status",
//   authenticate,
//   requireRole("L1"),
//   ticketController.updateStatus,
// );

// // L1 or L2 — escalate
// router.patch(
//   "/:id/escalate",
//   authenticate,
//   requireRole("L1", "L2"),
//   ticketController.escalateTicket,
// );

// // L2 — assign critical value
// router.patch(
//   "/:id/critical-value",
//   authenticate,
//   requireRole("L2"),
//   ticketController.assignCriticalValue,
// );

// // L3 — resolve ticket
// router.patch(
//   "/:id/resolve",
//   authenticate,
//   requireRole("L3"),
//   ticketController.resolveTicket,
// );

// // All roles — get ticket logs
// router.get("/:id/logs", authenticate, ticketController.getTicketLogs);

export default router;
