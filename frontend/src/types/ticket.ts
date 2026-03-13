import type {
  CATEGORIES,
  CRITICAL_VALUE,
  LEVEL,
  PRIORITIES, STATUS
} from "../constants/ticket";


export type Priority = typeof PRIORITIES[number];
export type Category = typeof CATEGORIES[number]["code"];
export type Status =  typeof STATUS[number];
export type Level = typeof LEVEL[number];
export type CriticalValue = typeof CRITICAL_VALUE[number];

export interface ITicket {
  id: string;
  title: string;
  description: string;
  category: Category;
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
  id: string;
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
  category: Category;
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
