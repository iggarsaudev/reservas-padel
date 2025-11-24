const isOwnerOrAdmin = (req, res, next) => {
  // 1Verificar que el usuario está autenticado (req.user existe)
  // Esto asume que 'authenticateToken' se ejecutó antes
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  // Extraer datos
  const userRole = req.user.role;
  const userIdFromToken = req.user.id; // Quién eres tú
  const userIdFromUrl = Number(req.params.id); // A quién quieres acceder

  // Comprobar permisos
  // Si eres Admin... PASAS.
  if (userRole === "admin") {
    return next();
  }

  // Si no eres Admin, pero eres el dueño de la cuenta... PASAS.
  if (userIdFromToken === userIdFromUrl) {
    return next();
  }

  // Si no eres ni admin ni dueño -> 403
  return res
    .status(403)
    .json({ error: "Acceso denegado: No tienes permisos sobre este usuario" });
};

module.exports = isOwnerOrAdmin;
