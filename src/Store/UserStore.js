import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  isLoggedIn: false,

  setUser: (user) => set({ user, isLoggedIn: true }),
  setToken: (token) => set({ token }),
  setRole: (role) => set({ role }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setLogout: () => set({ user: null, token: null, isLoggedIn: false }),
}));

export default useUserStore;
