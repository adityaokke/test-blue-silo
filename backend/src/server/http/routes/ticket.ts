import { Router } from "express";
import { authenticate, requireLevel } from "../middleware";
import * as ticketController from "../../../modules/tickets/controller";

const router = Router();

// L1 — create ticket
router.post("/", authenticate, requireLevel("L1"), ticketController.createTicket);

router.get("/", authenticate, ticketController.getTickets);

router.get("/:id", authenticate, ticketController.getTicketById);

// update status
router.patch(
  "/:id/status",
  authenticate,
  requireLevel("L1", "L2", "L3"),
  ticketController.updateStatus,
);

// L1 or L2 — escalate
router.patch(
  "/:id/escalate",
  authenticate,
  requireLevel("L1", "L2"),
  ticketController.escalateTicket,
);

// L2 — assign critical value
router.patch(
  "/:id/critical-value",
  authenticate,
  requireLevel("L2"),
  ticketController.assignCriticalValue,
);

// // L3 — resolve ticket
// router.patch(
//   "/:id/resolve",
//   authenticate,
//   requireLevel("L3"),
//   ticketController.resolveTicket,
// );

// // All roles — get ticket logs
// router.get("/:id/logs", authenticate, ticketController.getTicketLogs);

export default router;
