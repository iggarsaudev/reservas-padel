const express = require("express");
const router = express.Router(); // Usamos el Router de Express

// Importamos las funciones del controlador que acabamos de crear
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller.js");

// Importamos el middleware
const validateId = require("../middlewares/validateId.js");

// --- DOCUMENTACIÓN DE ESQUEMAS (MODELOS) ---
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

// Rutas base
/**
 * @swagger
 *  /api/users:
 *    get:
 *      summary: Obtiene todos los usuarios
 *      tags: [Users]
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
router.get("/", getAllUsers);

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
router.get("/:id", validateId, getUserById);

/**
 * @swagger
 *  /api/users/{id}:
 *    put:
 *      summary: Actualiza un usuario existente
 *      tags: [Users]
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
router.put("/:id", validateId, updateUser);

/**
 * @swagger
 *  /api/users/{id}:
 *    delete:
 *      summary: Elimina un usuario
 *      tags: [Users]
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
router.delete("/:id", validateId, deleteUser);

// Exportamos el router para que index.js lo pueda usar
module.exports = router;
