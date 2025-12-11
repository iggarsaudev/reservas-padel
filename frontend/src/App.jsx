import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import BookingCourt from "./pages/BookingCourt";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Notificaciones globales */}
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Envolvemos todo en el Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reservas" element={<Bookings />} />

              {/* Ruta dinámica para las pistas (:courtId es la variable) */}
              <Route path="/reservas/:courtId" element={<BookingCourt />} />

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
