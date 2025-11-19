const userService = require("../../services/user.service");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Mock de Prisma
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock de Bcrypt (para que no pierda tiempo encriptando de verdad en los tests unitarios)
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const prisma = new PrismaClient();

describe("User Service (Unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createUser debería hashear la contraseña y no devolverla", async () => {
    const input = { name: "Unit", email: "unit@test.com", password: "plain" };
    const dbResult = { ...input, id: 1, password: "hashed_secret" };

    bcrypt.hash.mockResolvedValue("hashed_secret"); // Simulamos que bcrypt devuelve esto
    prisma.user.create.mockResolvedValue(dbResult); // Simulamos que la BD crea esto

    const result = await userService.createUser(input);

    expect(bcrypt.hash).toHaveBeenCalledWith("plain", 10); // ¿Se llamó al encriptador?
    expect(prisma.user.create).toHaveBeenCalled(); // ¿Se llamó a guardar?
    expect(result).not.toHaveProperty("password"); // ¿Se limpió el password?
    expect(result.name).toBe("Unit");
  });

  test("getUserById debería devolver null si no existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const result = await userService.getUserById(999);
    expect(result).toBeNull();
  });
});
