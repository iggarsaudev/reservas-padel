const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const authenticateToken = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Gestión de reservas de pistas
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courtId
 *               - date
 *               - time
 *             properties:
 *               courtId:
 *                 type: integer
 *                 description: ID de la pista
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha en formato YYYY-MM-DD
 *                 example: "2025-10-20"
 *               time:
 *                 type: string
 *                 description: Hora de la reserva
 *                 example: "10:30"
 *     responses:
 *       201:
 *         description: Reserva creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado (Token faltante)
 *       403:
 *         description: Token inválido
 *       409:
 *         description: Conflicto - La pista ya está reservada a esa hora
 */
router.post("/", authenticateToken, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Obtener historial de reservas del usuario actual
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get("/", authenticateToken, bookingController.getUserBookings);

/**
 * @swagger
 * /api/bookings/court/{courtId}:
 *   get:
 *     summary: Obtener horas ocupadas de una pista en una fecha específica
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la pista
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha a consultar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de horas ocupadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["09:00", "10:30", "18:00"]
 *       500:
 *         description: Error del servidor
 */
router.get("/court/:courtId", bookingController.getBookingsByCourtAndDate);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancelar una reserva
 *     description: Elimina una reserva existente si pertenece al usuario autenticado.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID único de la reserva a cancelar
 *     responses:
 *       200:
 *         description: Reserva cancelada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reserva cancelada correctamente"
 *       401:
 *         description: No autorizado (Token no proporcionado)
 *       403:
 *         description: Prohibido (La reserva no pertenece al usuario)
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete("/:id", authenticateToken, bookingController.deleteBooking);

module.exports = router;
