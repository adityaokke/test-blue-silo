// src/modules/ticketLogs/ticketLog.types.ts

import { Types } from "mongoose";
import { TicketLevel, CriticalValue, TicketStatus } from "../tickets/type";

export type LogAction =
  | "created"
  | "status_changed"
  | "escalated"
  | "critical_value_assigned"
  | "note_added"
  | "assigned"
  | "resolved";

export interface ITicketLog {
  ticketId: Types.ObjectId;
  action: LogAction;
  performedBy: Types.ObjectId;
  performedByRole: TicketLevel;

  // Optional change tracking fields
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  fromLevel?: TicketLevel;
  toLevel?: TicketLevel;
  criticalValue?: CriticalValue;
  note?: string;

  createdAt: Date;
}