const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Padel App API",
      version: "1.0.0",
      description: "API para gestión de pistas y partidos de pádel",
      contact: {
        name: "Nacho García",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de Desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Aquí le decimos dónde buscar los comentarios de documentación
  apis: ["./routes/*.js"],
};

module.exports = swaggerOptions;
