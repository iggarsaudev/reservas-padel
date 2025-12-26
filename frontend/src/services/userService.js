import api from "./api";

const userService = {
  // Métodos de Admin
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Métodos de Perfil personal

  // Obtener mi perfil
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Actualizar mis datos
  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  // Cambiar mi contraseña
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/users/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default userService;
