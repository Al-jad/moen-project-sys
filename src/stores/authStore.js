import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', JSON.stringify(token));
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  persist: true,
});


