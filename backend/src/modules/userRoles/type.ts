import { TicketLevel } from "../tickets/type";

export interface IUserRole {
  id: number;
  name: string;
  level: TicketLevel;
}
