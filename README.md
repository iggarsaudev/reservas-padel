# 🎾 Padel Booking App

Aplicación Full-Stack para la gestión y reserva de pistas de pádel.

El proyecto está dividido en dos partes principales:

## 📂 Estructura del Proyecto

### 1. [Backend (API)](./backend) **(./backend/README.md)**
Servidor RESTful construido con **Node.js, Express y MySQL**.
- Gestión de usuarios, pistas y reservas.
- Seguridad RBAC y JWT.
- Testing E2E y Unitario.
- [Ver documentación técnica del Backend](./backend/README.md)

### 2. [Frontend (Web)](./frontend) **(./frontend/README.md)**
Interfaz de usuario construida con **React y Tailwind**.
- Diseño responsivo (Mobile First).
- Sistema de Login/Registro con JWT.
- Panel de administración y gestión de perfil.

## 🚀 Despliegue (Production Setup)
El proyecto está actualmente desplegado utilizando la siguiente arquitectura en la nube:

| Servicio | Proveedor | Descripción |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com/) | Hosting estático y CD automático. |
| **Backend** | [Render](https://render.com/) | Web Service para Node.js. |
| **Base de Datos** | [Clever Cloud](https://www.clever-cloud.com/) | MySQL Hosting. |

## 🚀 Instalación General

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/iggarsaudev/reservas-padel.git]

2. **Configura el Backend:**
   Sigue las instrucciones en ./backend/README.md

3. **Configura el Frontend:**
   Sigue las instrucciones en ./frontend/README.md  
