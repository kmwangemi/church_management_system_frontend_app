import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setUser: (user: AuthUser) => void;
  setToken: (token: string, refreshToken?: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      hasHydrated: false,
      setUser: (user: AuthUser) => set({ user }),
      setToken: (token: string, refreshToken?: string) => 
        set((state: AuthState) => ({ 
          token, 
          refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken 
        })),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
        }),
      checkAuth: () => !!get().token,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state?: AuthState) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
