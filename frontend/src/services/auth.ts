import type { IAuthResponse } from "../types/api";
import type { ILoginPayload, ISignupPayload } from "../types/auth";
import api from "./api";

export const authService = {
  login: async (payload: ILoginPayload): Promise<IAuthResponse> => {
    const res = await api.post<IAuthResponse>("/auth/login", payload);
    return res.data;
  },

  signup: async (payload: ISignupPayload): Promise<IAuthResponse> => {
    const res = await api.post<IAuthResponse>("/auth/signup", payload);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};