const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

describe("Integration: Match Routes", () => {
  // Limpieza exhaustiva
  beforeAll(async () => {
    await prisma.match.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.match.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => await prisma.$disconnect());

  const createUserAndToken = async (role = "user") => {
    const user = await prisma.user.create({
      data: {
        name: role,
        surnames: "test",
        email: `${role}-${Date.now()}@test.com`,
        password: "hash",
        role: role,
      },
    });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    return { user, token };
  };

  const createCourt = async () => {
    return await prisma.court.create({
      data: {
        name: "Pista Test",
        price: 20,
        type: "INDOOR",
        surface: "CRISTAL",
      },
    });
  };

  // Test de creación
  test("POST /api/matches - Debería crear una reserva válida", async () => {
    const { token } = await createUserAndToken();
    const court = await createCourt();

    // Fechas futuras (Mañana a las 10:00)
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);

    const end = new Date(start);
    end.setHours(11, 30, 0, 0); // 1.5 horas

    const response = await request(app)
      .post("/api/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courtId: court.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.totalPrice).toBe(30); // 1.5h * 20€ = 30€
  });

  test("POST /api/matches - Debería fallar 409 si hay SOLAPAMIENTO", async () => {
    const { user, token } = await createUserAndToken();
    const court = await createCourt();

    // Mañana a las 10:00
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start);
    end.setHours(12, 0, 0, 0);

    // Creamos la primera reserva directamente en BD
    await prisma.match.create({
      data: {
        userId: user.id,
        courtId: court.id,
        startTime: start,
        endTime: end,
        totalPrice: 40,
      },
    });

    // Intentamos crear otra que empieza a las 11:00 (¡Conflicto!)
    const conflictStart = new Date(start);
    conflictStart.setHours(11, 0, 0, 0);
    const conflictEnd = new Date(start);
    conflictEnd.setHours(13, 0, 0, 0);

    const response = await request(app)
      .post("/api/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courtId: court.id,
        startTime: conflictStart.toISOString(),
        endTime: conflictEnd.toISOString(),
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toMatch(/ya está reservada/i);
  });

  test("POST /api/matches - Debería fallar 400 si es en el pasado", async () => {
    const { token } = await createUserAndToken();
    const court = await createCourt();

    const pastDate = new Date("2000-01-01");

    const response = await request(app)
      .post("/api/matches")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courtId: court.id,
        startTime: pastDate.toISOString(),
        endTime: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(400);
  });

  // Test listado
  test("GET /api/matches - Usuario normal solo ve SUS partidos", async () => {
    const { user: user1, token: token1 } = await createUserAndToken();
    const { user: user2 } = await createUserAndToken(); // Otro usuario
    const court = await createCourt();

    const now = new Date();
    // Partido de User 1
    await prisma.match.create({
      data: {
        userId: user1.id,
        courtId: court.id,
        startTime: now,
        endTime: now,
        totalPrice: 20,
      },
    });
    // Partido de User 2
    await prisma.match.create({
      data: {
        userId: user2.id,
        courtId: court.id,
        startTime: now,
        endTime: now,
        totalPrice: 20,
      },
    });

    const response = await request(app)
      .get("/api/matches")
      .set("Authorization", `Bearer ${token1}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1); // Solo ve el suyo
    expect(response.body[0].userId).toBe(user1.id);
  });

  // Test de borrado
  test("DELETE /api/matches/:id - Usuario NO puede borrar partido de otro", async () => {
    const { token: tokenAttacker } = await createUserAndToken(); // Atacante
    const { user: victim } = await createUserAndToken(); // Víctima
    const court = await createCourt();

    // Partido de la víctima
    const match = await prisma.match.create({
      data: {
        userId: victim.id,
        courtId: court.id,
        startTime: new Date(),
        endTime: new Date(),
        totalPrice: 20,
      },
    });

    const response = await request(app)
      .delete(`/api/matches/${match.id}`)
      .set("Authorization", `Bearer ${tokenAttacker}`);

    expect(response.statusCode).toBe(403); // "Error genérico" si no es dueño
  });
});
