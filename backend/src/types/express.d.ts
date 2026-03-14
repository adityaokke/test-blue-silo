import { IAuthUser } from "../modules/users/type";

declare global {
  namespace Express {
    interface Request {
      user: IAuthUser;
    }
  }
}