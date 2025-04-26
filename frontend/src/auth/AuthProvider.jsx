import React, { createContext, useState, useEffect } from "react";
import api from "../api/client";
import { toast } from "react-toastify";

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/users/me")
        .then((res) => setUser(res.data))
        .catch((err) => {
          toast.warn("Twoja sesja wygasła, zaloguj się ponownie");
          localStorage.removeItem("token");
        })
        .finally(() => setLoadingAuth(false));
    } else {
        setLoadingAuth(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { token, user: u } = data;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(u);
    toast.success('Zalogowano pomyślnie');
    return u;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    toast.info('Wylogowano');
  };

  const register = async (email, password, name) => {
    await api.post("/auth/register", { email, password, name });
    const u = await login(email, password);
    toast.success('Zarejestrowano i zalogowano');
    return u;
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
