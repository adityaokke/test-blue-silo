import { Types } from "mongoose";
import { CATEGORIES, CRITICAL_VALUES, LEVELS, PRIORITIES, STATUSES } from "./constants";

export type TicketPriority = (typeof PRIORITIES)[number];
export type TicketCategory = (typeof CATEGORIES)[number]["code"];
export type TicketStatus = (typeof STATUSES)[number];
export type TicketLevel = (typeof LEVELS)[number];
export type TicketCriticalValue = (typeof CRITICAL_VALUES)[number];

// ─── Document Interface ───────────────────────────────────────────────────────

export interface ITicket {
  id: string;
  // L1
  title: string;
  description: string;
  category: TicketCategory;
  expectedCompletionAt: Date;
  priority: TicketPriority;
  assignedTo: Types.ObjectId;

  // L2
  criticalValue: TicketCriticalValue | null;

  status: TicketStatus;
  currentLevel: TicketLevel;
  completedAt: Date | null;

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
