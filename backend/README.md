# 🎾 API Pádel APP

Backend para una aplicación de gestión y reserva de pistas de pádel. Construido con **Node.js**, **Express**, **Prisma** y **MySQL**.

## 🚀 Características

- **Arquitectura Profesional:** Controladores, Servicios, Rutas y Validaciones.
- **Base de Datos:** MySQL con ORM Prisma.
- **Entorno Dockerizado:** Base de datos de desarrollo y de test aisladas.
- **Seguridad:** Hash de contraseñas con Bcrypt.
- **Testing:** Tests Unitarios y de Integración (Jest + Supertest) con cobertura de código.
- **Documentación:** Swagger (OpenAPI) integrado.

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker Desktop](https://www.docker.com/) (para la base de datos)
- Git

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/iggarsaudev/reservas-padel.git]
   cd reservas-padel/backend

2. **Instalar dependencias:**
   ```bash
   npm install

3. **Configurar Variables de Entorno: Crea un archivo .env en la carpeta backend con lo siguiente:**
   ```bash
   # Conexión a la Base de Datos (Docker Local)
   DATABASE_URL="mysql://root:padel-secret-pass@127.0.0.1:3306/padel_db"
   
   # Secreto para firmar los Tokens JWT (¡Cámbialo en producción!)
   JWT_SECRET="mi_clave_super_secreta_para_desarrollo_123"


## 🐳 Base de Datos (Docker)

Para desarrollo local, utilizamos Docker.
> ⚠️ **NOTA:** Las credenciales mostradas abajo son **exclusivas para el entorno de desarrollo local**. Nunca utilices estas contraseñas en un entorno de producción.

1. **Levantar la BD de Desarrollo (Puerto 3306):**
   Este comando crea un contenedor con una contraseña preconfigurada para inicio rápido.
   ```bash
   docker run -d --name padel-db -p 3306:3306 -e MYSQL_DATABASE=padel_db -e MYSQL_ROOT_PASSWORD=padel-secret-pass -v padel-db-data:/var/lib/mysql mysql:8.0

2. **Ejecutar Migraciones (Crear tablas):**
   ```bash
   npx prisma migrate dev --name init


## 🔐 Seguridad

- **Autenticación:** JWT (JSON Web Tokens).
- **Protección:** Middlewares para rutas privadas y roles de administrador.


## ▶️ Ejecución

**Modo Desarrollo:**
```bash
npm run dev
````
El servidor arrancará en http://localhost:3001


## 📚 Documentación (Swagger)

Una vez arrancado el servidor, visita: 👉 http://localhost:3001/api-docs


## 🧪 Testing

El proyecto cuenta con un entorno de testing aislado que usa una base de datos dedicada en el puerto 3307.

1. **Levantar la BD de Test:**
   ```bash
   docker run -d --name padel-test-db -p 3307:3306 -e MYSQL_DATABASE=padel_test_db -e MYSQL_ROOT_PASSWORD=padel-secret-pass mysql:8.0

2. **Ejecutar Tests:**
   * Unitarios:
     ```bash
     npm run test:unit
     
   * Integración:
     ```bash
     npm run test:int
   * Cobertura Total:
     ```bash
     npm run test:coverage
