const isAdmin = (req, res, next) => {
  // req.user viene del middleware anterior (authenticateToken)
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  // Verificamos el rol
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: Requiere rol de Administrador" });
  }

  next(); // Es admin, ¡pasa!
};

module.exports = isAdmin;
