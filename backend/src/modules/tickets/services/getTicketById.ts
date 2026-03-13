import { Types } from "mongoose";
import { CreateTicketDto } from "../dto";
import { Ticket } from "../model";
import { ApiError } from "../../../shared/utils/error";
import { TICKET_LOG_ACTION } from "../../ticketLogs/constants";
import { TicketLog } from "../../ticketLogs/model";
import { withTransaction } from "../../../shared/utils/mongose";
import { findByRoleId } from "../../userRoles/repository";
import { IUser } from "../../users/type";



export const getTicketById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ticket ID format");
  }
  const ticket = await Ticket.findById(id)
    .populate<{ createdBy: IUser }>("createdBy", "name email roleId")
    .populate<{ assignedTo: IUser }>("assignedTo", "name email roleId")
    .lean();

  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (ticket.createdBy) {
    ticket.createdBy.role = findByRoleId(ticket.createdBy.roleId) || null;
  }
  if (ticket.assignedTo) {
    ticket.assignedTo.role = findByRoleId(ticket.assignedTo.roleId) || null;
  }
  return ticket;
};