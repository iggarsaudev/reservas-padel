const express = require("express");
const router = express.Router();
const validateId = require("../middlewares/validateId.js");
const authenticateToken = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin.js");

const {
  getAllCourts,
  createCourt,
  getCourtById,
  updateCourt,
  deleteCourt,
} = require("../controllers/court.controller");

// Modelo
/**
 * @swagger
 *  components:
 *    schemas:
 *      Court:
 *        type: object
 *        required:
 *          - name
 *          - price
 *        properties:
 *          id:
 *            type: integer
 *            description: ID autogenerado del usuario
 *          name:
 *            type: string
 *            description: Nombre de la pista
 *          type:
 *            type: string
 *            enum:
 *              - INDOOR
 *              - OUTDOOR
 *            description: Tipo de pista (default INDOOR)
 *          surface:
 *            type: string
 *            enum:
 *              - MURO
 *              - CRISTAL
 *            description: Superficie (default CRISTAL)
 *          price:
 *            type: number
 *            format: float
 *            description: Precio por reserva
 *          isAvailable:
 *            type: boolean
 *            description: Si está disponible
 *        example:
 *          name: Pista Central
 *          type: OUTDOOR
 *          surface: CRISTAL
 *          price: 12.50
 *          isAvailable: true
 */

// Ruta base
/**
 * @swagger
 *  /api/courts:
 *    get:
 *      summary: Obtiene todas las pistas
 *      tags: [Courts]
 *      responses:
 *        200:
 *          description: Lista de pistas
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Court'
 */
router.get("/", getAllCourts);

/**
 * @swagger
 *  /api/courts:
 *    post:
 *      summary: Crea una nueva pista
 *      tags: [Courts]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Court'
 *      responses:
 *        201:
 *          description: Pista creada
 *        500:
 *          description: Error del servidor
 */
router.post("/", authenticateToken, isAdmin, createCourt);

/**
 * @swagger
 *  /api/courts/{id}:
 *    get:
 *      summary: Obtiene una pista por ID
 *      tags: [Courts]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID de la pista
 *      responses:
 *        200:
 *          description: Datos de la pista
 *        404:
 *          description: Pista no encontrada
 *        400:
 *          description: ID inválido
 */
router.get("/:id", validateId, getCourtById);

/**
 * @swagger
 *  /api/courts/{id}:
 *    put:
 *      summary: Actualiza una pista
 *      tags: [Courts]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID de la pista
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Court'
 *      responses:
 *        200:
 *          description: Pista actualizada
 *        404:
 *          description: Pista no encontrada
 */
router.put("/:id", validateId, authenticateToken, isAdmin, updateCourt);

/**
 * @swagger
 *  /api/courts/{id}:
 *    delete:
 *      summary: Elimina una pista
 *      tags: [Courts]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID de la pista
 *      responses:
 *        200:
 *          description: Pista eliminada
 *        404:
 *          description: Pista no encontrada
 */
router.delete("/:id", validateId, authenticateToken, isAdmin, deleteCourt);

// Exportamos el router para que index.js lo pueda usar
module.exports = router;
