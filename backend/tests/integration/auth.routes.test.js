const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

describe("Integration: Auth Routes", () => {
  beforeAll(async () => await prisma.user.deleteMany());
  afterEach(async () => await prisma.user.deleteMany());
  afterAll(async () => await prisma.$disconnect());

  test("POST /api/auth/login - Debería loguear correctamente y devolver token", async () => {
    // Preparamos el usuario en la BD
    const hashedPassword = await bcrypt.hash("password123", 10);

    await prisma.user.create({
      data: {
        name: "LoginUser",
        surnames: "Test",
        email: "login@test.com",
        password: hashedPassword,
        role: "user",
      },
    });

    // Intentamos loguearnos
    const response = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe("login@test.com");
    expect(response.body.user).not.toHaveProperty("password");
  });

  test("POST /api/auth/login - Debería fallar 401 con contraseña incorrecta", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.create({
      data: {
        name: "Fail",
        surnames: "User",
        email: "fail@test.com",
        password: hashedPassword,
      },
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "fail@test.com",
      password: "WRONG_PASSWORD",
    });

    expect(response.statusCode).toBe(401);
  });

  test("POST /api/auth/login - Debería fallar 401 si el usuario no existe", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "ghost@test.com",
      password: "123",
    });

    expect(response.statusCode).toBe(401);
  });
});
