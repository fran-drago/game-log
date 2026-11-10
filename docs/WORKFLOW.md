# Workflow del equipo de agentes

El proyecto lo construye un equipo de 7 agentes de IA con roles estrictos, coordinados
**solo a través de GitHub** (issues, labels, PRs, comentarios). Ningún agente tiene memoria
entre ejecuciones: **el estado vive en GitHub**. Si no está en un issue/PR, no existe.

El humano (**Product Owner**, `@fran-drago`) define la visión y tiene poder de veto.

## Roles

| Rol                 | Archivo                             | Responsable de                                                   | Nunca hace                                          |
| ------------------- | ----------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| **Product Manager** | `.claude/agents/product-manager.md` | Roadmap, backlog, triage, prioridad, criterios de aceptación     | Escribir código, decidir arquitectura               |
| **UX Designer**     | `.claude/agents/ux-designer.md`     | Specs de UI/UX, flujos, design system (`docs/design/`)           | Código de la app, cambiar alcance                   |
| **Architect**       | `.claude/agents/architect.md`       | Spec técnica, modelo de datos, ADRs, dividir issues grandes      | Implementar features                                |
| **Developer**       | `.claude/agents/developer.md`       | Implementar issues `ready`, tests, abrir PRs, atender reviews    | Mergear, cambiar alcance, aprobar su propio trabajo |
| **Reviewer (QA)**   | `.claude/agents/reviewer.md`        | Revisar PRs contra criterios + DoD, verificar tests              | Pushear código, mergear                             |
| **Security**        | `.claude/agents/security.md`        | Revisar PRs sensibles, auditoría semanal, issues de seguridad    | Implementar fixes                                   |
| **Ops**             | `.claude/agents/ops.md`             | CI roto en `main`, dependencias, salud del repo, reporte semanal | Features                                            |

El **merge** no lo hace ningún agente: lo hace el workflow determinístico `automerge.yml`
cuando se cumplen todas las condiciones (ver "Gates de merge").

## Ciclo de vida de un issue

```
              ┌───────────────────────── (sin UI) ─────────────────────────┐
              │                                                            ▼
status:triage ──PM──▶ status:needs-ux ──Designer──▶ status:needs-spec ──Architect──▶ status:ready
                                                                                       │
                                                                                Developer
                                                                                       ▼
        (issue cerrado) ◀──automerge── status:in-review ◀────── PR ────── status:in-progress
```

| Label                | Significado                                                         | Dueño del siguiente paso |
| -------------------- | ------------------------------------------------------------------- | ------------------------ |
| `status:triage`      | Issue nuevo, sin refinar                                            | PM                       |
| `status:needs-ux`    | Necesita spec de UI                                                 | UX Designer              |
| `status:needs-spec`  | Necesita spec técnica                                               | Architect                |
| `status:ready`       | Listo para implementar (criterios + specs completos)                | Developer                |
| `status:in-progress` | Un Developer lo tomó (ver comentario de claim)                      | Developer                |
| `status:in-review`   | Hay PR abierta (`Closes #N`)                                        | Reviewer / Security      |
| `status:blocked`     | Bloqueado por otro issue (indicar cuál)                             | Quien lo desbloquee      |
| `needs-human`        | Escalado al Product Owner. **Los agentes no lo tocan.**             | Humano                   |
| `hold`               | Veto del Product Owner. **Los agentes no lo tocan y no se mergea.** | Humano                   |

Un issue tiene **exactamente un** label `status:*` a la vez. Quien cambia el estado
quita el label anterior en la misma operación.

Otras dimensiones:

- **Tipo**: `type:feature`, `type:bug`, `type:chore`, `type:docs`, `type:security`
- **Área**: `area:frontend`, `area:backend`, `area:db`, `area:infra`, `area:design`
- **Prioridad**: `P0` (urgente/roto) → `P1` (milestone actual) → `P2` → `P3` (algún día)

## Labels de PR

| Label                      | Lo pone                               | Significado                             |
| -------------------------- | ------------------------------------- | --------------------------------------- |
| `agent-pr`                 | Developer                             | PR creada por un agente                 |
| `review:approved`          | Reviewer                              | Aprobada                                |
| `review:changes-requested` | Reviewer                              | Requiere cambios (dispara al Developer) |
| `security:required`        | `labeler.yml` (automático, por paths) | Necesita review de seguridad            |
| `security:approved`        | Security                              | Sin hallazgos bloqueantes               |
| `security:blocked`         | Security                              | Hallazgo bloqueante                     |

## Gates de merge (automerge.yml)

Una PR se mergea (squash) automáticamente sólo si **todo** se cumple:

1. No es draft y no tiene conflictos.
2. Todos los checks de CI pasaron (lint, typecheck, test, build, CodeQL, secret scan).
3. Tiene `review:approved` y **no** tiene `review:changes-requested`.
4. Si tiene `security:required` → tiene `security:approved`.
5. No tiene `hold`, `needs-human` ni `security:blocked`.

## Reglas de handoff (todos los agentes)

1. **Una acción, un comentario**: cada vez que actuás sobre un issue/PR dejás un comentario que
   empieza con tu firma, ej. `**[Architect]**`, explicando qué hiciste y qué sigue.
2. **Cambiá el label de estado** al terminar tu parte. Sin cambio de label, nadie más se entera.
3. **Ignorá** issues/PRs con `hold` o `needs-human`.
4. **Escalá en vez de adivinar**: si falta una decisión de producto o algo es ambiguo/riesgoso,
   comentá la pregunta concreta y poné `needs-human`. No inventes requisitos.
5. **Límite de rondas**: si una PR llega a 3 rondas de `review:changes-requested`, el Reviewer
   pone `needs-human` en vez de pedir una cuarta.
6. **WIP**: máximo 2 PRs abiertas de agentes sin aprobar a la vez. El Developer no toma un issue
   nuevo si se superó el límite; primero atiende reviews pendientes.
7. **Idempotencia**: antes de actuar, revisá si ya actuaste (buscá tu firma). No dupliques
   comentarios, issues ni PRs.
8. **Alcance**: si encontrás trabajo fuera de alcance, abrí un issue nuevo en `status:triage`
   en vez de hacerlo.

## Cómo corren los agentes

Cada rol es un workflow en `.github/workflows/agent-*.yml` que llama al reusable
`_agent.yml` (Claude Code Action). Se disparan por **eventos** (labels, PRs) y además por
**cron** como red de seguridad.

| Agente      | Eventos                                          | Cron (UTC)              |
| ----------- | ------------------------------------------------ | ----------------------- |
| PM          | issue abierto                                    | diario 09:00            |
| UX Designer | label `status:needs-ux`                          | diario 10:00            |
| Architect   | label `status:needs-spec`                        | diario 11:00            |
| Developer   | label `status:ready`, `review:changes-requested` | cada 3 h                |
| Reviewer    | PR abierta / actualizada                         | cada 2 h                |
| Security    | label `security:required`                        | lunes 06:00 (auditoría) |
| Ops         | CI falla en `main`                               | lunes 08:00 (reporte)   |

**Interruptor general**: la variable de repo `AGENTS_ENABLED` debe valer `true`.
Ponela en `false` para frenar a todo el equipo al instante.

**Modelos**: configurables por variables de repo (`MODEL_PM`, `MODEL_DESIGNER`,
`MODEL_ARCHITECT`, `MODEL_DEVELOPER`, `MODEL_REVIEWER`, `MODEL_SECURITY`, `MODEL_OPS`).

## Cómo interviene el humano

- **Pedir algo**: abrí un issue (plantilla Feature o Bug). El PM lo refina.
- **Vetar**: poné `hold` en el issue/PR.
- **Responder una escalada**: contestá en el issue y quitá `needs-human`.
- **Hablar con el equipo**: mencioná `@claude` en un issue/PR (workflow `claude.yml`).
- **Cambiar la dirección**: editá `docs/ROADMAP.md` (o pedíselo al PM en un issue).
