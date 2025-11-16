import { getCurrentUser } from '@/lib/appwrite';
import { create } from 'zustand';

// Тип для фронтенда — только нужные поля
export type FrontendUser = {
  name: string;
  email: string;
  avatar: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: FrontendUser | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: FrontendUser | null) => void;
  setLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      const userDoc = await getCurrentUser();

      if (userDoc) {
        const user: FrontendUser = {
          name: userDoc.name,
          email: userDoc.email,
          avatar: userDoc.avatar,
        };
        set({ isAuthenticated: true, user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (e) {
      console.log('fetchAuthenticatedUser error', e);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
