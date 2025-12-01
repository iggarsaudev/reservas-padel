import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la página, comprobamos si ya había un token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Podríamos comprobar si ha expirado aquí
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido", error);
        logout(); // Si el token está corrupto, limpiamos
      }
    }
    setLoading(false);
  }, []);

  // Función de Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser({ ...userData, ...decoded });
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      throw error.response?.data?.error || "Error al iniciar sesión";
    }
  };

  // Función de Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
