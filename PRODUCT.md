# TimeCraft
[P1] Rebranding visual solicitado el 30 de octubre de 2026.

Catálogo de relojes nuevos y vintage, en español e inglés. La conversión sigue siendo una conversación personal por WhatsApp, sin carrito ni pago online.

## Contrato que se conserva
- Textos, marcas, artículos, precios, estados, fotografías de producto y especificaciones existentes.
- Inventario dinámico: /api/watches y /api/company con el mismo aislamiento de empresa en servidor. La comprobación inicial devolvió 13 relojes.
- Filtros: marca, modelo/referencia, precio mínimo/máximo, esfera, brazalete y estado; ordenación, query params y destacados.
- Rutas existentes, galería, relacionados, idiomas, FAQ y analítica.
- No escribir en el CRM ni cambiar credenciales o lógica de negocio.
- La newsletter existente es una maqueta sin servicio de suscripción; el rebranding conserva su comportamiento.

## Criterios
Experiencia premium, editorial y serena; movimiento discreto, primera pantalla inmediata, scroll nativo y movimiento reducido.
Se aplican DevelopmentBasics.md y PLAYBOOK-WEB.md dentro del alcance visual. Se conserva JavaScript, React 19, Vite y React Router. Nuevos componentes con CSS Modules; las hojas existentes conservan su ámbito nominal. No se añaden funcionalidades comerciales ni se migra el hosting.
