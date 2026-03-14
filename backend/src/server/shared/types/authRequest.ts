import { Request } from "express";
import { IAuthUser } from "../../../modules/users/type";

export interface AuthRequest extends Request {
  user: IAuthUser;
}