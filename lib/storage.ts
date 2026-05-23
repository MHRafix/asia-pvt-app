// Storage utility for managing auth tokens
export const storageUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },
};
