import { create } from "zustand";
import { removeCookie } from "typescript-cookie";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: { email: string; role: string } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  isLoggedIn: false,
  user: null,
  login: (token, user) => {
    set({ token, user, isLoggedIn: true });
  },
  logout: () => {
    removeCookie("token");
    set({ token: null, user: null, isLoggedIn: false });
  },
}));
