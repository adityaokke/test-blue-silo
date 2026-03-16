import { ApiError } from "../../../shared/utils/error";
import { IAuthUser } from "../../users/type";
import { Ticket } from "../model";
import { withTransaction } from "../../../shared/utils/mongose";
import { TicketLog } from "../../ticketLogs/model";
import { TICKET_LOG_ACTION } from "../../ticketLogs/constants";
import { Types } from "mongoose";
import { TicketStatus } from "../type";

const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  New: ["Attending"],
  Attending: ["Completed"],
  Completed: [],
};

export const updateStatus = async (
  id: string,
  user: IAuthUser,
  payload: { status: TicketStatus; note: string },
) => {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid ticket ID");

  return withTransaction(async (session) => {
    const ticket = await Ticket.findById(id).session(session);
    if (!ticket) throw new ApiError(404, "Ticket not found");

    if (!VALID_TRANSITIONS[ticket.status].includes(payload.status)) {
      throw new ApiError(
        400,
        `Cannot transition status from ${ticket.status} to ${payload.status}`,
      );
    }

    if (payload.status === "Completed" && !payload.note.trim()) {
      throw new ApiError(400, "Note is required when completing a ticket");
    }

    if (payload.status === "Completed") {
      ticket.completedAt = new Date();
    }

    const fromStatus = ticket.status;
    ticket.status = payload.status;
    await ticket.save({ session });

    await TicketLog.create(
      [
        {
          ticketId: ticket._id,
          action: TICKET_LOG_ACTION.STATUS_CHANGED,
          performedBy: new Types.ObjectId(user.id),
          performedByRoleLevel: user.role.level,

          fromStatus,
          toStatus: payload.status,
          note: payload.note,
        },
      ],
      { session },
    );

    return ticket;
  });
};
