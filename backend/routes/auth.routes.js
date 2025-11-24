const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");

// Modelo
/**
 * @swagger
 * components:
 *    schemas:
 *      LoginInput:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: Correo del usuario
 *          password:
 *            type: string
 *            format: password
 *            description: Contraseña del usuario
 *        example:
 *          email: admin@test.com
 *          password: password123
 *      LoginResponse:
 *        type: object
 *        properties:
 *          token:
 *            ype: string
 *            description: Token JWT para autenticación
 *          user:
 *            $ref: '#/components/schemas/User'
 */

// Ruta base
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error del servidor
 */
router.post("/login", login);

module.exports = router;
