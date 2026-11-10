# ADR 0002 — Equipo de agentes autónomo coordinado por GitHub

- **Estado**: Aceptado
- **Fecha**: 2026-11-09

## Contexto

El proyecto debe ser desarrollado y gestionado por agentes de IA con mínima intervención
humana, siguiendo buenas prácticas de ingeniería.

## Decisión

- 7 roles con responsabilidades disjuntas (PM, UX Designer, Architect, Developer, Reviewer,
  Security, Ops), definidos en `.claude/agents/*.md`. Ver `docs/WORKFLOW.md`.
- Cada rol corre como GitHub Action (Claude Code Action) disparado por eventos + cron.
- **GitHub es la única fuente de verdad**: el estado se modela con labels `status:*` y el
  handoff ocurre cambiando labels.
- El **merge es determinístico** (`automerge.yml`), no lo decide un LLM: requiere CI verde,
  aprobación del Reviewer, aprobación de Security en paths sensibles y ausencia de vetos.
- Controles: interruptor `AGENTS_ENABLED`, `max-turns` y timeout por corrida, concurrencia
  de 1 por rol, límite de WIP, límite de 3 rondas de review, escalado con `needs-human`,
  veto humano con `hold`.
- Los agentes actúan con un token propio (`AGENT_GH_TOKEN`) porque las acciones hechas con el
  `GITHUB_TOKEN` por defecto no disparan otros workflows (y el handoff dejaría de funcionar).

## Consecuencias

- Trazabilidad total: cada decisión queda en un issue/PR firmado por rol.
- El costo de API escala con la cantidad de corridas → cron conservador y concurrencia 1.
- Como todos los agentes usan la misma identidad de GitHub, la aprobación es por label
  (GitHub no permite aprobar PRs propias).
