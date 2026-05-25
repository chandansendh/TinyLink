import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe, login as apiLogin, signup as apiSignup } from "../api/Auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getMe(token);
          setUser(res.user);
        } catch (err) {
          console.error("Token validation failed, logging out", err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const signup = async (data) => {
    try {
      const res = await apiSignup(data);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
