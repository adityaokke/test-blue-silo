import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUserPayload } from "../types/user";

interface AuthStore {
  user: IUserPayload | null;
  token: string | null;
  setAuth: (user: IUserPayload, token: string) => void;
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
      name: "auth",   // persists to localStorage
    }
  )
);