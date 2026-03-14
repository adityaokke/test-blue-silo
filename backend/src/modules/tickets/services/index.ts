import { Types } from "mongoose";
import { CreateTicketDto } from "../dto";
import { Ticket } from "../model";
import { ApiError } from "../../../shared/utils/error";
import { TICKET_LOG_ACTION } from "../../ticketLogs/constants";
import { TicketLog } from "../../ticketLogs/model";
import { withTransaction } from "../../../shared/utils/mongose";
import { IAuthUser } from "../../users/type";

export * from "./createTicket";
export * from "./getTicketById";
export * from "./getTickets";
export * from "./escalateTicket";
export * from "./updateStatus";


// ticket.service.ts

// export const escalateTicket = async (
//   id: string,
//   user: IAuthUser,
//   note: string
// ) => {
//   const ticket = await Ticket.findById(id);
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   const fromLevel = ticket.currentLevel;
//   const toLevel = fromLevel === "L1" ? "L2" : "L3";

//   ticket.currentLevel = toLevel;
//   ticket.isEscalated = true;
//   ticket.escalatedAt = new Date();
//   await ticket.save();

//   // log is created automatically — user just clicked "Escalate"
//   await addLog(id, user, "escalated", {
//     fromLevel,
//     toLevel,
//     note,
//   });

//   return ticket;
// };

// export const assignCriticalValue = async (
//   id: string,
//   user: IAuthUser,
//   criticalValue: string,
//   note?: string
// ) => {
//   const ticket = await Ticket.findById(id);
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   ticket.criticalValue = criticalValue as "C1" | "C2" | "C3";
//   await ticket.save();

//   await addLog(id, user, "critical_value_assigned", {
//     criticalValue,
//     note,
//   });

//   return ticket;
// };

// export const updateStatus = async (
//   id: string,
//   user: IAuthUser,
//   status: string
// ) => {
//   const ticket = await Ticket.findById(id);
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   const fromStatus = ticket.status;
//   ticket.status = status as "New" | "Attending" | "Completed" | "Resolved";
//   await ticket.save();

//   await addLog(id, user, "status_changed", {
//     fromStatus,
//     toStatus: status,
//   });

//   return ticket;
// };

// export const resolveTicket = async (
//   id: string,
//   user: IAuthUser,
//   note: string
// ) => {
//   const ticket = await Ticket.findById(id);
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   ticket.status = "Resolved";
//   ticket.resolvedAt = new Date();
//   await ticket.save();

//   await addLog(id, user, "resolved", { note });

//   return ticket;
// };