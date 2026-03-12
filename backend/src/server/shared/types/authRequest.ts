import { Request } from "express";
import { IUserPayload } from "../../../modules/users/type";

export interface AuthRequest extends Request {
  user: IUserPayload;
}