import type { IUserRole } from "./userRole";

export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: IUserRole;
}