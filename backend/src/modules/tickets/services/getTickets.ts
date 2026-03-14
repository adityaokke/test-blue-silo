import { Types } from "mongoose";
import { Ticket } from "../model";

export const getTickets = async (query: {
  status?: string;
  priority?: string;
  currentLevel?: string;
  search?: string;
}) => {
  const filter: Record<string, unknown> = {};

  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }

  if (query.priority && query.priority !== "All") {
    filter.priority = query.priority;
  }

  if (query.currentLevel && query.currentLevel !== "All") {
    filter.currentLevel = query.currentLevel;
  }

  if (query.search) {
    const isValidObjectId = Types.ObjectId.isValid(query.search);

    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      ...(isValidObjectId ? [{ _id: new Types.ObjectId(query.search) }] : []),
    ];
  }

  const tickets = await Ticket.find(filter)
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  return tickets;
};
