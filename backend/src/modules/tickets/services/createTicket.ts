import { Types } from "mongoose";
import { CreateTicketDto } from "../dto";
import { Ticket } from "../model";
import { ApiError } from "../../../shared/utils/error";
import { TICKET_LOG_ACTION } from "../../ticketLogs/constants";
import { TicketLog } from "../../ticketLogs/model";
import { withTransaction } from "../../../shared/utils/mongose";

export const createTicket = async (userId: string, dto: CreateTicketDto) => {
  return withTransaction(async (session) => {
    const [ticket] = await Ticket.create(
      [
        {
          title: dto.title,
          description: dto.description,
          category: dto.category,
          expectedCompletionAt: dto.expectedCompletionAt,
          priority: dto.priority,

          createdBy: userId,
          status: "New",
          currentLevel: "L1",
          assignedTo: userId,
        },
      ],
      { session },
    );

    if (!ticket) throw new ApiError(500, "Failed to create ticket");

    // Auto-create the first log entry
    await TicketLog.create(
      [
        {
          ticketId: ticket._id,
          action: TICKET_LOG_ACTION.CREATED,
          performedBy: new Types.ObjectId(userId),
          performedByRole: "L1",
          note: "Ticket created",
        },
      ],
      { session },
    );
    return ticket;
  });
};
