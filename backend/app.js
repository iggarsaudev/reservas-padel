const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = require("./swaggerOptions.js");

// Inicializar
const app = express();
const PORT = 3001;

// Middlewares
app.use(express.json()); // Para que entienda JSON

// Configuración de Swagger ---
const specs = swaggerJsDoc(swaggerOptions);
// La ruta será /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// ---------------------------------------

// Rutas
const userRoutes = require("./routes/user.routes.js");
const courtRoutes = require("./routes/court.routes.js");
const authRoutes = require("./routes/auth.routes.js");
app.use("/api/users", userRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/auth", authRoutes);

// --- Aquí cargaríamos otras rutas (ej. app.use('/api/partidos', partidoRoutes)) ---

module.exports = app;
