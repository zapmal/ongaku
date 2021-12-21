import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: {},
  csrfToken: '',

  setUser: (user) => {
    set({ user });
  },
  setCsrfToken: (csrfToken) => {
    set({ csrfToken });
  },
  logout: () => {
    set({ user: {}, csrfToken: null });
  },
}));
