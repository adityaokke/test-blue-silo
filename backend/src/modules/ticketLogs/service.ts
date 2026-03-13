


import { ApiError } from "../../shared/utils/error";
import { TicketLog } from "./model";
import { Types } from "mongoose";
import { LogAction } from "./type";
import { IUserPayload } from "../users/type";
import { Ticket } from "../tickets/model";
// ─── Get logs by ticket ID ────────────────────────────────────────────────────

export const getLogsByTicketId = async (ticketId: string) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new ApiError(400, "Invalid ticket ID");
  }

  const logs = await TicketLog.find({ ticketId })
    .populate("performedBy", "name email role")
    .sort({ createdAt: 1 }); // oldest first — chronological order

  return logs;
};

// ─── Add a log entry ──────────────────────────────────────────────────────────

export const addLog = async (
  ticketId: string,
  user: IUserPayload,
  action: LogAction,
  payload: {
    note?: string;
    fromStatus?: string;
    toStatus?: string;
    fromLevel?: string;
    toLevel?: string;
    criticalValue?: string;
  }
) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new ApiError(400, "Invalid ticket ID");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const log = await TicketLog.create({
    ticketId: new Types.ObjectId(ticketId),
    action,
    performedBy: new Types.ObjectId(user.id),
    performedByRole: user.role.code,
    ...payload,
  });

  return log;
};