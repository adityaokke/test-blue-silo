import { Types } from "mongoose";
import { TicketLevel, TicketCriticalValue, TicketStatus } from "../tickets/type";
import { TICKET_LOG_ACTIONS } from "./constants";

export type LogAction = typeof TICKET_LOG_ACTIONS[number];

export interface ITicketLog {
  id: string;
  ticketId: Types.ObjectId;
  action: LogAction;
  performedBy: Types.ObjectId;
  performedByRoleLevel: TicketLevel;

  // Optional change tracking fields
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  fromLevel?: TicketLevel;
  toLevel?: TicketLevel;
  criticalValue?: TicketCriticalValue;
  note?: string;

  createdAt: Date;
}