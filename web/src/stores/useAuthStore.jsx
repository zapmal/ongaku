import create from 'zustand';

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
  logout: () => {
    set({ user: {}, csrfToken: null });
  },
}));
