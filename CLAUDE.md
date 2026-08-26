# Instrucciones para Claude Code en este repositorio

## Modo económico por defecto

Por defecto, trabaja de forma económica en tokens y llamadas a herramientas:

- Lee solo los archivos o fragmentos que realmente necesites para la tarea,
  no el repo entero "por si acaso".
- Agrupa verificaciones relacionadas en vez de comprobar de una en una.
- No lances subagentes (Agent/Task) para cosas que puedes resolver
  directamente con Read/Grep/Glob/Bash en pocos pasos.
- No repitas lecturas de un archivo que ya has leído en la misma sesión
  salvo que haya cambiado.
- Prioriza respuestas y cambios concisos frente a explicaciones largas o
  documentación no pedida.

## Excepción: profundidad cuando importa

Esta economía nunca debe sacrificar corrección. Si una tarea es compleja,
ambigua, afecta a varios archivos, toca seguridad/datos del usuario, o el
usuario indica que quiere una verificación exhaustiva, deja el modo
económico de lado para esa tarea: lee lo que haga falta, verifica a fondo,
usa subagentes si aporta valor real. Vuelve al modo económico en cuanto esa
tarea concreta esté resuelta.

El usuario puede pedir explícitamente "modo completo" o "sin restricciones"
para una tarea puntual; en ese caso, ignora la economía por defecto para esa
tarea.

## Sobre este repositorio

`index.html`: **Food & Nutrition AI**, PWA de nutrición de una sola página
(HTML/CSS/JS sin dependencias ni backend). Arquitectura: Query Interpreter →
Safety Engine → Candidate Engine → Evidence Engine → Recipe Engine →
explicación IA, sobre datos reales de USDA FoodData Central, Open Food
Facts y TheMealDB, con Gemini/Claude como IA. Sin cuentas, sin servidor
propio, sin base de datos propia; claves de API introducidas por el
usuario y guardadas en IndexedDB (opcional, con opción de borrado). Ver
`README.md` para detalles, limitaciones conocidas y cómo obtener cada
clave de API.
