import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import BookingCourt from "./pages/BookingCourt";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminCourts from "./pages/AdminCourts";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route element={<Layout />}>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas Protegidas */}
              {/* Todo lo que esté aquí dentro requiere Token */}
              <Route element={<ProtectedRoute />}>
                <Route path="/reservas" element={<Bookings />} />
                <Route path="/mis-reservas" element={<MyBookings />} />

                {/* Ahora nadie puede intentar reservar una pista sin login */}
                <Route path="/reservas/:courtId" element={<BookingCourt />} />
              </Route>

              {/* Ruta Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/pistas" element={<AdminCourts />} />
              </Route>

              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
