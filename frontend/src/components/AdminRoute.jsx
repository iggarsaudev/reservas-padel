import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; // O tu spinner

  // Si no está logueado -> Al Login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si está logueado pero NO es admin -> A reservas (403)
  if (user?.role !== "admin") {
    return <Navigate to="/reservas" replace />;
  }

  // Si es admin -> Pasa
  return <Outlet />;
};

export default AdminRoute;
