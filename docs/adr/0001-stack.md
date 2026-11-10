# ADR 0001 — Stack tecnológico

- **Estado**: Aceptado
- **Fecha**: 2026-11-09

## Contexto

Necesitamos construir un sitio social de reseñas de videojuegos con autenticación, datos
relacionales (usuarios, juegos, logs, reseñas, listas, follows) y una base de datos de juegos
externa. Lo desarrolla un equipo de agentes de IA, por lo que importan las convenciones
claras, el tipado fuerte y la documentación abundante.

## Decisión

- **Next.js 16 (App Router) + React 19 + TypeScript estricto**, deploy en **Vercel**.
- **Tailwind CSS v4 + shadcn/ui** para UI.
- **Supabase** (Postgres + Auth + Storage) con **Row Level Security** obligatoria.
  Migraciones SQL versionadas en `supabase/migrations/`.
- **IGDB** (API de Twitch) como fuente de datos de juegos, consumida sólo desde el servidor y
  cacheada en una tabla local `games`.
- **Zod** para validación; **Vitest + Testing Library** para tests; **Playwright** para e2e.

## Consecuencias

- Un solo lenguaje (TS) de punta a punta; tipos generados desde la base.
- La autorización vive en la base (RLS), lo que reduce el riesgo de olvidar un chequeo en la app.
- Dependencia de dos servicios externos (Supabase, IGDB); IGDB tiene rate limit (4 req/s)
  → la caché local es obligatoria.

## Alternativas

- Prisma + Postgres propio: más control, pero más infraestructura (auth, storage) que mantener.
- RAWG: API más simple pero datos menos curados que IGDB.
