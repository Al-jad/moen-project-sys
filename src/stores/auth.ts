import type { User } from '@/types'; // Assuming User type is in @/types
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface AuthState {
  // This interface might become less critical or can be simplified
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const initialUserJson = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;

  const token = ref<string | null>(initialToken);
  const user = ref<User | null>(initialUserJson ? JSON.parse(initialUserJson) : null);

  // Getters (Computed Properties)
  const isAuthenticated = computed(() => !!token.value);
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);

  // Actions (Functions)
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
    setToken(null); // This will clear the token and update localStorage
    setUser(null); // This will clear the user and update localStorage
    // isAuthenticated will automatically update because it's computed from token.value
  }

  // Initialize isAuthenticated based on token from localStorage
  // This is handled by the computed property, but ensure Pinia initializes correctly.
  // If there was a token, isAuthenticated will be true.

  return {
    // State (exposed as refs)
    token,
    user,
    // Getters (exposed as computed)
    isAuthenticated,
    getUser,
    getToken,
    // Actions
    setUser,
    setToken,
    logout,
  };
});

// Remove the old AuthState interface if it's fully replaced by inferred types
// or simplify it if still used for external type checking.
