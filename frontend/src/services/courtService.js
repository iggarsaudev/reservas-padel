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
};

export default courtService;
