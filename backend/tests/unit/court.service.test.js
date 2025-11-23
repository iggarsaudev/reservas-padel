const courtService = require("../../services/court.service");
const { PrismaClient } = require("@prisma/client");

// Mock de Prisma
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    court: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("Court Service (Unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createCourt debería crear una pista con valores por defecto", async () => {
    const inputData = { name: "Pista 1", price: 10 };
    // Simulamos que la BD devuelve el objeto completo con defaults
    const dbResponse = {
      id: 1,
      ...inputData,
      type: "INDOOR",
      surface: "CRISTAL",
      isAvailable: true,
    };

    prisma.court.create.mockResolvedValue(dbResponse);

    const result = await courtService.createCourt(inputData);

    expect(result).toEqual(dbResponse);
    // Verificamos que la lógica de "defaults" (|| y ??) funcionó antes de llamar a Prisma
    const callArgs = prisma.court.create.mock.calls[0][0];
    expect(callArgs.data.type).toBe("INDOOR");
    expect(callArgs.data.isAvailable).toBe(true);
  });

  test("createCourt debería respetar isAvailable: false", async () => {
    const inputData = { name: "Pista Obras", price: 10, isAvailable: false };
    const dbResponse = {
      ...inputData,
      id: 2,
      type: "INDOOR",
      surface: "CRISTAL",
    };

    prisma.court.create.mockResolvedValue(dbResponse);

    await courtService.createCourt(inputData);

    const callArgs = prisma.court.create.mock.calls[0][0];
    // Si se usa '||', esto fallaría y sería true. Con '??' debe ser false.
    expect(callArgs.data.isAvailable).toBe(false);
  });

  test("updateCourt debería parsear el precio si viene en los datos", async () => {
    const inputData = { price: "25.50" }; // Viene como String
    const dbResponse = { id: 1, name: "Pista", price: 25.5 };

    prisma.court.update.mockResolvedValue(dbResponse);

    await courtService.updateCourt(1, inputData);

    const callArgs = prisma.court.update.mock.calls[0][0];
    // Verificamos que el servicio hizo el parseFloat
    expect(callArgs.data.price).toBe(25.5);
  });
});
