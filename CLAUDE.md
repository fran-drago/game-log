# GameLog — guía para agentes

GameLog es "Letterboxd para videojuegos": los usuarios registran juegos jugados, los puntúan,
escriben reseñas, arman listas y siguen a otros jugadores.

Este repo lo gestiona un **equipo de agentes con roles fijos**. Antes de hacer nada:

1. Leé `docs/WORKFLOW.md` (proceso, labels, reglas de handoff). Es obligatorio.
2. Leé tu definición de rol en `.claude/agents/<rol>.md` y **no salgas de tu rol**.
3. Leé `AGENTS.md` (reglas de Next.js de esta versión) antes de escribir código.

## Stack

- **Next.js 16** (App Router, React 19, Server Components, `cacheComponents`), TypeScript estricto.
  Esta versión tiene cambios incompatibles con lo que podés recordar: consultá
  `node_modules/next/dist/docs/` antes de usar una API.
- **Tailwind CSS v4** + componentes **shadcn/ui** (cuando se incorpore).
- **Supabase**: Postgres + Auth + Storage. Migraciones SQL en `supabase/migrations/`.
  **Row Level Security obligatoria** en toda tabla con datos de usuario.
- **IGDB** (vía credenciales de Twitch) como fuente de datos de juegos. Solo server-side;
  cachear respuestas, respetar el rate limit (4 req/s).
- **Vitest** + Testing Library para unit/componentes. Playwright para e2e (cuando se incorpore).
- Deploy: Vercel desde `main`.

## Comandos

```bash
npm ci               # instalar
npm run dev          # desarrollo
npm run check        # lint + typecheck + format:check + test  (correr antes de cada PR)
npm run build        # build de producción
npx supabase start   # Supabase local (requiere Docker)
```

## Convenciones

- **Idioma**: issues, PRs, comentarios y docs en **español**. Código, identificadores, nombres de
  archivos y mensajes de commit en **inglés**.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- **Branches**: `<tipo>/<nro-issue>-<slug>` — ej. `feat/12-game-detail-page`.
- **PRs**: chicos y enfocados (idealmente < 400 líneas cambiadas), un issue por PR,
  cuerpo con `Closes #N`, usando la plantilla.
- **Estructura**: `src/app` (rutas), `src/components` (UI), `src/lib` (lógica, clientes),
  `src/lib/igdb`, `src/lib/supabase`. Tests al lado del archivo: `foo.test.ts`.
- Server Components por defecto; `"use client"` solo cuando haga falta interactividad.
- Validar toda entrada externa con **Zod** (forms, route handlers, respuestas de IGDB).
- Nunca leer `process.env` directo para secretos: usar `serverEnv()` de `src/lib/env.ts`.
- `next build` debe funcionar **sin secretos** (CI no los tiene).
- Accesibilidad: HTML semántico, labels en inputs, contraste AA, navegable con teclado.

## Definition of Done (toda PR)

- [ ] Cumple todos los criterios de aceptación del issue.
- [ ] `npm run check` y `npm run build` pasan.
- [ ] Tests nuevos para la lógica nueva (y regresión para cada bug).
- [ ] Sin secretos, sin `console.log` de debug, sin `any` injustificado.
- [ ] Migraciones con RLS y políticas probadas; nada destructivo sin plan de migración.
- [ ] Docs/ADR actualizados si cambia la arquitectura.
