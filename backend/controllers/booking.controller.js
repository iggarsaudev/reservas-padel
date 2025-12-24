const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear reserva
const createBooking = async (req, res) => {
  const { courtId, date, time } = req.body;
  const userId = req.user.id; // Viene del token (middleware de autenticación)

  try {
    // Convertir la fecha string a objeto Date (para Prisma)
    const bookingDate = new Date(date);

    // Comprobar si ya existe (Doble seguridad, aparte del @@unique)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        courtId: parseInt(courtId),
        date: bookingDate,
        time: time,
      },
    });

    if (existingBooking) {
      return res.status(409).json({ error: "Esta hora ya está reservada" });
    }

    // Crear la reserva
    const newBooking = await prisma.booking.create({
      data: {
        date: bookingDate,
        time,
        userId,
        courtId: parseInt(courtId),
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    // Si viola la restricción @@unique
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Esta hora ya está reservada" });
    }
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

// Obtener las reservas de un día (Para pintar el calendario)
const getBookingsByCourtAndDate = async (req, res) => {
  const { courtId } = req.params;
  const { date } = req.query; // Esperamos ?date=2025-10-28

  try {
    const searchDate = new Date(date);

    const bookings = await prisma.booking.findMany({
      where: {
        courtId: parseInt(courtId),
        date: searchDate,
      },
      select: { time: true }, // Solo nos interesa saber la hora ocupada
    });

    // Devolvemos un array simple de horas: ["10:00", "12:30"]
    const busyTimes = bookings.map((b) => b.time);
    res.json(busyTimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener disponibilidad" });
  }
};

// Obtener mis pistas (Usuario logueado)
const getUserBookings = async (req, res) => {
  const userId = req.user.id; // Viene del token

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        court: true, // Incluir datos de la pista
      },
      orderBy: {
        date: "desc", // Las más recientes primero
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener tus reservas" });
  }
};

// Cancelar una reserva
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Buscamos la reserva para ver si existe y de quién es
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    // Si no existe
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Seguridad: Verificamos que la reserva pertenezca al usuario que intenta borrarla
    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para cancelar esta reserva" });
    }

    // Procedemos a borrar
    await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Reserva cancelada correctamente" });
  } catch (error) {
    console.error("Error al cancelar:", error);
    res.status(500).json({ error: "Error al cancelar la reserva" });
  }
};

module.exports = {
  createBooking,
  getBookingsByCourtAndDate,
  getUserBookings,
  deleteBooking,
};
