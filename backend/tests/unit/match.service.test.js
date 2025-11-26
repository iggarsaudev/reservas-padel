const matchService = require("../../services/match.service");
const { PrismaClient } = require("@prisma/client");

// Mocks
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    match: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    court: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("Match Service (Unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Crear pista
  test("createMatch debería lanzar error si la fecha es en el pasado", async () => {
    const pastStart = new Date("2000-01-01");
    const pastEnd = new Date("2000-01-01T01:30:00");

    await expect(
      matchService.createMatch(1, 1, pastStart, pastEnd)
    ).rejects.toThrow("No puedes reservar en el pasado");
  });

  test("createMatch debería lanzar error si hay solapamiento (Pista Ocupada)", async () => {
    // Preparamos fechas futuras válidas
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    // Simulamos que la Pista existe
    prisma.court.findUnique.mockResolvedValue({ id: 1, price: 20 });

    // Simulamos que findFirst ENCUENTRA un partido conflictivo
    prisma.match.findFirst.mockResolvedValue({
      id: 99,
      startTime: start,
      endTime: end,
    });

    // Ejecutamos y esperamos el error
    await expect(matchService.createMatch(1, 1, start, end)).rejects.toThrow(
      "La pista ya está reservada en ese horario"
    );
  });

  test("createMatch debería calcular el precio y guardar si todo está libre", async () => {
    // Fechas futuras
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start);
    end.setHours(11, 30, 0, 0); // 1.5 horas

    // Mocks
    prisma.court.findUnique.mockResolvedValue({ id: 1, price: 20 }); // Precio 20€/hora
    prisma.match.findFirst.mockResolvedValue(null); // ¡Libre! No hay solapamiento

    const mockCreatedMatch = { id: 1, totalPrice: 30 }; // 1.5h * 20€ = 30€
    prisma.match.create.mockResolvedValue(mockCreatedMatch);

    // Ejecución
    const result = await matchService.createMatch(1, 1, start, end);

    // Verificaciones
    expect(result.totalPrice).toBe(30);
    expect(prisma.match.create).toHaveBeenCalled();
  });
});
