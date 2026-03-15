import type { IApiResponse } from "../types/api";
import type { IAssignCriticalPayload, ICreateTicketPayload, IEscalatePayload, ITicket, ITicketLog, IUpdateStatusPayload, Level, Priority, Status } from "../types/ticket";
import api from "./api";

export const ticketService = {
  // GET /tickets
  getAll: async (params?: {
    status?: Status | "All";
    priority?: Priority | "All";
    currentLevel?: Level | "All";
    search?: string;
  }): Promise<IApiResponse<ITicket[]>> => {
    const res = await api.get<IApiResponse<ITicket[]>>("/tickets", { params });
    return res.data;
  },

  // GET /tickets/:id
  getById: async (id: string): Promise<IApiResponse<ITicket>> => {
    const res = await api.get<IApiResponse<ITicket>>(`/tickets/${id}`);
    return res.data;
  },

  // POST /tickets — L1 only
  create: async (payload: ICreateTicketPayload): Promise<IApiResponse<ITicket>> => {
    const res = await api.post<IApiResponse<ITicket>>("/tickets", payload);
    return res.data;
  },

  // PATCH /tickets/:id/status
  updateStatus: async (
    id: string,
    payload: IUpdateStatusPayload
  ): Promise<IApiResponse<ITicket>> => {
    const res = await api.patch<IApiResponse<ITicket>>(`/tickets/${id}/status`, payload);
    return res.data;
  },

  // PATCH /tickets/:id/escalate from L1 to L2 or L2 to L3
  escalate: async (
    id: string,
    payload: IEscalatePayload
  ): Promise<IApiResponse<ITicket>> => {
    const res = await api.patch<IApiResponse<ITicket>>(`/tickets/${id}/escalate`, payload);
    return res.data;
  },

  // PATCH /tickets/:id/critical-value — L2 only
  assignCriticalValue: async (
    id: string,
    payload: IAssignCriticalPayload
  ): Promise<IApiResponse<ITicket>> => {
    const res = await api.patch<IApiResponse<ITicket>>(`/tickets/${id}/critical-value`, payload);
    return res.data;
  },

  // GET /tickets/:id/logs
  getLogs: async (id: string): Promise<IApiResponse<ITicketLog[]>> => {
    const res = await api.get<IApiResponse<ITicketLog[]>>(`/tickets/${id}/logs`);
    return res.data;
  },
};