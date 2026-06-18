import { useMemo, useState } from "react";
import { AuthContext } from "./authStore";
import { loginUser, registerUser, logoutUser } from "../services/api";

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, role, cinemaName, city) => {
    const data = await registerUser(name, email, password, role, cinemaName, city);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data.user || data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Backend logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      role: user?.role ? user.role.toLowerCase() : "guest",
      user,
      token,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
