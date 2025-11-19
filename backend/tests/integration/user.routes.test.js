const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Integration: User Routes", () => {
  // Limpieza total antes y después
  beforeAll(async () => await prisma.user.deleteMany());
  afterEach(async () => await prisma.user.deleteMany());
  afterAll(async () => await prisma.$disconnect());

  // Crear usuario
  test("POST /api/users - Debería crear un usuario real en la BD", async () => {
    const newUser = {
      name: "Usuario",
      surnames: "Prueba",
      email: "usuario.prueba@test.com",
      password: "password",
      role: "admin",
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("usuario.prueba@test.com");
    expect(response.body).not.toHaveProperty("password");

    const dbUser = await prisma.user.findUnique({
      where: { email: "usuario.prueba@test.com" },
    });
    expect(dbUser).toBeTruthy();
    expect(dbUser.password).not.toBe("password");
  });

  test("POST /api/users - Debería fallar 400 si el email está duplicado", async () => {
    // Preparamos el escenario: Creamos un usuario
    await prisma.user.create({
      data: {
        name: "Otro usuario",
        surnames: "Prueba",
        email: "otrousuario.prueba@test.com",
        password: "password",
      },
    });

    // Intentamos crear el mismo
    const response = await request(app).post("/api/users").send({
      name: "Nuevo usuario",
      surnames: "Prueba",
      email: "otrousuario.prueba@test.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/email/i);
  });

  // Obtener todos los usuarios
  test("GET /api/users - Debería devolver una lista de usuarios", async () => {
    // Insertamos 2 usuarios directamente en BD
    await prisma.user.createMany({
      data: [
        {
          name: "User1",
          surnames: "S1",
          email: "u1@test.com",
          password: "123",
        },
        {
          name: "User2",
          surnames: "S2",
          email: "u2@test.com",
          password: "123",
        },
      ],
    });

    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).not.toHaveProperty("password");
  });

  // Obtener usuario por ID
  test("GET /api/users/:id - Debería devolver un usuario específico", async () => {
    const user = await prisma.user.create({
      data: {
        name: "User3",
        surnames: "S3",
        email: "user3.s3@test.com",
        password: "123",
      },
    });

    const response = await request(app).get(`/api/users/${user.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("user3.s3@test.com");
  });

  test("GET /api/users/:id - Debería devolver 404 si no existe", async () => {
    const response = await request(app).get("/api/users/9999");
    expect(response.statusCode).toBe(404);
  });

  test("GET /api/users/:id - Debería devolver 400 si ID no es número", async () => {
    const response = await request(app).get("/api/users/abc");
    expect(response.statusCode).toBe(400);
  });

  // Actualizar usuario
  test("PUT /api/users/:id - Debería actualizar un usuario", async () => {
    const user = await prisma.user.create({
      data: {
        name: "User4",
        surnames: "S4",
        email: "user4.s4@test.com",
        password: "123",
      },
    });

    const updates = { name: "Nuevo Nombre", password: "456", role: "admin" };

    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .send(updates);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Nuevo Nombre");

    // Verificamos en BD
    const updatedDbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(updatedDbUser.name).toBe("Nuevo Nombre");
    expect(updatedDbUser.role).toBe("admin");

    // Verificamos que la contraseña CAMBIÓ y NO es texto plano
    expect(updatedDbUser.password).not.toBe("123");
    expect(updatedDbUser.password).not.toBe("456");
  });

  // Borrar un usuario
  test("DELETE /api/users/:id - Debería eliminar un usuario", async () => {
    const user = await prisma.user.create({
      data: {
        name: "User5",
        surnames: "S5",
        email: "user5.s5@test.com",
        password: "123",
      },
    });

    const response = await request(app).delete(`/api/users/${user.id}`);

    expect(response.statusCode).toBe(200);

    // Verificamos que ya no existe en BD
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser).toBeNull();
  });
});
