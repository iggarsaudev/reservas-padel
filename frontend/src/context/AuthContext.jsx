import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la página, comprobamos si hay token Y pedimos los datos reales
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);

          // Establecemos lo básico para que la app no crea que estamos desconectados
          // (Esto pone el ID y el email mientras cargamos el resto)
          setUser(decoded);
          setIsAuthenticated(true);

          // Pedimos el perfil completo a la base de datos
          const response = await api.get(`/users/${decoded.id}`);

          setUser((prev) => ({ ...prev, ...response.data }));
        } catch (error) {
          console.error("Error al restaurar sesión:", error);
          // Si el token es inválido o el usuario no existe, cerramos sesión
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función de Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      // Guardamos todo: lo que viene del login + lo del token
      setUser({ ...decoded, ...userData });
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

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
