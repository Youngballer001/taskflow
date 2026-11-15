import { createContext, useContext, useMemo, useState } from 'react';
import authApi from '../api/authApi';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const savedAuth = getStoredAuth();
  const [auth, setAuth] = useState(savedAuth);
  const [loading, setLoading] = useState(false);

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth);
    setStoredAuth(nextAuth);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const nextAuth = await authApi.login(credentials);
      saveAuth(nextAuth);
      return nextAuth;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const nextAuth = await authApi.register(payload);
      saveAuth(nextAuth);
      return nextAuth;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth?.refreshToken) await authApi.logout(auth.refreshToken);
    } catch {
      // Clear the local session even if the server is unavailable.
    }
    setAuth(null);
    clearStoredAuth();
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.accessToken || null,
      refreshToken: auth?.refreshToken || null,
      isAuthenticated: !!auth?.accessToken,
      loading,
      login,
      register,
      updateUser: (user) => { if (auth) saveAuth({ ...auth, user }); },
      logout,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
