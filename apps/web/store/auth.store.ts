import { create } from "zustand";

type AuthState = {
  email: string | null;
  setEmail: (email: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
}));
