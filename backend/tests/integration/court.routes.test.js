const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

describe("Integration: Court Routes", () => {
  // Limpieza total
  beforeAll(async () => {
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => await prisma.$disconnect());

  // Crear Admin y devolver Token
  const getAdminToken = async () => {
    // Crear usuario admin
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        surnames: "Test",
        email: `admin-${Date.now()}@test.com`,
        password: "hash",
        role: "admin",
      },
    });
    // Firmar token
    return jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET);
  };

  // Crear una pista
  test("POST /api/courts - Debería crear una pista (con Token Admin)", async () => {
    const token = await getAdminToken();

    const newCourt = {
      name: "Pista Central",
      type: "OUTDOOR",
      surface: "CRISTAL",
      price: 15.5,
    };

    const response = await request(app)
      .post("/api/courts")
      .set("Authorization", `Bearer ${token}`)
      .send(newCourt);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Pista Central");
  });

  test("POST /api/courts - Debería fallar 401 si no hay token", async () => {
    const newCourt = { name: "Pista Hacker", price: 10 };
    const response = await request(app).post("/api/courts").send(newCourt);
    expect(response.statusCode).toBe(401);
  });

  // Obtener todas las pistas
  test("GET /api/courts - Debería devolver lista (Público)", async () => {
    await prisma.court.create({ data: { name: "Pista 1", price: 10 } });

    const response = await request(app).get("/api/courts"); // Sin token
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
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
  test("PUT /api/courts/:id - Debería actualizar (con Token Admin)", async () => {
    const token = await getAdminToken();
    const court = await prisma.court.create({
      data: { name: "Vieja", price: 10 },
    });

    const response = await request(app)
      .put(`/api/courts/${court.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Nueva" });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Nueva");
  });

  // Borrar pista
  test("DELETE /api/courts/:id - Debería borrar (con Token Admin)", async () => {
    const token = await getAdminToken();
    const court = await prisma.court.create({
      data: { name: "Borrar", price: 10 },
    });

    const response = await request(app)
      .delete(`/api/courts/${court.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
