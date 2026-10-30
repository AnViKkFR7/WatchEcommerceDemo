# TimeCraft · Catálogo de coleccionista
[P1] Sustituye la identidad anterior de negro/dorado y tarjetas con sombras.

La selección individual del atelier se presenta como un catálogo abierto: fotografía de esfera a gran escala a la derecha y relato a la izquierda. El inventario real y sus filtros siguen siendo la interacción principal.

## Sistema
Papel rosado #f2eeeb, superficie #e6dfda, verde profundo #19352f, tinta #23382f y latón apagado. Source Serif 4 para títulos y Libre Franklin para UI, autoalojadas en WOFF2 con licencias OFL. Márgenes, ritmo vertical, tipografía y movimiento definidos en tokens.css. Cabecera centrada en escritorio; composición adaptada en móvil. Fotografía en color para apreciar materiales y esferas.

## Aplicación de las guías
Taste propuso "The page is the object". Se adopta el catálogo de coleccionista, evitando recortes de ticket y adornos ajenos a relojería. Se invierten las funciones de las familias propuestas para representar la tipografía de un catálogo. El contenido existente prima sobre las reglas genéricas de etiquetas y longitud de titulares.

## Movimiento y accesibilidad
Entrada de la fotografía principal, textos visibles desde el primer pintado. Reveal por bloques, máximo 24px, un observador y un requestAnimationFrame compartidos. Medir wrappers estables evita retroalimentación del transform. Hover solo con ratón. Diálogos nativos para menú y filtros, Escape, foco confinado y retorno al disparador. Movimiento reducido muestra el estado final. Sin scroll-jacking, carrusel automático ni bucles decorativos.

## [P2] Exposicion de relojeria
Portada oscura con fotografia a sangre y tipografia superpuesta a gran escala. Destacados de distintas dimensiones y posiciones. Las ocho marcas pasan a un visor de fotografias con enlaces directos accesibles por teclado a sus filtros existentes. Transicion breve de opacidad, sin rotacion automatica. Mobile conserva el orden de lectura y controles tactiles.

[P3] El nombre completo de cada marca es el enlace. Hover y foco actualizan la imagen; clic, toque o Enter navegan directamente. La fotografia es decorativa y no requiere otra accion.

[P5] Movil: marcas en dos columnas con fotografia integrada en el enlace y texto sobre una sombra de contraste. Orden: marcas, atelier, destacados. Tablet y escritorio conservan el visor lateral.
