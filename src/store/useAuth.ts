import { create } from "zustand";
import { removeCookie } from "typescript-cookie";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: { email: string; role: string } | null;
  recoveryEmail: string | null;
  setRecoveryEmail: (email: string) => void;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  isLoggedIn: false,
  user: null,
  recoveryEmail: null,
  setRecoveryEmail: (email) => {
    set({ recoveryEmail: email });
  },
  login: (token, user) => {
    set({ token, user, isLoggedIn: true });
  },
  logout: () => {
    removeCookie("token");
    set({ token: null, user: null, isLoggedIn: false });
  },
}));