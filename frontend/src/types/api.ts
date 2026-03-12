import type { IUserPayload } from "./user";

export interface IApiResponse<T> {
  success: boolean;
  data: T;
}

export interface IAuthResponse {
  success: boolean;
  data: {
    token: string;
    user: IUserPayload;
  };
}