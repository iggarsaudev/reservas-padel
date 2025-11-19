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
app.use("/api/users", userRoutes);

// --- Aquí cargaríamos otras rutas (ej. app.use('/api/partidos', partidoRoutes)) ---

module.exports = app;
