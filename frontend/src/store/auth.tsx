import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IAuthUser } from "../types/user";

interface AuthStore {
  user: IAuthUser | null;
  token: string | null;
  setAuth: (user: IAuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth", // persists to localStorage
    },
  ),
);
