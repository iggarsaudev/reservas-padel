const request = require("supertest");
const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

describe("Integration: User Routes", () => {
  beforeAll(async () => await prisma.user.deleteMany());
  afterEach(async () => await prisma.user.deleteMany());
  afterAll(async () => await prisma.$disconnect());

  // Crear token rápido
  const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  };

  // Crear usuario
  test("POST /api/users - Registro debe ser público", async () => {
    const newUser = {
      name: "Test",
      surnames: "Test",
      email: "public@test.com",
      password: "123",
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.statusCode).toBe(201);
  });

  // Obtener todos los usuarios
  test("GET /api/users - Admin puede ver todos", async () => {
    // Crear Admin
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        surnames: "Test",
        email: "admin@test.com",
        password: "123",
        role: "admin",
      },
    });
    const token = generateToken(admin);

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("GET /api/users - Usuario normal NO puede ver todos (403)", async () => {
    const user = await prisma.user.create({
      data: {
        name: "User",
        surnames: "Test",
        email: "user@test.com",
        password: "123",
        role: "user",
      },
    });
    const token = generateToken(user);

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
  });

  // Obtener usuario por ID
  test("GET /api/users/:id - Un usuario debería poder ver SU perfil", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Yo",
        surnames: "Test",
        email: "yo@test.com",
        password: "123",
      },
    });
    const token = generateToken(user);

    const response = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("yo@test.com");
  });

  test("GET /api/users/:id - Debería devolver 404 si no existe (con Token Admin)", async () => {
    // Necesitamos ser admin o dueño para que el middleware nos deje pasar y llegar al controlador
    // Creamos un admin para probar el 404
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        surnames: "Test",
        email: "a@a.com",
        password: "x",
        role: "admin",
      },
    });
    const token = generateToken(admin);

    const response = await request(app)
      .get("/api/users/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });

  // Actualizar usuario
  test("PUT /api/users/:id - Un usuario debería poder actualizarse a SÍ MISMO", async () => {
    // Creamos el usuario
    const user = await prisma.user.create({
      data: {
        name: "Original",
        surnames: "Test",
        email: "me@test.com",
        password: "123",
        role: "user",
      },
    });

    // Generamos su token
    const token = generateToken(user);

    const updates = { name: "Nuevo Nombre", password: "456" };

    // Hacemos la petición con su token
    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updates);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Nuevo Nombre");

    // Verificamos en BD
    const updatedDbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(updatedDbUser.name).toBe("Nuevo Nombre");
    expect(updatedDbUser.password).not.toBe("123");
    expect(updatedDbUser.password).not.toBe("456");
  });

  // Borrar un usuario
  test("DELETE /api/users/:id - Usuario puede borrarse a sí mismo", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Me",
        surnames: "Test",
        email: "me@test.com",
        password: "123",
      },
    });
    const token = generateToken(user);

    const response = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("DELETE /api/users/:id - Usuario NO puede borrar a otro", async () => {
    const victim = await prisma.user.create({
      data: {
        name: "Victim",
        surnames: "Test",
        email: "v@test.com",
        password: "123",
      },
    });
    const attacker = await prisma.user.create({
      data: {
        name: "Attacker",
        surnames: "Test",
        email: "a@test.com",
        password: "123",
      },
    });
    const tokenAttacker = generateToken(attacker);

    const response = await request(app)
      .delete(`/api/users/${victim.id}`) // Intenta borrar a la víctima
      .set("Authorization", `Bearer ${tokenAttacker}`);

    expect(response.statusCode).toBe(403); // Prohibido
  });
});
