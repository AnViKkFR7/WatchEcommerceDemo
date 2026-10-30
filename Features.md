# TimeCraft
[P1] Rebranding de la web existente. [P2] Revisión de la dirección artística para evitar una composición de plantilla.

| Decisión | Alcance | Motivo |
|---|---|---|
| D1 | MVP: conservar API, CRM, inventario, filtros, precios y traducciones | El encargo es visual |
| D2 | MVP: fotografía inmersiva y destacados asimétricos | Dar protagonismo a las piezas |
| D3 | MVP: visor de las ocho marcas con enlaces directos accesibles | Explorar los detalles y acceder al mismo filtro de marca |
| D4 | MVP: respetar movimiento reducido y navegación por teclado | Mantener una experiencia tranquila y usable |
| D5 | Final: publicación y revisión en entorno desplegado | No se ha solicitado desplegar |

## Changelog
- [P1] Sistema tipográfico, paleta, cabecera, catálogo, ficha, página de atelier y componentes responsive.
- [P2] Portada fotográfica superpuesta, composición de destacados con distintas escalas y visor interactivo de marcas.

- [P3] Cada nombre de marca abre el catálogo filtrado con una sola activación. Vista previa al pasar el ratón o enfocar; se elimina el CTA en el pie de imagen. Enlaces nativos con foco visible y activación por Enter.

- [P4] Verificacion final: 19 pruebas aplicables correctas y 5 exclusiones por viewport. CRM real HTTP 200, 13 relojes. Navegacion directa por marca revisada en 375, 768, 1024 y 1440 px. Servidor local operativo y documentacion de arranque actualizada. Newsletter y contactos de ejemplo siguen siendo limitaciones heredadas de la demo.

- [P5] Marcas antes de destacados. En movil, cada enlace muestra su propia fotografia con el nombre superpuesto y acceso directo en un toque; el visor independiente se conserva desde tablet.

- [P6] Boton circular flotante de WhatsApp en las fichas de reloj, fijo abajo a la derecha y con margenes de zona segura. Reutiliza WhatsappCTA: mismo telefono, mensaje, idioma y evento que el CTA de disponibilidad.
