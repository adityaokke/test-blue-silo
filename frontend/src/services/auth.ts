import type { IApiResponse } from "../types/api";
import type { IAuthResponse, ILoginPayload, ISignupPayload } from "../types/auth";
import api from "./api";

export const authService = {
  login: async (payload: ILoginPayload): Promise<IApiResponse<IAuthResponse>> => {
    const res = await api.post<IApiResponse<IAuthResponse>>("/auth/login", payload);
    return res.data;
  },

  signup: async (payload: ISignupPayload): Promise<IApiResponse<IAuthResponse>> => {
    const res = await api.post<IApiResponse<IAuthResponse>>("/auth/signup", payload);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};