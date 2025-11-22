const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener todas las pistas
const getAllCourts = async () => {
  return await prisma.court.findMany();
};

// Crear una pista
const createCourt = async (courtData) => {
  const newCourt = await prisma.court.create({
    data: {
      name: courtData.name,
      type: courtData.type || "INDOOR",
      surface: courtData.surface || "CRISTAL",
      price: parseFloat(courtData.price),
      isAvailable: courtData.isAvailable ?? true,
    },
  });

  return newCourt;
};

// Obtener por ID
const getCourtById = async (id) => {
  const court = await prisma.court.findUnique({
    where: { id: Number(id) },
  });

  if (!court) return null;

  return court;
};

// Actualizar pista
const updateCourt = async (id, courtData) => {
  let dataToUpdate = {
    name: courtData.name,
    type: courtData.type,
    surface: courtData.surface,
    isAvailable: courtData.isAvailable,
  };

  // Solo procesamos el precio si nos lo envían
  if (courtData.price !== undefined) {
    dataToUpdate.price = parseFloat(courtData.price);
  }

  const updatedCourt = await prisma.court.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });

  return updatedCourt;
};

// Borrar pista
const deleteCourt = async (id) => {
  return await prisma.court.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  getAllCourts,
  createCourt,
  getCourtById,
  updateCourt,
  deleteCourt,
};
