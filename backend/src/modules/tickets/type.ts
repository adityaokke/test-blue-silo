import { Types } from "mongoose";
import { CATEGORIES, CRITICAL_VALUE, LEVEL, PRIORITIES, STATUS } from "./constants";

export type TicketPriority = typeof PRIORITIES[number];
export type TicketCategory = typeof CATEGORIES[number]["code"];
export type TicketStatus =  typeof STATUS[number];
export type TicketLevel = typeof LEVEL[number];
export type TicketCriticalValue = typeof CRITICAL_VALUE[number];

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

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;


  // escalatedAt: Date | null;
  // resolvedAt: Date | null;

  // isEscalated: boolean;
  // closedAt: Date | null;
}