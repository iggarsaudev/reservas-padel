const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = require("./swaggerOptions.js");

// Inicializar
const app = express();
const PORT = 3001;

// Middlewares
app.use(express.json()); // Para que entienda JSON
// Usar Cors
app.use(cors());

// Configuración de Swagger
const specs = swaggerJsDoc(swaggerOptions);
// La ruta será /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
const userRoutes = require("./routes/user.routes.js");
const courtRoutes = require("./routes/court.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const matchRoutes = require("./routes/match.routes.js");
app.use("/api/users", userRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);

module.exports = app;
