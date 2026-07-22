# PetRescue 🐾

Una app web para encontrar, adoptar y reportar mascotas perdidas. Construida con React 19, TypeScript, Tailwind CSS v4 y Vite.

Todo el estado (mascotas, reportes, favoritos) se guarda en `localStorage` del navegador — no necesitas backend ni API keys para correrla.

## Funcionalidades

- **Onboarding** con flujo de bienvenida de 2 pantallas.
- **Inicio**: dashboard con estadísticas, accesos rápidos, mascotas destacadas y reportes recientes.
- **Adoptar**: catálogo de mascotas con búsqueda, filtro por categoría, favoritos (con vista "Solo Favoritos") y un flujo de solicitud de adopción de varios pasos.
- **Perdidos**: feed de mascotas extraviadas con filtros (Cerca de mí / Recientes / Favoritos), favoritos, chat simulado con el dueño, simulador de llamada y un mapa interactivo donde puedes reportar avistamientos.
- **Reportar**: formulario para publicar una alerta de mascota perdida, con subida de fotos (persistidas como base64) y ubicación simulada en CDMX.

## Correr localmente

**Requisitos:** Node.js 18+ y MySQL.

1. Copia el archivo de ejemplo a `.env` y ajusta los valores de conexión a tu base de datos:
   ```
   cp .env.example .env
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor de backend:
   ```
   npm run server
   ```
4. En otra terminal, corre la app de frontend:
   ```
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000)

## Backend con MySQL

La app ahora incluye un servidor Express en `server/index.js` conectado a MySQL. El servidor crea la base de datos y las tablas necesarias al arrancar, y expone estos endpoints:

- `GET /api/pets` — lista mascotas para adopción
- `PUT /api/pets/:id/status` — actualiza el estado de una mascota
- `GET /api/reports` — lista reportes de mascotas perdidas
- `POST /api/reports` — crea un nuevo reporte

El frontend usa `src/api.ts` para consumir esta API y sincronizar los datos con la base local cuando el backend no está disponible.

## Otros comandos

- `npm run build` — genera el build de producción en `dist/`
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — corre el chequeo de tipos de TypeScript

## Notas técnicas

- El botón flotante con el icono de refrescar (esquina inferior derecha) reinicia toda la demo a su estado inicial, por si quieres volver a ver el onboarding o limpiar los datos guardados en `localStorage`.
- El mapa y el chat con el dueño son simulaciones locales (sin llamadas a APIs externas), pensadas para mostrar el flujo completo de la experiencia.
