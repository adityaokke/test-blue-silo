import { Types } from "mongoose";
import { ApiError } from "../../../shared/utils/error";
import * as userRoleRepository from "../../userRoles/repository";
import { IUser } from "../../users/type";
import { Ticket } from "../model";

export const getTicketById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ticket ID format");
  }
  const item = await Ticket.findById(id)
    .populate<{ createdBy: IUser }>("createdBy", "name email roleId")
    .populate<{ assignedTo: IUser }>("assignedTo", "name email roleId");

  if (!item) throw new ApiError(404, "Ticket not found");

  const result = item.toObject();

  if (result.createdBy) {
    result.createdBy.role = userRoleRepository.findByRoleId(result.createdBy.roleId) || null;
  }
  if (result.assignedTo) {
    result.assignedTo.role = userRoleRepository.findByRoleId(result.assignedTo.roleId) || null;
  }
  return result;
};
