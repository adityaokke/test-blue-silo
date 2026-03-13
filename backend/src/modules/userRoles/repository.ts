import { USER_ROLES } from "./model";
import { IUserRole } from "./type";


export const findByRoleId = (id: Number): IUserRole | undefined =>
  USER_ROLES.find((r) => r.id === id);