const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createMatch,
  getMatches,
  deleteMatch,
} = require("../controllers/match.controller");

// Modelo
/**
 * @swagger
 *  components:
 *    schemas:
 *      MatchInput:
 *        type: object
 *        required:
 *          - courtId
 *          - startTime
 *          - endTime
 *        properties:
 *          courtId:
 *            type: integer
 *            description: ID de la pista
 *          startTime:
 *            type: string
 *            format: date-time
 *            description: Fecha y hora de inicio (ISO 8601)
 *          endTime:
 *            type: string
 *            format: date-time
 *            description: Fecha y hora de fin (ISO 8601)
 *        example:
 *          courtId: 1
 *          startTime: "2025-11-25T10:00:00Z"
 *          endTime: "2025-11-25T11:30:00Z"
 */

// Ruta base
/**
 * @swagger
 *  /api/matches:
 *    post:
 *      summary: Crear una reserva
 *      tags: [Matches]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MatchInput'
 *      responses:
 *        201:
 *          description: Reserva creada con éxito
 *        400:
 *          description: Datos inválidos o fecha pasada
 *        409:
 *          description: Conflicto (Pista ocupada)
 *        404:
 *          description: Pista no encontrada
 */
router.post("/", authenticateToken, createMatch);

/**
 * @swagger
 *   /api/matches:
 *     get:
 *       summary: Ver reservas (Admin ve todas, User ve las suyas)
 *       tags: [Matches]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Lista de reservas
 */
router.get("/", authenticateToken, getMatches);

/**
 * @swagger
 *  /api/matches/{id}:
 *    delete:
 *      summary: Cancelar una reserva
 *      tags: [Matches]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID de la reserva
 *      responses:
 *        200:
 *          description: Reserva cancelada
 *        403:
 *          description: No tienes permiso (no es tuya)
 *        404:
 *          description: Reserva no encontrada
 */
router.delete("/:id", authenticateToken, deleteMatch);

module.exports = router;
