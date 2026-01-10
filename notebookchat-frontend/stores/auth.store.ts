import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set)=>({
  user : null,
  isAuthenticated : false,
  setAuth : (user : User)=>{
    set({
      user,
      isAuthenticated : true
    })
  },
  logout : ()=>{
    set({
      isAuthenticated : false
    })
  }
}));
