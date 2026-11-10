# Puesta en marcha del equipo de agentes

Pasos únicos que sólo puede hacer el Product Owner (requieren credenciales). Los agentes
están **apagados** hasta completar el paso 4.

## 1. Credencial de Claude (secret)

Elegí **una** opción y guardala en _Settings → Secrets and variables → Actions → Secrets_:

- `CLAUDE_CODE_OAUTH_TOKEN` — si usás un plan Claude Pro/Max: corré `claude setup-token`
  en tu terminal y copiá el token.
- `ANTHROPIC_API_KEY` — si usás la API (console.anthropic.com), pago por uso.

## 2. Token de GitHub para los agentes (secret `AGENT_GH_TOKEN`)

Necesario porque las acciones hechas con el token por defecto de Actions **no disparan otros
workflows**, y el handoff entre agentes se basa en eso.

Creá un _fine-grained personal access token_ (github.com/settings/personal-access-tokens):

- Repository access: **sólo** `game-log`.
- Permisos: Contents **RW**, Issues **RW**, Pull requests **RW**, Actions **RW**,
  Commit statuses **R**, Code scanning alerts **R**, Dependabot alerts **R**, Metadata **R**.
- **No** le des permiso de _Workflows_: así los agentes no pueden modificar su propia
  automatización (garantía dura, además de las restricciones de herramientas).

## 3. Configuración del repo

_Settings → General_:

- Pull Requests: habilitar sólo **Squash merging**, y **Automatically delete head branches**.

_Settings → Rules → Rulesets → New branch ruleset_ para `main`:

- Restrict deletions, Block force pushes.
- Require a pull request before merging (0 approvals — la aprobación es por label).
- Require status checks to pass: `verify`, `secret-scan`, `codeql`.

_Settings → Code security_: habilitar Dependabot alerts, Dependabot security updates,
Secret scanning y Push protection.

## 4. Encender a los agentes (variables)

_Settings → Secrets and variables → Actions → Variables_:

- `AGENTS_ENABLED` = `true` ← interruptor general (poné `false` para frenar todo).
- Opcional, modelos por rol: `MODEL_PM`, `MODEL_DESIGNER`, `MODEL_ARCHITECT`,
  `MODEL_DEVELOPER`, `MODEL_REVIEWER`, `MODEL_SECURITY`, `MODEL_OPS`
  (defaults: Opus para Architect/Developer/Reviewer, Sonnet para el resto).

Con el CLI `gh` instalado, los pasos 1, 2 y 4 se pueden hacer así:

```bash
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo fran-drago/game-log   # pega el token
gh secret set AGENT_GH_TOKEN --repo fran-drago/game-log
gh variable set AGENTS_ENABLED --body true --repo fran-drago/game-log
```

## 5. Servicios externos (cuando el Architect lo pida)

- **Supabase**: crear proyecto, cargar `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en Vercel.
- **IGDB**: crear app en dev.twitch.tv/console, cargar `IGDB_CLIENT_ID` e
  `IGDB_CLIENT_SECRET` en Vercel.
- **Vercel**: importar el repo (deploy automático de `main` y previews por PR).

## 6. Arrancar

_Actions → "Agent: Product Manager" → Run workflow_. El PM crea los primeros issues desde el
roadmap y la cadena arranca sola. Seguí el progreso en _Issues_ y en el issue
"📊 Estado del proyecto".
