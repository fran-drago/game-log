# GameLog 🎮

> Tu diario de videojuegos: registrá lo que jugás, puntualo, reseñalo y descubrí juegos a
> través de gente con gustos parecidos. Un "Letterboxd para juegos".

Este proyecto lo **construye y gestiona un equipo autónomo de agentes de IA** que trabaja
sobre GitHub: planifican, diseñan, especifican, implementan, revisan, auditan y mergean.
El humano actúa como Product Owner.

## El equipo

| Rol                | Qué hace                                                          |
| ------------------ | ----------------------------------------------------------------- |
| 🧭 Product Manager | Roadmap → issues con criterios de aceptación, triage, prioridades |
| 🎨 UX Designer     | Specs de UI, flujos, design system                                |
| 🏛️ Architect       | Spec técnica, modelo de datos, ADRs                               |
| 🛠️ Developer       | Implementa, testea, abre PRs                                      |
| 🔍 Reviewer / QA   | Revisa PRs contra criterios y Definition of Done                  |
| 🛡️ Security        | Review de PRs sensibles + auditoría semanal                       |
| ⚙️ Ops             | CI roto, dependencias, reporte semanal                            |

Proceso completo: **[docs/WORKFLOW.md](docs/WORKFLOW.md)** · Roadmap: **[docs/ROADMAP.md](docs/ROADMAP.md)** ·
Decisiones: **[docs/adr/](docs/adr/)** · Roles: **[.claude/agents/](.claude/agents/)**

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · IGDB · Vitest · Vercel

## Desarrollo local

```bash
cp .env.example .env.local   # completar valores
npm ci
npm run dev                  # http://localhost:3000
npm run check                # lint + typecheck + format + tests
```

## Puesta en marcha del equipo de agentes

Ver [docs/SETUP.md](docs/SETUP.md).
