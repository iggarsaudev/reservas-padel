const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear una reserva
const createMatch = async (userId, courtId, startTime, endTime) => {
  // Convertimos a objetos Date por si vienen como texto
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validaciones Básicas
  if (start >= end) {
    throw new Error("La fecha de fin debe ser posterior a la de inicio");
  }
  if (start < new Date()) {
    throw new Error("No puedes reservar en el pasado");
  }

  // Buscar la pista para saber el precio
  const court = await prisma.court.findUnique({
    where: { id: Number(courtId) },
  });
  if (!court) {
    throw new Error("Pista no encontrada"); // Esto lanzará un 404 en el controlador
  }

  // Validación de disponibilidad
  // Buscamos si existe algún partido en esa pista que choque con nuestro horario
  const existingMatch = await prisma.match.findFirst({
    where: {
      courtId: Number(courtId),
      AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }], // (InicioNuevo < FinExistente) Y (FinNuevo > InicioExistente)
    },
  });

  if (existingMatch) {
    throw new Error("La pista ya está reservada en ese horario"); // Error 409 Conflict
  }

  // Calcular precio total
  const durationInHours = (end - start) / (1000 * 60 * 60);
  const totalPrice = durationInHours * court.price;

  // Guardar
  const newMatch = await prisma.match.create({
    data: {
      userId: userId, // El ID viene del token
      courtId: Number(courtId),
      startTime: start,
      endTime: end,
      totalPrice: totalPrice,
    },
    include: {
      court: true, // Para que devuelva los datos de la pista también (nombre, etc)
      user: {
        // Devuelve datos básicos del usuario
        select: { name: true, email: true },
      },
    },
  });

  return newMatch;
};

// Obtener reservas
// Si es admin ve todas, si no, solo las suyas
const getMatches = async (userId, isAdmin) => {
  const whereClause = isAdmin ? {} : { userId: userId };

  return await prisma.match.findMany({
    where: whereClause,
    include: {
      court: true, // Incluimos info de la pista
    },
    orderBy: {
      startTime: "desc", // Las más nuevas primero
    },
  });
};

// Cancelar reserva
const deleteMatch = async (matchId, userId, isAdmin) => {
  // Primero buscamos la reserva para ver de quién es
  const match = await prisma.match.findUnique({
    where: { id: Number(matchId) },
  });

  if (!match) throw new Error("Reserva no encontrada");

  // Si no es Admin Y no es el dueño -> Error
  if (!isAdmin && match.userId !== userId) {
    throw new Error("No tienes permiso para cancelar esta reserva");
  }

  // Borramos
  return await prisma.match.delete({
    where: { id: Number(matchId) },
  });
};

module.exports = {
  createMatch,
  getMatches,
  deleteMatch,
};
