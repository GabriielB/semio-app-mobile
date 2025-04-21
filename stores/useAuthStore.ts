import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  profile_picture: string | null;
  total_points: number;
  total_wins: number;
  created_at: string;
};

type AuthState = {
  user: AuthUser | null;
  setUser(user: AuthUser | null): void;
  updateUser(data: Partial<AuthUser>): void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (data) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...data } });
    }
  },
}));
