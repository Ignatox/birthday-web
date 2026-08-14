// Config hardcodeada del proyecto — no hay backend ni DB, todo vive acá.
// TODO: completar con los datos reales antes de compartir la invitación.

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export const siteConfig = {
  organizerName: "TODO",

  // Años que cumple — se usa en el título de la invitación.
  ageTurning: 24,

  // Fecha de nacimiento del organizador. Es la única fuente de verdad:
  // el código de acceso de la calculadora se deriva de acá (ver accessCode más abajo).
  birthDate: {
    day: 21,
    month: 8,
    year: 2002,
  },

  event: {
    date: "22 de Agosto del 2026",
    time: "14 hs",
    location: "En mi casa",
    // TODO: dirección real (texto), para mostrarla si hace falta.
    address: "TODO",
    mapsUrl: "https://maps.app.goo.gl/vAe9pYnW4q77CbX59",
  },

  audio: {
    src: "/audio/rollin-air-raid-vehicle.mp3",
  },
} as const;

// Frases que van rotando en la pantalla "CARGANDO..." mientras se
// precargan los modelos y arranca la canción.
export const loadingPhrases = [
  "Traé tu bebida...",
  "Traé tu buena onda...",
  "Un año más...",
  "Preparando la fiesta...",
  "Ya casi...",
] as const;

// Secuencia de desbloqueo: al acertar el código, "SUBÍ EL VOLUMEN" +
// cuenta regresiva de countdownSeconds, después arranca la canción y la
// calculadora marca "CARGANDO...". revealAtSongSecond segundos después de
// que arranca la canción, se revela la escena 3D — esa ventana (countdown +
// revealAtSongSecond) es la que la página aprovecha para precargar los modelos.
export const introTiming = {
  countdownSeconds: 3,
  revealAtSongSecond: 25,
} as const;

// Código de acceso de la pantalla "calculadora": DDMMAA de birthDate.
// Ej. 01/01/2000 -> "010100". Un casillero OTP por dígito (6 casilleros).
export const accessCode = `${pad2(siteConfig.birthDate.day)}${pad2(
  siteConfig.birthDate.month
)}${pad2(siteConfig.birthDate.year % 100)}`;
