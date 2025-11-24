const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const login = async (email, password) => {
  // Buscar el usuario por email
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  // Si no existe, lanzamos error
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  // Verificar la contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Credenciales inválidas");
  }

  // Generar el Token JWT
  // Guardamos en el token el ID y el ROL (información útil para el frontend)
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // El token caduca en 1 día
  );

  // Devolver el token y los datos del usuario (sin password)
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

module.exports = {
  login,
};
