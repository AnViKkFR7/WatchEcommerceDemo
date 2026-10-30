# Skills del proyecto y Playwright MCP

Las skills se instalan en `.agents/skills/`, con sus referencias y scripts originales.

| Origen | Revision instalada | Contenido |
| --- | --- | --- |
| https://github.com/emilkowalski/skills | a81dbca07f2217b7103e510c0f13f8d5b017afc9 | Las 16 skills del repositorio |
| https://github.com/pbakaus/impeccable | 02523aec3e4c4580102d996d1b6a71fbe062e03f | impeccable, desde .agents/skills/impeccable |
| https://github.com/Leonxlnx/taste-skill | 12af471f627f866411b4bd785b19646d3672784c | design-taste-frontend, en taste-skill |

Codex detecta estas skills en el proyecto. Ejemplos de uso: `$emil-design-eng`, `$animate`, `$impeccable audit` y `$design-taste-frontend`.

Impeccable se instala mediante copia de su skill oficial; no se habilitan sus hooks opcionales. Su launcher puede descargar el motor al utilizarlo por primera vez. Taste necesita Node 22+ y Chrome, Edge o Chromium.

Playwright MCP queda configurado en `.codex/config.toml`, fijado a la version 0.0.83, por STDIO con `npx.cmd`. Utiliza Chrome sin ventana y un perfil aislado. Requiere Node/npm, Chrome instalado y acceso a npm en el primer arranque. Reinicia Codex o el servidor MCP para cargar la nueva conexion. La configuracion local se carga en proyectos de confianza.

Documentacion:
- https://learn.chatgpt.com/docs/build-skills
- https://learn.chatgpt.com/docs/extend/mcp?surface=cli
- https://github.com/microsoft/playwright-mcp
