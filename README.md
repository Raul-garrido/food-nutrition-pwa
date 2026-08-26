# Food & Nutrition AI — V1

PWA de una sola página (HTML/CSS/JS, sin dependencias ni backend) que
convierte una consulta en lenguaje natural o un alimento en una ficha con
datos nutricionales reales y una explicación generada por IA a partir de
esos datos (la IA no inventa nutrientes).

Arquitectura: Query Interpreter → Safety Engine → Candidate Engine →
Evidence Engine → Recipe Engine → explicación IA. Sin cuentas, sin
servidor propio, sin base de datos propia: todo se consulta bajo demanda a
las APIs originales y se cachea localmente en IndexedDB.

## Uso

Sírvelo con cualquier servidor estático — necesario para que el Service
Worker y el manifest funcionen correctamente, `file://` no es suficiente
para eso:

```powershell
./serve.ps1
```

o, en Mac/Linux:

```bash
python3 -m http.server 8124
```

Ve a **Configuración** e introduce tus claves de API. Después usa
**Diagnóstico → Volver a probar** para verificar cada conexión sin tener
que mirar el código.

## Claves de API necesarias

| Servicio | Dónde obtenerla | Obligatoria |
|---|---|---|
| USDA FoodData Central | https://fdc.nal.usda.gov/api-key-signup | Sí, para nutrición |
| Gemini | https://aistudio.google.com/apikey | Recomendada (IA predeterminada) |
| Claude | https://console.anthropic.com/settings/keys | Opcional |
| TheMealDB | No requiere registro en V1 (usa la clave de prueba `1`, gratuita para proyectos personales) | — |
| Open Food Facts | No requiere clave | — |

Las claves se guardan en **IndexedDB** solo si activas "Recordar claves en
este dispositivo"; si lo dejas desactivado, se guardan en
`sessionStorage` y desaparecen al cerrar el navegador. Hay un botón para
borrarlas todas de golpe en Configuración.

## Limitaciones conocidas (asumidas conscientemente)

- **Claves de API expuestas en el cliente.** Una app HTML local no puede
  mantener una clave "en secreto" frente al propietario del dispositivo.
  Aceptable en este uso personal (clave propia, sin publicar, sin backend
  que las almacene), pero no compartas el HTML con tus claves pegadas.
- **Claude requiere la cabecera `anthropic-dangerous-direct-browser-access`**
  para poder llamarse desde el navegador; esto es intencional y forma
  parte de cómo Anthropic soporta este caso de uso, pero implica que la
  clave viaja visible en las peticiones de red del propio dispositivo.
- **Open Food Facts pide un `User-Agent` identificativo**, pero los
  navegadores no permiten fijar esa cabecera desde `fetch()`; se envía el
  User-Agent del propio navegador. No debería bloquear las peticiones,
  pero no cumple al 100% la recomendación de su documentación.
- **Límites de peticiones**: USDA ~1000/hora/IP, Open Food Facts ~15/min
  lecturas y ~10/min búsquedas, respetados con una cola simple en el
  cliente. Un uso muy intensivo (por ejemplo escanear muchos códigos de
  barra seguidos) puede agotar la cuota de OFF.
- **TheMealDB gratuito** solo filtra por un ingrediente principal; el
  filtrado por varios ingredientes a la vez es una función premium que no
  se usa aquí.
- **Icono en iOS**: se usa un icono SVG. iOS/Safari no siempre renderiza
  bien SVG como icono de pantalla de inicio; en Android/desktop
  (Chrome/Edge) funciona sin problemas. Si el icono no aparece bien en
  iPhone, se puede sustituir `icon.svg` por un PNG más adelante sin tocar
  el resto de la app.
- **Offline**: el Service Worker solo cachea el propio app-shell (HTML,
  manifest, icono), no las respuestas de las APIs. Los datos de alimentos,
  recetas y favoritos consultados previamente siguen disponibles offline
  porque se guardan en IndexedDB vía el gestor de caché de la app.

## Fuera de alcance en V1

Cuentas de usuario, servidor propio, base de datos propia, pagos,
publicidad, sincronización en la nube, publicación en tiendas de apps,
reconocimiento de imágenes, diagnóstico médico o planes dietéticos
clínicos. Ver la especificación cerrada de origen para el roadmap V1.1/V1.2
(código de barras, comparador, sustituciones, recetas personalizadas,
perfil personal).
