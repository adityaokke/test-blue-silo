import { USER_ROLES } from "./model";
import { IUserRole } from "./type";


export const findByRoleId = (id: number): IUserRole | undefined =>
  USER_ROLES.find((r) => r.id === id);

export const findByLevel = (level: string): IUserRole | undefined =>
  USER_ROLES.find((r) => r.level === level);