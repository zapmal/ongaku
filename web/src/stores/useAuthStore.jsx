import create from 'zustand';

import { apiClient } from '@/lib/api';

export const useAuthStore = create((set, get) => ({
  entity: {},
  csrfToken: '',

  setEntity: (entity) => {
    set({ entity });
  },
  setCsrfToken: (csrfToken) => {
    set({ csrfToken });
  },
  isLoggedIn: () => {
    if (Object.keys(get().entity).length === 0) return false;

    return true;
  },
  logout: async () => {
    try {
      const response = await apiClient.get('logout');

      if (response.status) {
        set({ user: {}, csrfToken: null });
      }
    } catch (error) {
      console.log('Logout error', error);
      set({ user: {} });
    }
  },
}));
