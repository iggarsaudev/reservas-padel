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
};

export default bookingService;
