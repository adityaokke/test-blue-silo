// src/modules/tickets/ticket.service.ts

import { Types } from "mongoose";
import { Ticket } from "../model";
import { ApiError } from "../../../shared/utils/error";
import { TICKET_LOG_ACTION } from "../../ticketLogs/constants";
import { TicketLog } from "../../ticketLogs/model";
import { withTransaction } from "../../../shared/utils/mongose";
import { IAuthUser } from "../../users/type";
import { User } from "../../users/model";
import * as userRoleRepository from "../../userRoles/repository";

export const escalateTicket = async (
  id: string,
  user: IAuthUser,
  payload: { note: string; assignedTo: string },
) => {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid ticket ID");

  return withTransaction(async (session) => {
    const ticket = await Ticket.findById(id).session(session);
    if (!ticket) throw new ApiError(404, "Ticket not found");

    if (ticket.status === "Completed") {
      throw new ApiError(400, "Ticket is already completed and cannot be updated");
    }

    if (ticket.currentLevel === "L3") {
      throw new ApiError(400, "Ticket is already at L3, cannot escalate further");
    }

    if (ticket.currentLevel === "L2" && !["C1", "C2"].includes(ticket.criticalValue ?? "")) {
      throw new ApiError(400, "Critical value must be C1 or C2 before escalating to L3");
    }

    const fromLevel = ticket.currentLevel;
    const toLevel = fromLevel === "L1" ? "L2" : "L3";

    ticket.currentLevel = toLevel;
    ticket.status = "Attending";

    if (!(payload.assignedTo && Types.ObjectId.isValid(payload.assignedTo))) {
      throw new ApiError(400, "Valid assignedTo user ID is required for escalation");
    }
    const assignedUser = await User.findById(payload.assignedTo).session(session);
    if (!assignedUser) throw new ApiError(404, "Assigned user not found");
    const userRole = userRoleRepository.findByRoleId(assignedUser.roleId);
    if (!userRole) throw new ApiError(404, "Assigned user's role not found");
    if (userRole.level !== toLevel) {
      throw new ApiError(400, `Assigned user must be a ${toLevel} level role`);
    }

    ticket.assignedTo = new Types.ObjectId(payload.assignedTo);

    await ticket.save({ session });

    await TicketLog.create(
      [
        {
          ticketId: ticket._id,
          action: TICKET_LOG_ACTION.ESCALATED,
          performedBy: new Types.ObjectId(user.id),
          performedByRoleLevel: user.role.level,

          fromLevel,
          toLevel,
          note: payload.note,
        },
      ],
      { session },
    );

    return ticket;
  });
};
