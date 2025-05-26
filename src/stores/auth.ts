import type { User } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
export const useAuthStore = defineStore('auth', () => {
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const initialUserJson = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
  const token = ref<string | null>(initialToken);
  const user = ref<User | null>(initialUserJson ? JSON.parse(initialUserJson) : null);
  const isAuthenticated = computed(() => !!token.value);
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);
  function setUser(newUser: User | null) {
    user.value = newUser;
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem('authUser', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('authUser');
      }
    }
  }
  function setToken(newToken: string | null) {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('authToken', newToken);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }
  function logout() {
    setToken(null);
    setUser(null);
  }
  return {
    token,
    user,
    isAuthenticated,
    getUser,
    getToken,
    setUser,
    setToken,
    logout,
  };
});
