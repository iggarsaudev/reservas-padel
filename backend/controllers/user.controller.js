const userService = require("../services/user.service");

// Obtenemos todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Crear usuario
const createUser = async (req, res) => {
  try {
    // Pasamos el body directamente al servicio
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    // Manejo de errores HTTP
    if (error.code === "P2002") {
      return res.status(400).json({ error: "El email ya existe" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await userService.updateUser(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (error.code === "P2002") {
      return res.status(400).json({ error: "El email ya está en uso" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// Borrar usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

// Obtener MI perfil
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error(error); // Verás el error real en la terminal del backend
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

// Actualizar MIS datos básicos
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.user.id, {
      name: req.body.name,
      surnames: req.body.surnames,
      avatar: req.body.avatar,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

// Cambiar MI contraseña
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    if (error.message === "INVALID_PASSWORD") {
      return res
        .status(400)
        .json({ error: "La contraseña actual es incorrecta" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
};
