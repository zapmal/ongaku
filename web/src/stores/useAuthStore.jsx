import create from 'zustand';

export const useAuthStore = create((set) => ({
  entity: {},
  csrfToken: '',

  setEntity: (entity) => {
    set({ entity });
  },
  setCsrfToken: (csrfToken) => {
    set({ csrfToken });
  },
  logout: () => {
    set({ user: {}, csrfToken: null });
  },
}));
