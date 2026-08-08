import React, { createContext, useContext, useEffect, useState } from "react";
import AuthService from "services/Auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await AuthService.me();
      setUser(data?.user ?? null);
      return data?.user ?? null;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (values) => {
    const { data } = await AuthService.login(values);
    setUser(data?.user ?? null);
    return data;
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      /* ignore */
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
