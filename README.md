# Nails Booking (Anita Nails) 💅📅

Web app to manage appointments for a nail salon / nail artist.

- **Clients** can sign up/sign in and book appointments.
- **Admin** can manage appointments, services, vacations, and blocked hours.

✅ **Live Demo (Render - free / test project):**

```txt
https://nailsbooking-41g6.onrender.com/
```

---

## ✨ Features

### Client

- Sign up / Sign in
- Book an appointment using available time slots
- View “My appointments” (client dashboard)

### Admin

- View all client appointments
- Edit and delete appointments
- Services CRUD (create/update/delete), including service image upload
- Manage vacations (date range blocking)
- Manage blocked dates/hours (one-off blocks)

---

## 🧰 Tech Stack

- Node.js + Express
- EJS (server-side rendering)
- PostgreSQL
- Sessions with `express-session` + `connect-pg-simple` (sessions stored in Postgres)
- Auth using JWT cookie (depending on project setup)
- `bcryptjs` for password hashing
- `multer` for image uploads (services)
- `connect-flash` / UI messages

---

## ✅ Requirements

- Node.js (recommended 18+)
- PostgreSQL
- npm

---

## 📦 Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

Example:

```env
NODE_ENV=development
HOST=localhost
PORT=3000

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/nails_booking

SESSION_SECRET=your_session_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
```

3. Create database tables  
   Run the project SQL script (e.g. `db-sql-code.sql`) in your Postgres instance.

> Note: If you use `connect-pg-simple` with `createTableIfMissing: true`, the session table can be created automatically.

4. Run the app:

```bash
# Development
npm run dev

# Production (local)
npm start
```

---

## 🗂️ Project Structure (reference)

- `server.js` (server entry)
- `routes/`
- `controllers/`
- `models/`
- `views/` (EJS templates)
- `public/` (css/js/img)

---

## 🌐 Render Deployment (free)

This project is deployed on Render (free plan) as a test/demo.  
Free instances may “sleep” when idle, so the first request can take a few seconds.

URL:

```txt
https://nailsbooking-41g6.onrender.com/
```

### Render Environment Variables

Set the same variables you use locally (from `.env`), mainly:

- `DATABASE_URL`
- `SESSION_SECRET`
- `ACCESS_TOKEN_SECRET` (if used)
- `NODE_ENV=production`

---

## 🔐 Security Notes (recommended)

- Avoid deleting resources via GET (prefer POST/DELETE).
- Validate and sanitize inputs.
- Don’t commit `.env` (use `.env.example`).

---

## 👤 Author

Marcos Silvera

#################################################################################################################################
#################################################################################################################################

# Nails Booking (Anita Nails) 💅📅

Aplicación web para gestionar una agenda de reservas para un negocio de uñas/manicurista.

- **Clientes**: pueden registrarse/iniciar sesión y reservar turnos.
- **Admin**: puede administrar reservas, servicios, vacaciones y horarios no disponibles.

✅ **Demo (Render - free / proyecto de prueba):**

```txt
https://nailsbooking-41g6.onrender.com/
```

---

## ✨ Funcionalidades

### Cliente

- Registro e inicio de sesión.
- Crear reservas eligiendo un horario disponible.
- Ver sus reservas (panel del cliente).

### Admin

- Ver todas las reservas de clientes.
- Editar y eliminar reservas.
- CRUD de servicios (crear/editar/eliminar), incluyendo imagen del servicio.
- Gestionar **vacaciones** (bloqueo por rango de fechas).
- Gestionar **fechas/horas deshabilitadas** (bloqueo puntual).

---

## 🧰 Tecnologías

- Node.js + Express
- EJS (renderizado server-side)
- PostgreSQL
- Sesiones con `express-session` + `connect-pg-simple` (sesiones en Postgres)
- Autenticación con JWT en cookie (según implementación del proyecto)
- `bcryptjs` para hash de contraseñas
- `multer` para subida de imágenes (servicios)
- `connect-flash` / mensajes en UI

---

## ✅ Requisitos

- Node.js (recomendado 18+)
- PostgreSQL
- npm

---

## 📦 Instalación y ejecución local

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raíz:

Ejemplo:

```env
NODE_ENV=development
HOST=localhost
PORT=3000

# Postgres
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/nails_booking

# Sesiones
SESSION_SECRET=tu_session_secret

# JWT (si aplica)
ACCESS_TOKEN_SECRET=tu_access_token_secret
```

3. Crear la base de datos y tablas  
   Ejecutá el script SQL del proyecto (por ejemplo `db-sql-code.sql`) en tu Postgres.

> Nota: si usás `connect-pg-simple` con `createTableIfMissing: true`, la tabla de sesiones puede crearse automáticamente.

4. Ejecutar:

```bash
# Desarrollo
npm run dev

# Producción (local)
npm start
```

---

## 🗃️ Estructura (referencia)

- `server.js` (entrada del servidor)
- `routes/` (rutas)
- `controllers/` (lógica)
- `models/` (acceso a datos / queries)
- `views/` (EJS)
- `public/` (css/js/img)

---

## 🌐 Deploy en Render (gratis)

Este proyecto está desplegado como demo en Render (plan free).  
En ese plan, si no hay tráfico por un tiempo, el servicio puede “dormirse” y la primera carga puede demorar unos segundos.

URL:

```txt
https://nailsbooking-41g6.onrender.com/
```

### Variables de entorno en Render

Configurar las mismas variables que en tu `.env`, principalmente:

- `DATABASE_URL` (Postgres)
- `SESSION_SECRET`
- `ACCESS_TOKEN_SECRET` (si tu auth la usa)
- `NODE_ENV=production`

---

## 🔐 Seguridad / buenas prácticas (recomendado)

- Evitar eliminar recursos con GET (mejor POST/DELETE).
- Validar y sanear inputs.
- Usar HTTPS (Render ya lo provee).
- Nunca commitear `.env` (usar `.env.example`).

---

## 👤 Autor

Marcos Silvera
