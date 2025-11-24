const express = require("express");
const router = express.Router();
const validateId = require("../middlewares/validateId.js");
const authenticateToken = require("../middlewares/authMiddleware");

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller.js");

// Modelo
/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - surnames
 *          - email
 *          - password
 *        properties:
 *          id:
 *            type: integer
 *            description: ID autogenerado del usuario
 *          name:
 *            type: string
 *            description: Nombre del usuario
 *          surnames:
 *            type: string
 *            description: Apellidos del usuario
 *          email:
 *            type: string
 *            description: Correo electrónico único
 *          password:
 *            type: string
 *            description: Contraseña (se guardará encriptada)
 *          role:
 *            type: string
 *            enum:
 *              - user
 *              - admin
 *            description: Rol del usuario (por defecto user)
 *        example:
 *          name: Nacho
 *          surnames: Pérez
 *          email: nacho@test.com
 *          password: password123
 *          role: admin
 */

// Ruta base
/**
 * @swagger
 *  /api/users:
 *    get:
 *      summary: Obtiene todos los usuarios
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Lista de todos los usuarios
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 */
router.get("/", authenticateToken, getAllUsers);

/**
 * @swagger
 *  /api/users:
 *    post:
 *      summary: Crea un nuevo usuario
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        201:
 *          description: Usuario creado exitosamente
 *        400:
 *          description: El email ya existe o datos inválidos
 */
router.post("/", createUser);

// Rutas con ID, necesario el middleware /api/users/1
/**
 * @swagger
 *  /api/users/{id}:
 *    get:
 *      summary: Obtiene un usuario por su ID
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID del usuario
 *      responses:
 *        200:
 *          description: Datos del usuario
 *        404:
 *          description: Usuario no encontrado
 *        400:
 *          description: ID inválido
 */
router.get("/:id", validateId, authenticateToken, getUserById);

/**
 * @swagger
 *  /api/users/{id}:
 *    put:
 *      summary: Actualiza un usuario existente
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID del usuario
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: Usuario actualizado
 *        404:
 *          description: Usuario no encontrado
 */
router.put("/:id", validateId, authenticateToken, updateUser);

/**
 * @swagger
 *  /api/users/{id}:
 *    delete:
 *      summary: Elimina un usuario
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID del usuario
 *      responses:
 *        200:
 *          description: Usuario eliminado
 *        404:
 *          description: Usuario no encontrado
 */
router.delete("/:id", validateId, authenticateToken, deleteUser);

// Exportamos el router para que index.js lo pueda usar
module.exports = router;
