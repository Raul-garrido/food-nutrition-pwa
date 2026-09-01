# Estado del proyecto — Food & Nutrition AI

> Resumen para poner al día a cualquier asistente de IA (Claude Code local,
> Claude Code on the web, Kiro/Amazon Q u otro) que se incorpore a trabajar
> en este repositorio. Empieza siempre leyendo `CLAUDE.md` (reglas de
> trabajo) y este archivo (qué hay hecho); `README.md` tiene el detalle de
> uso, claves de API y limitaciones conocidas.

## Qué es

**Food & Nutrition AI**: PWA de una sola página (`index.html`, HTML/CSS/JS
sin frameworks ni build step, sin backend propio). El usuario escribe una
consulta en lenguaje natural o un alimento y recibe una ficha con datos
nutricionales reales más una explicación generada por IA que **no inventa
nutrientes** (la IA solo interpreta datos ya obtenidos de fuentes reales).

Arquitectura interna: **Query Interpreter → Safety Engine → Candidate
Engine → Evidence Engine → Recipe Engine → explicación IA**.

Fuentes de datos: USDA FoodData Central (nutrición), Open Food Facts
(productos envasados/código de barras), TheMealDB (recetas). IA: Gemini
(por defecto) o Claude, a elección del usuario.

Sin cuentas, sin servidor propio, sin base de datos propia: todo se pide
bajo demanda a las APIs originales con las claves que introduce el propio
usuario, cacheado localmente en IndexedDB. Las claves solo persisten en
IndexedDB si el usuario activa "recordar"; si no, viven en
`sessionStorage` y desaparecen al cerrar el navegador.

## Estado actual

- Rama principal de desarrollo remoto: `claude/nutricion-nube-sync-leek6s`
  (sobre `main`, repo `raul-garrido/food-nutrition-pwa`).
- 21 commits desde el commit inicial. Última copia de seguridad en
  `versiones/`: `v16_ofrecer-codigo-manual-siempre-que-falte-dato` (28 ago).
- Funcionalidades ya construidas, por orden cronológico aproximado:
  1. V1 inicial: motor de consulta nutricional completo (los 5 engines),
     ficha de alimento, recetas vía TheMealDB, configuración de claves.
  2. Traducciones al español de resultados, ficha de receta y candidatos.
  3. Reducción de peticiones a la IA (fusión de llamadas de explicación +
     traducción de título de receta en una sola).
  4. Arreglos de Service Worker (dejó de servir app-shell cacheado
     obsoleto) y de Diagnóstico (manual/cacheado en vez de automático en
     cada carga; distinción real entre timeout y error CORS).
  5. Fix de claves de API huérfanas al activar "recordar" después de
     guardar.
  6. Fijado del modelo Gemini a una versión estable (evitar alias
     `-latest` que se retiran sin aviso); migrado a `3.6-flash` cuando
     `2.5-flash` se retiró.
  7. Nueva pestaña **"Foto"**: analizar un alimento envasado a partir de
     hasta 3 fotos, con fallback de búsqueda por nombre en Open Food
     Facts (reescrito para ser robusto: reintentos, API moderna, query
     más limpia) y, finalmente, sustituido por búsqueda web nativa de la
     IA cuando el nombre no encuentra nada en OFF.
  8. Lectura de **código de barras** por IA a partir de foto, con
     validación por dígito de control, campo de introducción manual como
     respaldo (quitado, luego reintroducido solo cuando falla la lectura
     de la IA, y finalmente ofrecido siempre que falten datos
     nutricionales, no solo en los dos casos originales) y puntuación por
     estrellas del producto.
- Documentado el flujo de trabajo híbrido local/remoto en `CLAUDE.md`
  (ver más abajo).

## Limitaciones conocidas (asumidas conscientemente, ver `README.md`)

- Claves de API expuestas en el cliente (aceptable para uso personal, sin
  publicar el HTML con claves pegadas).
- Claude requiere la cabecera
  `anthropic-dangerous-direct-browser-access` para llamarse desde el
  navegador.
- Open Food Facts no permite fijar `User-Agent` propio desde `fetch()`.
- Límites de peticiones de USDA y Open Food Facts respetados con una cola
  simple en el cliente.
- TheMealDB gratuito solo filtra por un ingrediente principal.
- Icono SVG puede no renderizar bien como icono de pantalla de inicio en
  iOS/Safari.
- El Service Worker solo cachea el app-shell, no las respuestas de las
  APIs (esas se cachean vía IndexedDB).

**Fuera de alcance en V1**: cuentas de usuario, servidor propio, base de
datos propia, pagos, publicidad, sincronización en la nube de datos de
usuario, publicación en tiendas de apps, reconocimiento de imágenes más
allá de lo ya construido, diagnóstico médico o planes dietéticos clínicos.

## Flujo de trabajo (importante para cualquier IA que trabaje aquí)

Dos formas de trabajar en este proyecto, coordinadas a través de este
mismo repositorio de GitHub:

- **Sesión local** (acceso al disco del usuario, p. ej. app de escritorio
  de Claude Code sobre la carpeta clonada): edita `index.html`
  directamente en el sitio, guarda copia en `versiones/` cada ~5 cambios
  siguiendo la convención `vN_descripcion-breve_YYYY-MM-DD.html`, y solo
  hace commit/push cuando el usuario lo pide explícitamente.
- **Sesión remota** (sin acceso al disco del usuario, p. ej. Claude Code
  on the web, o un agente en la nube como Kiro/Amazon Q): trabaja sobre
  el repositorio de GitHub como de costumbre (rama, commits, push), y lo
  deja explícito si el usuario pide algo que requiera el disco local.

El punto de encuentro entre ambas es siempre este repositorio: quien
trabaje en local sincroniza haciendo push cuando el usuario lo pide; quien
trabaje en remoto hace `git pull`/`fetch` para partir del estado más
reciente. Revisa siempre `CLAUDE.md` para las reglas exactas de cada modo
antes de tocar código.
