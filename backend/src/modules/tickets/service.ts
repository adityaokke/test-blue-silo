import { CreateTicketDto } from "./dto";
import { Ticket } from "./model";

export const createTicket = async (userId: string, dto: CreateTicketDto) => {
  const ticket = await Ticket.create({
    title: dto.title,
    description: dto.description,
    category: dto.category,
    expectedCompletionAt: dto.expectedCompletionAt,
    priority: dto.priority,
    
    createdBy: userId,
    status: "New",
    currentLevel: "L1",
  });
  return ticket;
};
