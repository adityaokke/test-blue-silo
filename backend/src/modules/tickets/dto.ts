import { TicketCategory, TicketPriority } from "./type";

export interface CreateTicketDto {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  expectedCompletionAt: Date;
}