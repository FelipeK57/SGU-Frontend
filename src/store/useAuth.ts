import { create } from "zustand";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: { email: string; role: string } | null;
  setUser: (email: string, role: string) => void;
  recoveryEmail: string | null;
  setRecoveryEmail: (email: string) => void;
  login: (token: string) => void;
  logout: () => void;
}

const zustandSessionStorage = {
  getItem: (name: string) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

interface UserState {
  email: string | null;
  setEmail: (email: string) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email) => set({ email }),
      clear: () => set({ email: null }),
    }),
    {
      name: "user-data",
      storage: zustandSessionStorage,
    }
  )
);

export const useAuth = create<AuthState>((set) => {
  const storedToken = getCookie("token");

  return {
    token: storedToken || null,
    isLoggedIn: storedToken ? true : false,
    user: null,
    recoveryEmail: null,
    setUser(email, role) {
      set({ user: { email: email, role: role } });
    },
    setRecoveryEmail: (email) => {
      set({ recoveryEmail: email });
    },
    login: (token) => {
      set({ token, isLoggedIn: true });
      setCookie("token", token, { expires: 7, path: "" });
    },
    logout: () => {
      set({ token: null, user: null, isLoggedIn: false });
      removeCookie("token");
    },
  };
});
