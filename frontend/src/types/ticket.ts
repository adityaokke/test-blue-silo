import type {
  CATEGORIES,
  CRITICAL_VALUES,
  LEVELS,
  PRIORITIES, STATUSES
} from "../constants/ticket";
import type { IUserRole } from "./userRole";


export type Priority = typeof PRIORITIES[number];
export type Category = typeof CATEGORIES[number]["code"];
export type Status =  typeof STATUSES[number];
export type Level = typeof LEVELS[number];
export type CriticalValue = typeof CRITICAL_VALUES[number];

export interface ITicket {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  currentLevel: Level;
  criticalValue: CriticalValue | null;
  expectedCompletionAt: string;
  createdBy: ITicketUser;
  assignedTo: ITicketUser | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface ITicketLog {
  id: string;
  ticketId: string;
  action: string;
  performedBy: ITicketUser;
  performedByRoleLevel: Level;
  fromStatus?: Status;
  toStatus?: Status;
  fromLevel?: Level;
  toLevel?: Level;
  criticalValue?: CriticalValue;
  note: string;
  createdAt: string;
}

export interface ITicketUser {
  id: string;
  name: string;
  email: string;
  role: IUserRole;
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
  note: string;
}

export interface IEscalatePayload {
  assignedTo: string;
  note: string;
}

export interface IAssignCriticalPayload {
  criticalValue: CriticalValue;
  note: string;
}

export interface IResolvePayload {
  note: string;
}
