const validateId = (req, res, next) => {
  const { id } = req.params;

  // Comprueba si es un número
  if (isNaN(Number(id))) {
    // Si NO es un número, devuelve error y CORTA la ejecución
    return res.status(400).json({ error: "El ID debe ser un número válido" });
  }

  // Si pasa la validación, pasamos al siguiente
  next();
};

module.exports = validateId;
