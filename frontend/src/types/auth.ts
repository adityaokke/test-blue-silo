import type { IAuthUser } from "./user";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IAuthResponse {
  token: string;
  user: IAuthUser;
}
