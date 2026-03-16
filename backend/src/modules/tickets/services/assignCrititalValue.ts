import { Types } from "mongoose";
import { IAuthUser } from "../../users/type";
import { ApiError } from "../../../shared/utils/error";
import { withTransaction } from "../../../shared/utils/mongose";
import { Ticket } from "../model";
import { TicketLog } from "../../ticketLogs/model";
import { TICKET_LOG_ACTION } from "../../ticketLogs/constants";
import { requireAttending } from "../utils";

export const assignCriticalValue = async (
  id: string,
  user: IAuthUser,
  payload: { criticalValue: string; note: string },
) => {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid ticket ID");

  return withTransaction(async (session) => {
    const ticket = await Ticket.findById(id).session(session);
    if (!ticket) throw new ApiError(404, "Ticket not found");

    requireAttending(ticket);

    if (ticket.status === "Completed") {
      throw new ApiError(400, "Ticket is already completed");
    }

    ticket.criticalValue = payload.criticalValue as "C1" | "C2" | "C3";
    await ticket.save({ session });

    await TicketLog.create(
      [
        {
          ticketId: ticket._id,
          action: TICKET_LOG_ACTION.CRITICAL_VALUE_ASSIGNED,
          performedBy: new Types.ObjectId(user.id),
          performedByRoleLevel: user.role.level,
          criticalValue: payload.criticalValue,
          note: payload.note,
        },
      ],
      { session },
    );

    return ticket;
  });
};
