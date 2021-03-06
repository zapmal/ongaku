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
      await apiClient.get('logout');

      localStorage.removeItem('isLoggedIn');
      set({ entity: {}, csrfToken: null });
    } catch (error) {
      set({ entity: {} });
    }
  },
}));
