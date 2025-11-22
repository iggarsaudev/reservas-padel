const courtService = require("../services/court.service");

// Obtener todas las pistas
const getAllCourts = async (req, res) => {
  try {
    const courts = await courtService.getAllCourts();
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las pistas" });
  }
};

// Crear una pista
const createCourt = async (req, res) => {
  try {
    const newCourt = await courtService.createCourt(req.body);
    res.status(201).json(newCourt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la pista" });
  }
};

// Obtener por ID
const getCourtById = async (req, res) => {
  const { id } = req.params;

  try {
    const court = await courtService.getCourtById(id);

    if (!court) {
      return res.status(404).json({ error: "Pista no encontrada" });
    }

    res.json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la pista" });
  }
};

// Actualizar pista
const updateCourt = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCourt = await courtService.updateCourt(id, req.body);
    res.json(updatedCourt);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pista no encontrada" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la pista" });
  }
};

// Borrar pista
const deleteCourt = async (req, res) => {
  const { id } = req.params;

  try {
    await courtService.deleteCourt(id);
    res.json({ message: "Pista eliminada correctamente" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pista no encontrada" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la pista" });
  }
};

module.exports = {
  getAllCourts,
  createCourt,
  getCourtById,
  updateCourt,
  deleteCourt,
};
