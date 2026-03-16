import { ApiError } from "../../shared/utils/error";
import { ITicket } from "./type";

// shared validation helper
export const requireAttending = (ticket: ITicket) => {
  if (ticket.status !== "Attending") {
    throw new ApiError(400, "Ticket must be set to Attending before performing this action");
  }
};
