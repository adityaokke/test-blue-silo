import type { IApiResponse } from "../types/api";
import type { IAuthUser } from "../types/user";
import api from "./api";

export const userService = {
  getByLevel: async (level: string): Promise<IApiResponse<IAuthUser[]>> => {
    const res = await api.get<IApiResponse<IAuthUser[]>>("/users", {
      params: { level },
    });
    return res.data;
  },
};
