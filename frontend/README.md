# 🎾 Padel App - Frontend

Interfaz de usuario moderna y responsiva para la gestión de reservas de pistas de pádel. Construida con **React**, **Vite** y **Tailwind CSS**.

## 🚀 Tecnologías

- **Framework:** React 18 (Hooks, Context API).
- **Build Tool:** Vite (Rápido y ligero).
- **Estilos:** Tailwind CSS + Flowbite (Componentes UI).
- **HTTP Client:** Axios (con interceptores para JWT).
- **Enrutado:** React Router DOM v6.
- **Internacionalización:** i18next (Soporte Español/Inglés).
- **Alertas:** SweetAlert2.

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- Tener el **Backend** en ejecución (local o remoto).

## 📦 Instalación

1. **Entrar en el directorio:**
   ```bash
   cd frontend

2. **Instalar dependencias:**
   ```bash
   npm install

3. **Configurar Variables de Entorno: Crea un archivo .env (para local) o .env.production (para build) en la carpeta frontend:**
   ```bash
   # URL de tu API Backend
   # Para local:
   VITE_API_URL=http://localhost:3001/api

   # Para producción (ejemplo):
   # VITE_API_URL=[https://padel-api-m30h.onrender.com/api](https://padel-api-m30h.onrender.com/api)

## ▶️ Ejecución
**Modo Desarrollo:**
```bash
npm run dev
```
La aplicación estará disponible en http://localhost:5173

##📂 Estructura Clave
- /src/context: Manejo del estado global (AuthContext).
- /src/services: Conexión con la API (Axios).
- /src/pages: Vistas principales (Home, Login, Profile, Bookings).
- /src/components: Componentes reutilizables (Navbar, Footer, Cards).
- /src/locales: Archivos de traducción (ES/EN).
