const authService = require("../services/auth.service");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Llamamos al servicio que busca, compara y firma el token
    const result = await authService.login(email, password);

    // Si todo va bien, devolvemos Token + Datos de usuario
    res.json(result);
  } catch (error) {
    // Manejo de errores de seguridad
    if (error.message === "Credenciales inválidas") {
      // 401 significa "No tienes permiso / No te reconozco"
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Error inesperado
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = {
  login,
};
