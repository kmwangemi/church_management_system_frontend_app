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
  setActiveChurch: (churchId: string) => void;
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
      setActiveChurch: (churchId: string) =>
        set((state: AuthState) => {
          if (!state.user) return state;
          const membership = state.user.memberships?.find(
            (m) => m.churchId === churchId
          );
          return {
            user: {
              ...state.user,
              churchId,
              churchName: membership?.churchName ?? state.user.churchName,
              branchId: membership?.branchId ?? state.user.branchId,
              branchName: membership?.branchName ?? state.user.branchName,
              role: membership?.roles?.[0] ?? state.user.role,
              roles: membership?.roles ?? state.user.roles,
            },
          };
        }),
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
