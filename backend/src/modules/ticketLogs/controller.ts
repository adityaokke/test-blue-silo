import { Request, Response } from "express";
import * as ticketLogService from "./service";
import { TICKET_LOG_ACTION } from "./constants";
import { ApiError } from "../../shared/utils/error";

export const getTicketLogs = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  if (typeof ticketId !== "string") {
    throw new ApiError(400, "Invalid ticket ID format");
  }
  const logs = await ticketLogService.getLogsByTicketId(ticketId);
  res.json({ success: true, data: logs });
};

export const addTicketLog = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  if (typeof ticketId !== "string") {
    throw new ApiError(400, "Invalid ticket ID format");
  }
  const log = await ticketLogService.addLog(ticketId, req.user, TICKET_LOG_ACTION.NOTE_ADDED, {
    note: req.body.note,
  });
  res.status(201).json({ success: true, data: log });
};
