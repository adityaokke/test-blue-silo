import { Response } from "express";
import { AuthRequest } from "../../server/shared/types/authRequest";
import * as ticketService from "./service";

export const createTicket = async (req: AuthRequest, res: Response) => {
  const ticket = await ticketService.createTicket(req.user.id, req.body);
  res.status(201).json({ success: true, data: ticket })
};