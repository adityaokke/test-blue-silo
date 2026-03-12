import { IUserRole } from "../userRoles/type";

export interface IUser {
  name: string;
  email: string;
  password: string;        // bcrypt hashed
  role: Number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(plainText: string): Promise<boolean>;
}

// For use in JWT payload and request context
export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: IUserRole;
}