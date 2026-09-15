-- =============================================================================
-- 002_seed_items.sql
--
-- Demo catalog for TimeCraft (company 80bbaa26-35b9-41e6-a854-fdb156c4b921,
-- item_type 'watch_ecommerce_demo_items'). Creates items + attribute_values +
-- item_media by joining against the attribute_definitions inserted by
-- 001_attribute_definitions.sql (run that first).
--
-- Content (brands, references, prices, copy) is invented for demo purposes.
-- Photos are stable public Unsplash URLs, hand-checked so each shows the
-- correct brand's logo (or no visible logo at all) for the item it's
-- attached to — replace with the dealer's own photography before going live.
--
-- `status` on each watch here is the platform's shared CMS publish workflow
-- ('draft' | 'published' | 'archived' — enforced by the DB itself; any other
-- value gets silently coerced, which is exactly what bit us before this
-- comment existed). It is NOT watch availability. That's the separate
-- `availability_status` attribute below ('disponible' | 'bajo_reserva' |
-- 'no_disponible', see SPECS.md §4 and 001_attribute_definitions.sql) — the
-- API layer (api/_lib/catalog.js) requires BOTH status='published' AND
-- availability_status in ('disponible','bajo_reserva') before a watch is
-- ever returned to the public site. The last item here is 'archived' with
-- availability_status='no_disponible', to prove both gates work.
-- =============================================================================

do $$
declare
  v_company_id uuid := '80bbaa26-35b9-41e6-a854-fdb156c4b921';
  v_item_type  text := 'watch_ecommerce_demo_items';
  v_watches    jsonb := $json$
[
  {
    "title": "Rolex Submariner Date 41",
    "summary": "Icono del buceo profesional, en acero Oystersteel con bisel de cerámica negra.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Rolex"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Submariner Date"},
      "reference_number": {"t":"text","v":"126610LN"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":true},
      "price": {"t":"number","v":13500},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2023},
      "box_papers": {"t":"text","v":"{\"es\":\"Caja y documentos completos\",\"en\":\"Full set (box & papers)\"}"},
      "warranty": {"t":"text","v":"{\"es\":\"2 años de garantía TimeCraft\",\"en\":\"2-year TimeCraft warranty\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable (Oystersteel)\",\"en\":\"Stainless steel (Oystersteel)\"}"},
      "case_diameter_mm": {"t":"number","v":41},
      "case_thickness_mm": {"t":"number","v":12.5},
      "water_resistance": {"t":"text","v":"300 m / 30 bar"},
      "glass_material": {"t":"text","v":"{\"es\":\"Cristal de zafiro\",\"en\":\"Sapphire crystal\"}"},
      "dial_color": {"t":"text","v":"{\"es\":\"Negro\",\"en\":\"Black\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Calibre 3235"},
      "power_reserve": {"t":"text","v":"{\"es\":\"70 horas\",\"en\":\"70 hours\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Oystersteel\",\"en\":\"Oystersteel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "clasp_type": {"t":"text","v":"{\"es\":\"Oysterlock con extensión Glidelock\",\"en\":\"Oysterlock with Glidelock extension\"}"},
      "functions": {"t":"text_array","v":["date","unidirectional_bezel","luminescent_hands"]},
      "short_description": {"t":"json","v":"{\"es\":\"El Submariner Date es la referencia absoluta entre los relojes de buceo. Bisel unidireccional graduado, hermeticidad de 300 metros y el icónico dial negro con índices luminiscentes.\",\"en\":\"The Submariner Date is the absolute reference among dive watches. Unidirectional graduated bezel, 300 m water resistance and the iconic black dial with luminescent markers.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1400&q=80&auto=format&fit=crop","alt":"Rolex Submariner Date, vista frontal","cover":true},
      {"url":"https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=1400&q=80&auto=format&fit=crop","alt":"Rolex, detalle del bisel","cover":false}
    ]
  },
  {
    "title": "Omega Speedmaster Moonwatch Professional",
    "summary": "El cronógrafo que llegó a la Luna, en su icónica versión manual de acero.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Omega"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Speedmaster Moonwatch Professional"},
      "reference_number": {"t":"text","v":"310.30.42.50.01.001"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":true},
      "price": {"t":"number","v":7200},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2024},
      "box_papers": {"t":"text","v":"{\"es\":\"Caja y documentos completos\",\"en\":\"Full set (box & papers)\"}"},
      "warranty": {"t":"text","v":"{\"es\":\"5 años de garantía Omega\",\"en\":\"5-year Omega warranty\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":42},
      "water_resistance": {"t":"text","v":"50 m / 5 bar"},
      "glass_material": {"t":"text","v":"{\"es\":\"Cristal hesalita\",\"en\":\"Hesalite crystal\"}"},
      "dial_color": {"t":"text","v":"{\"es\":\"Negro\",\"en\":\"Black\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Manual\",\"en\":\"Manual-winding\"}"},
      "caliber": {"t":"text","v":"Calibre 3861"},
      "power_reserve": {"t":"text","v":"{\"es\":\"50 horas\",\"en\":\"50 hours\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["chronograph","tachymeter"]},
      "short_description": {"t":"json","v":"{\"es\":\"El único reloj certificado por la NASA para todas las misiones tripuladas. Movimiento de cuerda manual y escala taquimétrica en el bisel.\",\"en\":\"The only watch certified by NASA for all manned space missions. Manual-winding movement and tachymeter scale on the bezel.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1400&q=80&auto=format&fit=crop","alt":"Omega Speedmaster, vista frontal","cover":true}
    ]
  },
  {
    "title": "TAG Heuer Carrera Chronograph 44mm",
    "summary": "Cronógrafo deportivo de herencia automovilística, en acero con esfera azul.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"TAG Heuer"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Carrera Chronograph"},
      "reference_number": {"t":"text","v":"CBN2A1B.BA0643"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":5100},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2023},
      "box_papers": {"t":"text","v":"{\"es\":\"Caja y documentos completos\",\"en\":\"Full set (box & papers)\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":44},
      "water_resistance": {"t":"text","v":"100 m / 10 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Azul\",\"en\":\"Blue\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Heuer 02"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["chronograph","date"]},
      "short_description": {"t":"json","v":"{\"es\":\"Herencia de los cronómetros de a bordo de los años 60, con un movimiento de manufactura de 80 horas de reserva de marcha.\",\"en\":\"Heritage from 1960s dashboard chronometers, with an in-house movement offering an 80-hour power reserve.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1400&q=80&auto=format&fit=crop","alt":"TAG Heuer Carrera, vista frontal","cover":true}
    ]
  },
  {
    "title": "Seiko 5 Sports SRPD Automatic",
    "summary": "Acceso perfecto al mundo de los relojes automáticos, robusto y versátil.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Seiko"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"5 Sports"},
      "reference_number": {"t":"text","v":"SRPD55K1"},
      "gender": {"t":"text","v":"{\"es\":\"Unisex\",\"en\":\"Unisex\"}"},
      "is_featured": {"t":"boolean","v":true},
      "price": {"t":"number","v":249},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2024},
      "box_papers": {"t":"text","v":"{\"es\":\"Caja y documentos completos\",\"en\":\"Full set (box & papers)\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":42.5},
      "water_resistance": {"t":"text","v":"100 m / 10 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Azul\",\"en\":\"Blue\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Seiko 4R36"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["date","day"]},
      "short_description": {"t":"json","v":"{\"es\":\"La puerta de entrada perfecta a los relojes mecánicos: resistente, fiable y con un diseño deportivo que nunca pasa de moda.\",\"en\":\"The perfect gateway into mechanical watches: rugged, reliable, and a sporty design that never goes out of style.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1495856458515-0637185db551?w=1400&q=80&auto=format&fit=crop","alt":"Seiko 5 Sports, vista frontal","cover":true}
    ]
  },
  {
    "title": "Tissot PRX Powermatic 80",
    "summary": "El revival del diseño de los 70, con brazalete integrado y automático de manufactura.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Tissot"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"PRX Powermatic 80"},
      "reference_number": {"t":"text","v":"T137.407.11.041.00"},
      "gender": {"t":"text","v":"{\"es\":\"Unisex\",\"en\":\"Unisex\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":720},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2024},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":40},
      "water_resistance": {"t":"text","v":"100 m / 10 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Azul\",\"en\":\"Blue\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Powermatic 80"},
      "power_reserve": {"t":"text","v":"{\"es\":\"80 horas\",\"en\":\"80 hours\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable integrado\",\"en\":\"Integrated stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["date"]},
      "short_description": {"t":"json","v":"{\"es\":\"Diseño de los años 70 reinventado, con caja integrada y un movimiento automático de 80 horas de reserva de marcha.\",\"en\":\"1970s design reinvented, with an integrated case and an automatic movement offering 80 hours of power reserve.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1400&q=80&auto=format&fit=crop","alt":"Tissot PRX, vista frontal","cover":true}
    ]
  },
  {
    "title": "Citizen Eco-Drive Promaster Diver",
    "summary": "Reloj de buceo con carga solar, sin necesidad de pilas ni cuerda.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Citizen"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Promaster Diver Eco-Drive"},
      "reference_number": {"t":"text","v":"BN0150-28E"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":310},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2023},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":42},
      "water_resistance": {"t":"text","v":"200 m / 20 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Negro\",\"en\":\"Black\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Cuarzo (Eco-Drive solar)\",\"en\":\"Quartz (Eco-Drive solar)\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Negro\",\"en\":\"Black\"}"},
      "functions": {"t":"text_array","v":["unidirectional_bezel","luminescent_hands"]},
      "short_description": {"t":"json","v":"{\"es\":\"Se recarga con cualquier fuente de luz y nunca necesita cambio de pila: la tecnología Eco-Drive de Citizen en un robusto reloj de buceo.\",\"en\":\"Recharges from any light source and never needs a battery change: Citizen's Eco-Drive technology in a rugged dive watch.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1495856458515-0637185db551?w=1400&q=80&auto=format&fit=crop","alt":"Citizen Promaster Diver, vista frontal","cover":true}
    ]
  },
  {
    "title": "Cartier Tank Must Vintage",
    "summary": "Pieza vintage de los años 80, la forma más reconocible de la relojería francesa.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Cartier"},
      "availability_status": {"t":"text","v":"bajo_reserva"},
      "model": {"t":"text","v":"Tank Must"},
      "reference_number": {"t":"text","v":"W1018387"},
      "gender": {"t":"text","v":"{\"es\":\"Mujer\",\"en\":\"Women\"}"},
      "is_featured": {"t":"boolean","v":true},
      "price": {"t":"number","v":3200},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Usado - Vintage\",\"en\":\"Pre-owned - Vintage\"}"},
      "year": {"t":"number","v":1985},
      "box_papers": {"t":"text","v":"{\"es\":\"Solo reloj, sin caja\",\"en\":\"Watch only, no box\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Chapado en oro\",\"en\":\"Gold-plated\"}"},
      "case_diameter_mm": {"t":"number","v":25},
      "water_resistance": {"t":"text","v":"{\"es\":\"No sumergible\",\"en\":\"Not water resistant\"}"},
      "dial_color": {"t":"text","v":"{\"es\":\"Marfil\",\"en\":\"Ivory\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Cuarzo\",\"en\":\"Quartz\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Piel de cocodrilo\",\"en\":\"Crocodile leather\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Burdeos\",\"en\":\"Burgundy\"}"},
      "functions": {"t":"text_array","v":[]},
      "short_description": {"t":"json","v":"{\"es\":\"Pieza vintage cuidadosamente seleccionada y revisada por nuestro atelier. Disponibilidad limitada — consulta condición y autenticidad.\",\"en\":\"Vintage piece carefully sourced and serviced by our atelier. Limited availability — ask about condition and authenticity.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1400&q=80&auto=format&fit=crop","alt":"Cartier Tank Must vintage, vista frontal","cover":true}
    ]
  },
  {
    "title": "IWC Portugieser Chronograph",
    "summary": "Elegancia clásica alemana con esfera guilloché y subesferas de cronógrafo.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"IWC"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Portugieser Chronograph"},
      "reference_number": {"t":"text","v":"IW371446"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":8300},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2022},
      "box_papers": {"t":"text","v":"{\"es\":\"Caja y documentos completos\",\"en\":\"Full set (box & papers)\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":41},
      "water_resistance": {"t":"text","v":"30 m / 3 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Calibre 69355"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Piel de becerro\",\"en\":\"Calfskin leather\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Marrón\",\"en\":\"Brown\"}"},
      "functions": {"t":"text_array","v":["chronograph","date"]},
      "short_description": {"t":"json","v":"{\"es\":\"Un icono de la relojería alemana, con esfera guilloché y un cronógrafo de columna de alta precisión.\",\"en\":\"An icon of German watchmaking, with a guilloché dial and a high-precision column-wheel chronograph.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1400&q=80&auto=format&fit=crop","alt":"IWC Portugieser Chronograph, vista frontal","cover":true}
    ]
  },
  {
    "title": "Breitling Navitimer B01 Chronograph 41",
    "summary": "El compañero de los pilotos desde 1952, con regla de cálculo circular.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Breitling"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Navitimer B01 Chronograph 41"},
      "reference_number": {"t":"text","v":"AB0139211C1A1"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":8900},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2023},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":41},
      "water_resistance": {"t":"text","v":"30 m / 3 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Negro\",\"en\":\"Black\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Breitling 01"},
      "power_reserve": {"t":"text","v":"{\"es\":\"70 horas\",\"en\":\"70 hours\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["chronograph","slide_rule_bezel"]},
      "short_description": {"t":"json","v":"{\"es\":\"La regla de cálculo circular en el bisel sigue siendo la seña de identidad de este cronógrafo diseñado para la aviación.\",\"en\":\"The circular slide rule on the bezel remains the signature of this chronograph designed for aviation.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=1400&q=80&auto=format&fit=crop","alt":"Breitling Navitimer, vista frontal","cover":true}
    ]
  },
  {
    "title": "Omega Seamaster Aqua Terra Vintage",
    "summary": "Pieza de colección de los años 90, revisada y con nuevo cristal.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Omega"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Seamaster Aqua Terra"},
      "reference_number": {"t":"text","v":"2517.30.00"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":2450},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Usado - Vintage\",\"en\":\"Pre-owned - Vintage\"}"},
      "year": {"t":"number","v":1998},
      "box_papers": {"t":"text","v":"{\"es\":\"Solo reloj, sin caja\",\"en\":\"Watch only, no box\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":36},
      "water_resistance": {"t":"text","v":"150 m / 15 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Azul\",\"en\":\"Blue\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["date"]},
      "short_description": {"t":"json","v":"{\"es\":\"Revisado en nuestro taller: engrasado, hermeticidad verificada y cristal nuevo. Una pieza vintage lista para décadas más.\",\"en\":\"Serviced in our workshop: lubricated, water resistance checked, new crystal. A vintage piece ready for decades more.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1400&q=80&auto=format&fit=crop","alt":"Omega Seamaster Aqua Terra vintage, vista frontal","cover":true}
    ]
  },
  {
    "title": "Fossil Grant Chronograph",
    "summary": "Cronógrafo urbano de acero con esfera skeleton, gran relación calidad-precio.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Fossil"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Grant Chronograph"},
      "reference_number": {"t":"text","v":"ME3054"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":175},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2024},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":44},
      "water_resistance": {"t":"text","v":"50 m / 5 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Marrón\",\"en\":\"Brown\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Piel\",\"en\":\"Leather\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Marrón\",\"en\":\"Brown\"}"},
      "functions": {"t":"text_array","v":["chronograph","date"]},
      "short_description": {"t":"json","v":"{\"es\":\"Esfera skeleton que deja ver el movimiento automático en acción, en un diseño urbano y accesible.\",\"en\":\"Skeleton dial revealing the automatic movement in action, in an accessible urban design.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=1400&q=80&auto=format&fit=crop","alt":"Fossil Grant Chronograph, vista frontal","cover":true}
    ]
  },
  {
    "title": "Seiko Presage Cocktail Time",
    "summary": "Esfera nacarada inspirada en la coctelería japonesa, elegancia asequible.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"Seiko"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Presage Cocktail Time"},
      "reference_number": {"t":"text","v":"SRPB43J1"},
      "gender": {"t":"text","v":"{\"es\":\"Unisex\",\"en\":\"Unisex\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":430},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2023},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":40.5},
      "water_resistance": {"t":"text","v":"50 m / 5 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Verde nacarado\",\"en\":\"Green pearl\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "caliber": {"t":"text","v":"Seiko 4R35"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Piel\",\"en\":\"Leather\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Marrón\",\"en\":\"Brown\"}"},
      "functions": {"t":"text_array","v":["date"]},
      "short_description": {"t":"json","v":"{\"es\":\"Parte de la colección Cocktail Time, con un dial que recrea el reflejo de una copa bajo la luz.\",\"en\":\"Part of the Cocktail Time collection, with a dial that recreates the shimmer of a glass under light.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1400&q=80&auto=format&fit=crop","alt":"Seiko Presage Cocktail Time, vista frontal","cover":true}
    ]
  },
  {
    "title": "TAG Heuer Formula 1 Quartz",
    "summary": "Reloj deportivo de acceso, robusto y con gran legibilidad.",
    "status": "published",
    "attrs": {
      "brand": {"t":"text","v":"TAG Heuer"},
      "availability_status": {"t":"text","v":"disponible"},
      "model": {"t":"text","v":"Formula 1"},
      "reference_number": {"t":"text","v":"WAZ1110.BA0875"},
      "gender": {"t":"text","v":"{\"es\":\"Hombre\",\"en\":\"Men\"}"},
      "is_featured": {"t":"boolean","v":false},
      "price": {"t":"number","v":1250},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "year": {"t":"number","v":2023},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":43},
      "water_resistance": {"t":"text","v":"200 m / 20 bar"},
      "dial_color": {"t":"text","v":"{\"es\":\"Negro\",\"en\":\"Black\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Cuarzo\",\"en\":\"Quartz\"}"},
      "bracelet_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "bracelet_color": {"t":"text","v":"{\"es\":\"Plata\",\"en\":\"Silver\"}"},
      "functions": {"t":"text_array","v":["unidirectional_bezel"]},
      "short_description": {"t":"json","v":"{\"es\":\"Inspirado en el mundo de la Fórmula 1, un deportivo robusto y fiable para el día a día.\",\"en\":\"Inspired by the world of Formula 1, a rugged and reliable sports watch for everyday wear.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1495856458515-0637185db551?w=1400&q=80&auto=format&fit=crop","alt":"TAG Heuer Formula 1, vista frontal","cover":true}
    ]
  },
  {
    "title": "Rolex Datejust 36 (archivado)",
    "summary": "Pieza ya vendida — se conserva en el catálogo interno como referencia histórica.",
    "status": "archived",
    "attrs": {
      "brand": {"t":"text","v":"Rolex"},
      "availability_status": {"t":"text","v":"no_disponible"},
      "model": {"t":"text","v":"Datejust 36"},
      "reference_number": {"t":"text","v":"126200"},
      "price": {"t":"number","v":9200},
      "currency": {"t":"text","v":"EUR"},
      "condition": {"t":"text","v":"{\"es\":\"Nuevo\",\"en\":\"New\"}"},
      "case_material": {"t":"text","v":"{\"es\":\"Acero inoxidable\",\"en\":\"Stainless steel\"}"},
      "case_diameter_mm": {"t":"number","v":36},
      "dial_color": {"t":"text","v":"{\"es\":\"Champán\",\"en\":\"Champagne\"}"},
      "movement": {"t":"text","v":"{\"es\":\"Automático\",\"en\":\"Automatic\"}"},
      "short_description": {"t":"json","v":"{\"es\":\"Este reloj ya no está disponible.\",\"en\":\"This watch is no longer available.\"}"}
    },
    "media": [
      {"url":"https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=1400&q=80&auto=format&fit=crop","alt":"Rolex Datejust 36, archivado","cover":true}
    ]
  }
]
$json$;

  v_watch jsonb;
  v_item_id uuid;
  v_attr_key text;
  v_attr_val jsonb;
  v_attr_id uuid;
  v_attr_type text;
  v_media jsonb;
  v_sort int;
begin
  for v_watch in select * from jsonb_array_elements(v_watches)
  loop
    insert into public.items (company_id, title, summary, status, item_type)
    values (
      v_company_id,
      v_watch->>'title',
      v_watch->>'summary',
      v_watch->>'status',
      v_item_type
    )
    returning id into v_item_id;

    for v_attr_key, v_attr_val in
      select key, value from jsonb_each(v_watch->'attrs')
    loop
      select id into v_attr_id
      from public.attribute_definitions
      where company_id = v_company_id
        and item_type = v_item_type
        and key = v_attr_key;

      if v_attr_id is null then
        raise notice 'Skipping unknown attribute key "%": run 001_attribute_definitions.sql first', v_attr_key;
        continue;
      end if;

      v_attr_type := v_attr_val->>'t';

      if v_attr_type = 'text' then
        insert into public.attribute_values (item_id, attribute_id, value_text)
        values (v_item_id, v_attr_id, v_attr_val->>'v');
      elsif v_attr_type = 'number' then
        insert into public.attribute_values (item_id, attribute_id, value_number)
        values (v_item_id, v_attr_id, (v_attr_val->>'v')::numeric);
      elsif v_attr_type = 'boolean' then
        insert into public.attribute_values (item_id, attribute_id, value_boolean)
        values (v_item_id, v_attr_id, (v_attr_val->>'v')::boolean);
      elsif v_attr_type = 'json' then
        insert into public.attribute_values (item_id, attribute_id, value_json)
        values (v_item_id, v_attr_id, (v_attr_val->>'v')::jsonb);
      elsif v_attr_type = 'text_array' then
        insert into public.attribute_values (item_id, attribute_id, value_text_array)
        values (
          v_item_id,
          v_attr_id,
          array(select jsonb_array_elements_text(v_attr_val->'v'))
        );
      end if;
    end loop;

    v_sort := 0;
    for v_media in select * from jsonb_array_elements(v_watch->'media')
    loop
      insert into public.item_media (item_id, file_type, url_externa, title, alt_text, sort_order, is_cover)
      values (
        v_item_id,
        'image',
        v_media->>'url',
        v_watch->>'title',
        v_media->>'alt',
        v_sort,
        coalesce((v_media->>'cover')::boolean, false)
      );
      v_sort := v_sort + 1;
    end loop;
  end loop;
end $$;
