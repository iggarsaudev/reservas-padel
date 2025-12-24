import api from "./api";

const bookingService = {
  // Crear una reserva
  create: async (bookingData) => {
    // bookingData debe ser { courtId, date, time }
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  // Obtener horas ocupadas de un día
  getOccupiedTimes: async (courtId, date) => {
    // Axios convierte el objeto params en ?date=...
    const response = await api.get(`/bookings/court/${courtId}`, {
      params: { date },
    });
    return response.data; // Devolverá array ej: ["10:30", "18:00"]
  },

  // Obtener mis reservas
  getUserBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },

  // Cancelar una reserva
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Obtener TODAS las reservas del sistema
  getAll: async () => {
    const response = await api.get("/bookings/all");
    return response.data;
  },

  // Eliminar reserva (Admin)
  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default bookingService;
