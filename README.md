# ANDER - Pet Adoption & Lost Pets 🐾

[![CI](https://github.com/anderson1010-ctrl/ANDER/actions/workflows/ci.yml/badge.svg)](https://github.com/anderson1010-ctrl/ANDER/actions/workflows/ci.yml)

Aplicación web para buscar, adoptar y reportar mascotas perdidas. Construida con React 19, TypeScript, Vite y un backend Express + MySQL.

## Funcionalidades

- **Onboarding** con flujo de bienvenida.
- **Inicio**: dashboard con estadísticas, accesos rápidos y mascotas destacadas.
- **Adoptar**: catálogo de mascotas, filtros, favoritos y solicitud de adopción.
- **Perdidos**: feed de mascotas extraviadas con filtros, favoritos, chat simulado, simulador de llamada y mapa.
- **Reportar**: formulario para registrar una mascota perdida con foto y ubicación.

## Correr localmente

**Requisitos:** Node.js 18+ y MySQL.

1. Copia el archivo de ejemplo a `.env` y ajusta tus credenciales de MySQL:
   ```powershell
   copy .env.example .env
   ```
2. Instala las dependencias:
   ```powershell
   npm install
   ```
3. Inicia el servidor de backend:
   ```powershell
   npm run server
   ```
4. En otra terminal, ejecuta el frontend:
   ```powershell
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000)

## API del backend

El servidor Express en `server/index.js` crea la base de datos y tablas necesarias al arrancar. Endpoints disponibles:

- `GET /api/pets` — lista mascotas para adopción
- `PUT /api/pets/:id/status` — actualiza el estado de una mascota
- `GET /api/reports` — lista reportes de mascotas perdidas
- `POST /api/reports` — crea un nuevo reporte

## Comandos útiles

- `npm run dev` — inicia Vite en modo desarrollo
- `npm run build` — genera el build de producción
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — verifica tipos con TypeScript

## Notas

- El estado de favoritos y onboarding se guarda en `localStorage`.
- El mapa y la interacción con el dueño son simulaciones de la experiencia de usuario.
