import type { IAuthUser } from "../types/user";
import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const userService = {
  getByLevel: async (level: string): Promise<ApiResponse<IAuthUser[]>> => {
    const res = await api.get<ApiResponse<IAuthUser[]>>("/users", {
      params: { level },
    });
    return res.data;
  },
};