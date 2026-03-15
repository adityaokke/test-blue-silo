import { Router } from "express";
import { authenticate, requireLevel } from "../middleware";
import * as ticketLogController from "../../../modules/ticketLogs/controller";

const router = Router({ mergeParams: true }); // ← mergeParams to access :id from parent

router.get("/", authenticate, ticketLogController.getTicketLogs);
router.post("/", authenticate, requireLevel("L2", "L3"), ticketLogController.addTicketLog);

export default router;
