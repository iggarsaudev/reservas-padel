const authService = require("../../services/auth.service");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mocks
jest.mock("@prisma/client", () => {
  const mPrismaClient = { user: { findUnique: jest.fn() } };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const prisma = new PrismaClient();

describe("Auth Service (Unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("login debería lanzar error si el usuario no existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.login("fake@email.com", "123")).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  test("login debería devolver token si todo es correcto", async () => {
    const fakeUser = {
      id: 1,
      email: "test@test.com",
      password: "hashedPassword",
      role: "user",
    };

    prisma.user.findUnique.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true); // Contraseña coincide
    jwt.sign.mockReturnValue("fake_token"); // Token generado

    const result = await authService.login("test@test.com", "123");

    expect(result).toHaveProperty("token", "fake_token");
    expect(prisma.user.findUnique).toHaveBeenCalled();
  });
});
