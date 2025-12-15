import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Verificamos si existe el token
  const token = localStorage.getItem("token");

  // Si NO hay token, redirigimos al Login inmediatamente
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si SÍ hay token, renderizamos el contenido
  return <Outlet />;
};

export default ProtectedRoute;
