export interface IUserRole {
  id: number;
  name: string;
  code: UserRoleCode;
}

export type UserRoleCode = "L1" | "L2" | "L3";