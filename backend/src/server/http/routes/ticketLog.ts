import { Router } from "express";
import { authenticate, requireRole } from "../middleware";
import * as ticketLogController from "../../../modules/ticketLogs/controller";

const router = Router({ mergeParams: true }); // ← mergeParams to access :id from parent

router.get("/",  authenticate, ticketLogController.getTicketLogs);
router.post("/", authenticate, requireRole("L2", "L3"), ticketLogController.addTicketLog);

export default router;