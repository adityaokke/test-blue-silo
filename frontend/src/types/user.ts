import type { IUserRole } from "./userRole";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: IUserRole;
}