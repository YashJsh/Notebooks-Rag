import { create } from "zustand";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token : string | null;
  setAuth: (user: User , token : string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token : null,

  setAuth: (user, token) =>
    set({
      user,
      token : token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token : null,
      isAuthenticated: false,
    }),
}));
