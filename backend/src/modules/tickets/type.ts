import { Types } from "mongoose";

export type TicketPriority = "Low" | "Medium" | "High";

export type TicketStatus = "New" | "Attending" | "Completed";

export type TicketLevel = "L1" | "L2" | "L3";

export type CriticalValue = "C1" | "C2" | "C3";

export type TicketCategory =
  | "Network"
  | "Hardware"
  | "Software"
  | "Security"
  | "Other";

// ─── Document Interface ───────────────────────────────────────────────────────

export interface ITicket {
  // L1
  title: string;
  description: string;
  category: TicketCategory;
  expectedCompletionAt: Date;
  priority: TicketPriority;
  
  // L2
  criticalValue: CriticalValue | null;

  status: TicketStatus;
  currentLevel: TicketLevel;

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;


  // assignedTo: Types.ObjectId | null;
  // escalatedAt: Date | null;
  // resolvedAt: Date | null;

  // isEscalated: boolean;
  // closedAt: Date | null;
}