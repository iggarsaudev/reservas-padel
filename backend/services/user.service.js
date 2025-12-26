const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Obtener todos los usuarios
const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  // Recorremos el array y limpiamos cada usuario para no devolver la contraseña
  return users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

// Crear usuario
const createUser = async (userData) => {
  // Encriptamos la contraseña
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      surnames: userData.surnames,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
    },
  });

  // Quitamos el password antes de devolverlo
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Obtener usuario por ID
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Actualizar usuario
const updateUser = async (id, userData) => {
  let dataToUpdate = {
    name: userData.name,
    surnames: userData.surnames,
    email: userData.email,
    role: userData.role,
    avatar: userData.avatar,
  };

  // Solo si envían una nueva contraseña, la encriptamos
  if (userData.password) {
    dataToUpdate.password = await bcrypt.hash(userData.password, 10);
  }

  // Limpiamos campos undefined para que no borre datos si no se envían
  Object.keys(dataToUpdate).forEach(
    (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
  );

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Borrar usuario
const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
};

// Cambiar contraseña (con validación)
const changePassword = async (userId, currentPassword, newPassword) => {
  // Buscamos al usuario para tener su hash actual
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) throw new Error("Usuario no encontrado");

  // Comparamos la contraseña actual con la de la BD
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    // Lanzamos un error específico para capturarlo en el controlador
    throw new Error("INVALID_PASSWORD");
  }

  // Encriptamos la nueva
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Actualizamos solo la contraseña
  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashedNewPassword },
  });

  return { message: "Contraseña actualizada" };
};

const updateProfile = async (data) => {
  // Si 'data' es una instancia de FormData, axios/fetch necesita saberlo
  const response = await api.put("/users/profile", data);
  return response.data;
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateProfile,
};
