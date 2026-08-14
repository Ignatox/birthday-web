# Proyecto: Invitación de Cumpleaños 3D

## Qué es esto

Página web que funciona como **invitación de cumpleaños personal**. No es un sitio genérico: es un regalo/experiencia para que los amigos del organizador la abran y accedan a los datos de la fiesta (fecha, ubicación, hora) de una forma jugada y visualmente impactante, con un modelo 3D real de su cara girando en el centro de la pantalla.

## Flujo de la experiencia (en orden)

1. **Pantalla de ingreso — "calculadora" con código secreto**
   - Se muestra un modelo 3D de una calculadora (u otro objeto con pantalla/inputs) en la escena.
   - El usuario tiene que ingresar un código tipo input de verificación (varios casilleros, uno por dígito) usando la **fecha de nacimiento del organizador** como el enigma/respuesta a resolver.
   - Al ingresar el código correcto, se dispara la transición de éxito hacia el paso 2. Si es incorrecto, feedback de error (sin bloquear intentos).

2. **Transición de éxito → reproducción de música**
   - Al validar el código correctamente, arranca la reproducción de una canción en **.mp3** (el organizador la va a proveer/importar como asset).
   - La música queda de fondo durante el resto de la experiencia — épica, tipo trailer.

3. **Escena principal — modelo 3D + datos del cumpleaños**
   - Se revela la escena central: el **modelo 3D de la cara del organizador, en grande, en el centro de la pantalla**, girando 360° a velocidad lenta y continua.
   - Alrededor/junto a este modelo se van cargando progresivamente los **datos del cumpleaños**: fecha, ubicación, hora, y demás info del evento.
   - La carga de estos datos NO es scroll tradicional: son transiciones de **fade in/out** (cross-fade) — cada dato ocupa la pantalla y se desvanece dando paso al siguiente, no hay desplazamiento visual de contenido. Ver sección de animaciones más abajo.
   - Todo (modelo girando, música, aparición de datos) va **coordinado en el tiempo**, no son elementos independientes.

## Assets 3D

- **Formato: `.glb`** para todos los modelos (glTF binario). Es el estándar a usar en todo el proyecto — no otros formatos.
- **Total: 5 modelos `.glb`** en la escena:
  1. **Modelo principal — la cara/rostro del organizador**, generado por escaneo 3D real (capturado con KIRI Engine, iPhone Pro, modo Photo Scan — el intento con LiDAR no funcionó, el de fotos sí). Estética resultante es "cursed"/graciosa, aceptada como parte del tono divertido de la invitación. **Va en grande, en el centro de la pantalla, como elemento protagonista, girando 360° lento.**
  2. **Modelo de calculadora** — para la pantalla de ingreso del código secreto (ver si sus botones son meshes separados o un único mesh fusionado; condiciona cómo se implementa la interacción, ver sección técnica).
  3-5. **Tres modelos decorativos adicionales** — bajados de Sketchfab (u otro repo), a definir cuáles exactamente (se barajaron ideas como guitarra, pelota de fútbol, elementos de cumpleaños tipo globos/confetti/torta). Se posicionan alrededor del modelo principal como ambientación.
  - Origen de los modelos: **Sketchfab** (recomendado — el más usado para web en 2026, exporta directo en glTF/.glb, filtrar por "Downloadable" + licencia). Alternativas: Poly Haven (CC0, bueno para HDRIs de ambiente), Kenney/Quaternius (low-poly CC0).

## Audio

- Una canción en **.mp3**, importada por el organizador (no se genera ni se busca — la trae él).
- Arranca al validar el código secreto correctamente.
- Debe poder sincronizarse con las transiciones visuales (fade in/out del volumen coordinado con las animaciones de entrada/salida de cada sección).

## Stack técnico decidido

- **React Three Fiber** (+ `@react-three/drei`) sobre Three.js para la escena 3D.
- **gltfjsx** para convertir cada `.glb` en un componente React ya armado (nodos, materiales) antes de insertarlo en la escena.
- **Leva** como panel de controles en vivo para ajustar `position`/`rotation`/`scale` de cada uno de los 5 modelos mientras se acomoda la escena (evita ir a ciegas ajustando números y refrescando).
- **GSAP** (+ ScrollTrigger si aplica) para las animaciones y timelines coordinados — es lo que sincroniza música, aparición del modelo y fade de los datos.
- **fullPage.js** (con su modo de fade transitions) como estructura base de "secciones" para el efecto de deslizar-sin-scroll-tradicional descrito en el flujo.
- **Howler.js** para el manejo del audio mp3 (fades, control más prolijo que el `<audio>` nativo, se engancha con los timelines de GSAP).
- **canvas-confetti** o **tsparticles** como posible efecto extra al desbloquear la invitación (opcional, a definir).
- Inputs del código secreto: casilleros tipo OTP (uno por dígito de la fecha de nacimiento), animados con GSAP para estados de error/éxito.

## Notas técnicas importantes

- **Escala inconsistente entre modelos**: cada `.glb` bajado de un repositorio distinto puede venir en una escala arbitraria (metros, centímetros, etc.). Hay que ajustar el `scale` de cada uno de los 5 modelos a mano/a ojo hasta que convivan en proporción correcta entre sí — para eso está Leva.
- **Interactividad de la calculadora**: revisar con `gltfjsx` si el modelo de calculadora tiene los botones como meshes separados y nombrados (permitiría `onClick` directo sobre cada botón del modelo 3D) o si es un mesh único fusionado (en ese caso, la calculadora queda como decoración visual y se superponen inputs HTML invisibles posicionados sobre los botones usando la proyección 3D→2D de la cámara, vía `useThree`).
- El modelo de la cara, al venir de un escaneo real (no modelado a mano), puede tener mayor cantidad de polígonos/peso que los decorativos — vigilar performance general de la escena.

## Deploy

- **Destino: Vercel.** Todo el proyecto se arma pensando en un deploy simple y directo ahí, sin configuración especial de infraestructura.
- **Sin base de datos.** No hay persistencia de ningún tipo — no se guardan intentos del código, no hay backend con estado, no hay usuarios ni sesiones. Todo el contenido (fecha de nacimiento para validar el código, datos del cumpleaños, textos) va **hardcodeado en el frontend** como constantes/config del proyecto, no en una base de datos ni en un backend separado.
- Los assets (los 5 `.glb` y el `.mp3`) se sirven como archivos estáticos del propio proyecto (carpeta `public/`), no desde un storage externo.
- Evitar cualquier librería o patrón que asuma backend con estado, ORM, o conexión a DB — no aplica a este proyecto.

## Stack general del organizador (para referencia de estilo de código)

Node.js, Next.js, NestJS, React Native, Supabase, Oracle, MongoDB, MySQL. Comunicación en español.
