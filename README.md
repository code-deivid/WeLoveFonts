# WeLoveFonts

Aplicación web con herramientas de texto para redes sociales y redacción: un generador de
"fuentes" Unicode, un contador de palabras y un conversor de mayúsculas y minúsculas.

Todo el procesamiento ocurre en el navegador. No hay backend, cuentas de usuario ni envío de
texto a ningún servidor.

## Qué problema resuelve

Instagram, X o WhatsApp no permiten cambiar la tipografía de una biografía o de un mensaje.
Unicode incluye alfabetos matemáticos y decorativos (𝐁𝐨𝐥𝐝, 𝘐𝘵𝘢𝘭𝘪𝘤, 𝔉𝔯𝔞𝔨𝔱𝔲𝔯, Ⓑⓤⓑⓑⓛⓔ...) que
sí se pueden pegar en esos campos. WeLoveFonts convierte texto normal a esos alfabetos y lo
copia al portapapeles. Además, reúne en la misma web dos utilidades habituales al escribir
para internet: medir un texto y cambiar sus mayúsculas.

## Funcionalidades

- **Generador de fuentes (`/fonts`)**
  - 9 estilos Unicode con vista previa en tiempo real.
  - Filtros por categoría (bold, cursiva, decorativos, utilidad).
  - Favoritos que se guardan en `localStorage` y aparecen primero.
  - Copia con un clic en la tarjeta o en su botón.
  - Las tildes, la ñ y la ç se conservan como marcas combinadas (`á` → `𝐚́`).
- **Contador de palabras (`/word-counter`)**
  - Palabras, caracteres (con y sin espacios), oraciones, párrafos y tiempo de lectura.
  - Indicadores de límite para X, SMS y meta description.
  - Los caracteres se cuentan como grafemas: `👍🏽` o `🇪🇸` cuentan como uno.
- **Conversor de texto (`/converter`)**
  - MAYÚSCULAS, minúsculas, Capitalizar Cada Palabra, Sentence case, aLtErNaDo, iNVERTIDO y
    texto al revés.
  - El texto al revés no rompe emojis compuestos, banderas ni tildes.
- **General**
  - Tema claro y oscuro: sigue la preferencia del sistema hasta que el usuario elige uno.
  - Diseño responsive con menú móvil.
  - Página 404.
  - Soporte de `prefers-reduced-motion`.

## Tecnologías

- [Vue 3](https://vuejs.org/) con Composition API y `<script setup>`
- TypeScript
- [Vite](https://vite.dev/) 7
- Vue Router 4 (vistas cargadas bajo demanda)
- Tailwind CSS 4 (reset base) + CSS propio con variables de diseño en `src/assets/main.css`
- [Vitest](https://vitest.dev/) para pruebas unitarias
- ESLint + Prettier

## Requisitos e instalación

- Node.js `^20.19.0` o `>=22.12.0` (ver `engines` en `package.json`)
- npm

```bash
git clone <url-del-repositorio>
cd WeLoveFontsRedesign
npm ci
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts

| Comando              | Descripción                                                     |
| -------------------- | --------------------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo con recarga en caliente                  |
| `npm run build`      | Comprobación de tipos y compilación de producción en `dist/`    |
| `npm run preview`    | Sirve localmente la compilación de `dist/`                      |
| `npm run type-check` | Comprobación de tipos con `vue-tsc`                             |
| `npm test`           | Ejecuta las pruebas unitarias una vez                           |
| `npm run test:watch` | Ejecuta las pruebas en modo observación                         |
| `npm run lint:check` | Analiza el código con ESLint sin modificar archivos             |
| `npm run lint`       | Analiza el código y aplica las correcciones automáticas         |
| `npm run format`     | Formatea `src/` con Prettier                                    |

## Estructura del proyecto

```
src/
├─ assets/
│  ├─ main.css              # Variables de diseño (tema claro/oscuro), base y utilidades
│  ├─ data/dataFonts.json   # Alfabetos Unicode de cada estilo
│  └─ fonts/                # Korcy Oblique (solo para el logotipo)
├─ components/
│  ├─ home/                 # Piezas de la Home: specimen rotatorio y cursor personalizado
│  ├─ ToolHeader.vue        # Cabecera común de las tres herramientas
│  ├─ AppNavbar.vue, AppFooter.vue, AppToast.vue, AppBackground.vue, ...
├─ composables/
│  ├─ useTheme.ts           # Tema claro/oscuro
│  ├─ useFavorites.ts       # Favoritos del generador de fuentes
│  ├─ useClipboard.ts       # Copiar al portapapeles con aviso
│  ├─ useToast.ts           # Estado del aviso global
│  ├─ useMouseParallax.ts   # Parallax del fondo
│  └─ useScrolled.ts        # Estado de scroll de la barra de navegación
├─ directives/
│  └─ vReveal.ts            # Animación de aparición al hacer scroll
├─ utils/
│  ├─ unicodeFonts.ts       # Conversión de texto a estilos Unicode
│  ├─ textTools.ts          # Transformaciones de texto y métricas
│  └─ storage.ts            # Acceso a localStorage tolerante a errores
├─ views/                   # Una vista por ruta
├─ router/index.ts
├─ App.vue
└─ main.ts
```

Las pruebas viven junto al código que prueban, en carpetas `__tests__/`.

## Decisiones técnicas

**La lógica de texto está separada de los componentes.** La conversión Unicode, las
transformaciones y las métricas son funciones puras en `src/utils/`. Las vistas solo gestionan
estado e interfaz, y esas funciones se prueban con Vitest sin montar componentes.

**Conversión Unicode por descomposición.** `dataFonts.json` define, para cada estilo, los
caracteres en el mismo orden que el estilo "Normal". Antes de convertir, el texto se normaliza a
NFD para separar las letras de sus tildes: la letra se sustituye y la tilde combinada se
conserva. Así no hace falta una entrada por cada vocal acentuada, y funcionan también acentos que
no están en el JSON (à, ü, ô...). Una prueba verifica que todos los estilos tienen el mismo
número de caracteres que "Normal". Si no, toda la conversión se desplazaría.

**Grafemas en lugar de `string.length`.** El contador y la inversión de texto usan
`Intl.Segmenter` para trabajar con caracteres tal y como los percibe el usuario. Si el navegador
no lo soporta, hay una alternativa por puntos de código.

**Tema sin destello.** Un pequeño script en línea en `index.html` aplica el tema antes del primer
pintado. Usa la preferencia guardada o, si no la hay, la del sistema. La preferencia solo se
guarda cuando el usuario pulsa el botón de tema.

**Aparición al hacer scroll con una directiva.** `v-reveal` comparte un único
`IntersectionObserver` y funciona también con elementos que se crean después de montar la vista,
como las tarjetas al cambiar de categoría. El estado se guarda en un atributo `data-reveal`, no
en una clase, para que los bindings `:class` de Vue no lo sobrescriban.

**Scroll coordinado con la transición de página.** Las vistas cambian con una transición
`out-in`. El `scrollBehavior` del router espera a que la vista nueva entre en el DOM, de modo
que los enlaces con ancla (`/#tools`) funcionan también desde otra página.

**Animaciones sin trabajo innecesario.** El parallax del fondo solo ejecuta
`requestAnimationFrame` mientras se está moviendo. El cursor personalizado de la Home escribe
su posición directamente en el DOM, sin estado reactivo, para no volver a renderizar la página
en cada movimiento del ratón.

## Datos y privacidad

La aplicación no envía texto a ningún servidor. En `localStorage` solo se guardan:

- `wlf-theme`: tema elegido por el usuario (`light` o `dark`).
- `wlf-favorites`: lista de estilos favoritos.

## Autor

Desarrollado por [DEiVid](https://github.com/code-deivid).
