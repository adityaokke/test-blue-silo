export type Priority = "Low" | "Medium" | "High";
export type Status = "New" | "Attending" | "Completed" | "Resolved";
export type Level = "L1" | "L2" | "L3";
export type CriticalValue = "C1" | "C2" | "C3";

export interface ITicket {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  currentLevel: Level;
  criticalValue: CriticalValue | null;
  isEscalated: boolean;
  expectedCompletionAt: string;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ITicketLog {
  _id: string;
  ticketId: string;
  action: string;
  performedBy: string;
  performedByRole: Level;
  fromStatus?: Status;
  toStatus?: Status;
  fromLevel?: Level;
  toLevel?: Level;
  criticalValue?: CriticalValue;
  note?: string;
  createdAt: string;
}

export interface ICreateTicketPayload {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  expectedCompletionAt: string;
}

export interface IUpdateStatusPayload {
  status: Status;
}

export interface IEscalatePayload {
  note: string;
}

export interface IAssignCriticalPayload {
  criticalValue: CriticalValue;
  note?: string;
}

export interface IResolvePayload {
  note: string;
}
