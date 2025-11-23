const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");

// Prisma real conectado a la BD de Test
const prisma = new PrismaClient();

describe("Integration: Court Routes", () => {
  // Limpieza total antes y después
  beforeAll(async () => await prisma.court.deleteMany());
  afterEach(async () => await prisma.court.deleteMany());
  afterAll(async () => await prisma.$disconnect());

  // Crear una pista
  test("POST /api/courts - Debería crear una pista", async () => {
    const newCourt = {
      name: "Pista Central",
      type: "OUTDOOR",
      surface: "CRISTAL",
      price: 15.5,
    };

    const response = await request(app).post("/api/courts").send(newCourt);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Pista Central");
    expect(response.body.isAvailable).toBe(true); // Default

    // Verificación en BD
    const dbCourt = await prisma.court.findFirst({
      where: { name: "Pista Central" },
    });
    expect(dbCourt).toBeTruthy();
    expect(dbCourt.price).toBe(15.5);
  });

  test("POST /api/courts - Debería respetar isAvailable: false", async () => {
    const closedCourt = { name: "Pista Rota", price: 10, isAvailable: false };

    const response = await request(app).post("/api/courts").send(closedCourt);

    expect(response.body.isAvailable).toBe(false);
  });

  // Obtener todas las pistas
  test("GET /api/courts - Debería devolver lista de pistas", async () => {
    await prisma.court.createMany({
      data: [
        { name: "Pista 1", price: 10 },
        { name: "Pista 2", price: 12 },
      ],
    });

    const response = await request(app).get("/api/courts");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  // Obtener por ID
  test("GET /api/courts/:id - Debería devolver 404 si no existe", async () => {
    const response = await request(app).get("/api/courts/999");
    expect(response.statusCode).toBe(404);
  });

  test("GET /api/courts/:id - Debería devolver la pista correcta", async () => {
    const court = await prisma.court.create({
      data: { name: "Solo Una", price: 20 },
    });

    const response = await request(app).get(`/api/courts/${court.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Solo Una");
  });

  // Actualizar pista
  test("PUT /api/courts/:id - Debería actualizar precio y estado", async () => {
    const court = await prisma.court.create({
      data: { name: "Pista Vieja", price: 10, isAvailable: true },
    });

    const updates = { price: 30, isAvailable: false };

    const response = await request(app)
      .put(`/api/courts/${court.id}`)
      .send(updates);

    expect(response.statusCode).toBe(200);
    expect(response.body.price).toBe(30);
    expect(response.body.isAvailable).toBe(false);

    // Verificar BD
    const dbCourt = await prisma.court.findUnique({ where: { id: court.id } });
    expect(dbCourt.price).toBe(30);
  });

  // Borrar pista
  test("DELETE /api/courts/:id - Debería eliminar la pista", async () => {
    const court = await prisma.court.create({
      data: { name: "A Borrar", price: 10 },
    });

    const response = await request(app).delete(`/api/courts/${court.id}`);

    expect(response.statusCode).toBe(200);

    const dbCourt = await prisma.court.findUnique({ where: { id: court.id } });
    expect(dbCourt).toBeNull();
  });
});
