import api from "./api";

const courtService = {
  // Obtener todas las pistas
  getAll: async () => {
    const response = await api.get("/courts");
    return response.data;
  },

  // Obtener una pista por ID
  getById: async (id) => {
    const response = await api.get(`/courts/${id}`);
    return response.data;
  },

  // Crear nueva pista (Admin)
  create: async (courtData) => {
    const response = await api.post("/courts", courtData);
    return response.data;
  },

  // Actualizar pista (Admin)
  update: async (id, courtData) => {
    const response = await api.put(`/courts/${id}`, courtData);
    return response.data;
  },

  // Eliminar pista (Admin)
  remove: async (id) => {
    const response = await api.delete(`/courts/${id}`);
    return response.data;
  },
};

export default courtService;
