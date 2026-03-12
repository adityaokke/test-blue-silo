import { IUserPayload } from "../modules/users/type";

declare global {
  namespace Express {
    interface Request {
      user: IUserPayload;
    }
  }
}