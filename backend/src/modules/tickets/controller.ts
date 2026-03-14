import { Request, Response } from "express";
import { AuthRequest } from "../../server/shared/types/authRequest";
import * as ticketService from "./services";
import { ApiError } from "../../shared/utils/error";

export const createTicket = async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.createTicket(req.user.id, req.body);
  res.status(201).json({ success: true, data: ticket });
};

export const getTickets = async (req: Request, res: Response) => {
  const tickets = await ticketService.getTickets(req.query);
  res.json({ success: true, data: tickets });
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ success: false, message: "Ticket ID is required" });
    return;
  }
  if (typeof id !== "string") {
    res.status(400).json({ success: false, message: "Invalid ticket ID format" });
    return;
  }

  const ticket = await ticketService.getTicketById(id);
  res.json({ success: true, data: ticket });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ success: false, message: "Ticket ID is required" });
    return;
  }
  if (typeof id !== "string") {
    res.status(400).json({ success: false, message: "Invalid ticket ID format" });
    return;
  }
  const ticket = await ticketService.updateStatus(id, req.user, req.body);
  res.json({ success: true, data: ticket });
};

export const escalateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ success: false, message: "Ticket ID is required" });
    return;
  }
  if (typeof id !== "string") {
    res.status(400).json({ success: false, message: "Invalid ticket ID format" });
    return;
  }
  const ticket = await ticketService.escalateTicket(id, req.user, req.body);
  res.json({ success: true, data: ticket });
};

export const assignCriticalValue = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ success: false, message: "Ticket ID is required" });
    return;
  }
  if (typeof id !== "string") {
    res.status(400).json({ success: false, message: "Invalid ticket ID format" });
    return;
  }
  const ticket = await ticketService.assignCriticalValue(id, req.user, req.body);
  res.json({ success: true, data: ticket });
};