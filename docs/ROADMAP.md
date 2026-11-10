# Roadmap de GameLog

> Dueño: Product Owner (humano). El PM crea issues a partir de este documento, en orden.
> Para cambiar la dirección, editá este archivo o abrí un issue.

**Visión**: el lugar donde los jugadores llevan su diario de videojuegos — registran lo que
jugaron, lo puntúan, escriben reseñas, arman listas y descubren juegos a través de gente
con gustos parecidos.

## M0 — Fundaciones

- Sistema de diseño base (tokens, tipografía, tema oscuro, componentes shadcn/ui iniciales).
- Layout global: header con búsqueda, navegación, footer; página 404.
- Modelo de datos inicial en Supabase (perfiles, juegos cacheados, logs, reseñas, listas, follows) con RLS.
- Cliente de IGDB server-side con caché y rate limiting.
- Tests e2e con Playwright en CI (smoke test de la home).

## M1 — MVP: registrar y reseñar

- Registro / login (email + OAuth de Discord y Google) con Supabase Auth; perfil con username.
- Búsqueda de juegos (IGDB) con resultados con portada, año y plataformas.
- Página de juego: portada, sinopsis, géneros, plataformas, fecha, puntaje promedio de la comunidad.
- Registrar un juego: estado (jugando / terminado / abandonado / quiero jugar), fecha,
  plataforma, horas, puntaje de 0.5 a 5 estrellas, "me gusta".
- Reseñas con texto (con marcado de spoilers) en la página del juego y del usuario.
- Perfil público: juegos favoritos (top 4), diario (timeline de logs), reseñas, estadísticas básicas.

## M2 — Social

- Seguir usuarios; feed de actividad de la gente que seguís.
- Likes y comentarios en reseñas.
- Listas personalizadas (ordenadas o no), públicas, con likes.
- Backlog ("quiero jugar") como lista especial.

## M3 — Descubrimiento

- Home con populares de la semana, reseñas destacadas y novedades.
- Filtros y exploración por género, plataforma, año.
- Estadísticas anuales del usuario ("tu año en juegos").
- SEO: metadata, Open Graph por juego/reseña/perfil, sitemap.

## M4 — Calidad y crecimiento

- Importar biblioteca (CSV; luego Steam).
- Moderación: reportes de reseñas/usuarios, límites de rate.
- Accesibilidad AA auditada, performance (Core Web Vitals en verde).
- i18n (inglés).

## Fuera de alcance (por ahora)

- App móvil nativa, monetización, mensajería privada.
