import { Request, Response } from "express";
import { AuthRequest } from "../../server/shared/types/authRequest";
import * as ticketService from "./service";

export const createTicket = async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.createTicket(req.user.id, req.body);
  res.status(201).json({ success: true, data: ticket })
};

export const getTickets = async (req: Request, res: Response) => {
  const tickets = await ticketService.getTickets(req.query);
  res.json({ success: true, data: tickets });
};