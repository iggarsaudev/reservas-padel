const matchService = require("../services/match.service");

// Crear reserva
const createMatch = async (req, res) => {
  // Datos del formulario
  const { courtId, startTime, endTime } = req.body;

  // Datos seguros del Token
  const userId = req.user.id;

  try {
    const newMatch = await matchService.createMatch(
      userId,
      courtId,
      startTime,
      endTime
    );
    res.status(201).json(newMatch);
  } catch (error) {
    if (error.message === "Pista no encontrada") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "La pista ya está reservada en ese horario") {
      return res.status(409).json({ error: error.message }); // 409 Conflict
    }
    if (
      error.message.includes("posterior") ||
      error.message.includes("pasado")
    ) {
      return res.status(400).json({ error: error.message }); // 400 Bad Request
    }

    console.error(error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

// Obtener reservas
const getMatches = async (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";

  try {
    // El servicio decide si devuelve todas (admin) o solo las tuyas (user)
    const matches = await matchService.getMatches(userId, isAdmin);
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
};

// Cancelar reserva
const deleteMatch = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";

  try {
    await matchService.deleteMatch(id, userId, isAdmin);
    res.json({ message: "Reserva cancelada correctamente" });
  } catch (error) {
    if (error.message === "Reserva no encontrada") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("permiso")) {
      return res.status(403).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "Error al cancelar la reserva" });
  }
};

module.exports = {
  createMatch,
  getMatches,
  deleteMatch,
};
