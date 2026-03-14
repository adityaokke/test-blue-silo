import { ApiError } from "../../shared/utils/error";
import { TicketLog } from "./model";
import { Types } from "mongoose";
import { LogAction } from "./type";
import { IAuthUser, IUser } from "../users/type";
import { Ticket } from "../tickets/model";
import * as userRoleRepository from "../userRoles/repository";

// ─── Get logs by ticket ID ────────────────────────────────────────────────────

export const getLogsByTicketId = async (ticketId: string) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new ApiError(400, "Invalid ticket ID");
  }

  const items = await TicketLog.find({ ticketId })
    .populate<{ performedBy: IUser }>("performedBy", "name email roleId")
    .sort({ createdAt: 1 }); // oldest first — chronological order

  const result = items.map((item) => {
    const obj = item.toObject();
    if (obj.performedBy) {
      obj.performedBy.role = userRoleRepository.findByRoleId(obj.performedBy.roleId) || null;
    }
    return obj;
  });
  return result;
};

// ─── Add a log entry ──────────────────────────────────────────────────────────

export const addLog = async (
  ticketId: string,
  user: IAuthUser,
  action: LogAction,
  payload: {
    note?: string;
    fromStatus?: string;
    toStatus?: string;
    fromLevel?: string;
    toLevel?: string;
    criticalValue?: string;
  },
) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new ApiError(400, "Invalid ticket ID");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const log = await TicketLog.create({
    ticketId: new Types.ObjectId(ticketId),
    action,
    performedBy: new Types.ObjectId(user.id),
    performedByRoleLevel: user.role.level,
    ...payload,
  });

  return log;
};
