const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Obtener el token de la cabecera (Authorization: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Quitamos la palabra "Bearer"

  // Si no hay token, error 401 (No autorizado)
  if (token == null) {
    return res
      .status(401)
      .json({ error: "Acceso denegado: Token no proporcionado" });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, userDecoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    // Si es válido, guardamos los datos del usuario en la request
    req.user = userDecoded;
    next(); // ¡Adelante! Pasa al controlador
  });
};

module.exports = authenticateToken;
