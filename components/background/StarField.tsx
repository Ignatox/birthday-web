import type { CSSProperties } from "react";
import styles from "./StarField.module.css";

const PHOTOS = [
  "/photos/cara-1.webp",
  "/photos/cara-2.webp",
  "/photos/cara-3.webp",
] as const;

// Dispersión fija (no random) para que no "salte" al pasar de la
// calculadora a la escena principal — es el mismo fondo todo el tiempo.
// cara-2 va notoriamente más grande que cara-1: a su tamaño original no
// se distinguía bien qué foto era.
const STARS = [
  { photo: 0, top: "8%", left: "10%", size: 64, rotate: -14, opacity: 0.28, delay: 0 },
  { photo: 0, top: "72%", left: "6%", size: 46, rotate: 6, opacity: 0.24, delay: 2.3 },
  { photo: 0, top: "40%", left: "92%", size: 40, rotate: 18, opacity: 0.18, delay: 1.8 },
  { photo: 0, top: "88%", left: "46%", size: 50, rotate: 4, opacity: 0.22, delay: 2.6 },
  { photo: 0, top: "25%", left: "35%", size: 44, rotate: -8, opacity: 0.16, delay: 1.4 },
  { photo: 0, top: "60%", left: "65%", size: 56, rotate: 12, opacity: 0.2, delay: 0.9 },
  { photo: 0, top: "15%", left: "60%", size: 38, rotate: -20, opacity: 0.16, delay: 2.0 },
  { photo: 0, top: "92%", left: "15%", size: 48, rotate: 10, opacity: 0.2, delay: 0.4 },
  { photo: 1, top: "14%", left: "82%", size: 90, rotate: 10, opacity: 0.24, delay: 1.1 },
  { photo: 1, top: "80%", left: "88%", size: 96, rotate: -8, opacity: 0.26, delay: 0.6 },
  { photo: 1, top: "50%", left: "3%", size: 70, rotate: -20, opacity: 0.2, delay: 3 },
  { photo: 1, top: "4%", left: "48%", size: 76, rotate: -6, opacity: 0.18, delay: 0.3 },
  { photo: 1, top: "33%", left: "15%", size: 84, rotate: 6, opacity: 0.22, delay: 1.6 },
  { photo: 1, top: "65%", left: "40%", size: 78, rotate: -12, opacity: 0.2, delay: 2.2 },
  { photo: 1, top: "45%", left: "78%", size: 88, rotate: 14, opacity: 0.18, delay: 0.8 },
  { photo: 1, top: "78%", left: "60%", size: 92, rotate: -4, opacity: 0.22, delay: 1.2 },
  { photo: 2, top: "3%", left: "25%", size: 50, rotate: -10, opacity: 0.22, delay: 0.5 },
  { photo: 2, top: "18%", left: "95%", size: 42, rotate: 14, opacity: 0.18, delay: 1.7 },
  { photo: 2, top: "55%", left: "20%", size: 58, rotate: -6, opacity: 0.24, delay: 2.4 },
  { photo: 2, top: "95%", left: "55%", size: 46, rotate: 8, opacity: 0.2, delay: 0.2 },
  { photo: 2, top: "30%", left: "80%", size: 40, rotate: -18, opacity: 0.16, delay: 2.8 },
  { photo: 2, top: "70%", left: "8%", size: 54, rotate: 12, opacity: 0.22, delay: 1.0 },
  { photo: 2, top: "85%", left: "30%", size: 44, rotate: -4, opacity: 0.18, delay: 1.9 },
  { photo: 2, top: "10%", left: "75%", size: 48, rotate: 16, opacity: 0.2, delay: 0.7 },
] as const;

// Tamaño responsive: por debajo de ~800px de ancho escala con el
// viewport (piso de 24px para que no desaparezcan); de ahí para arriba
// queda en su tamaño de diseño. La versión anterior escalaba demasiado
// agresivo y las dejaba ilegibles en mobile.
function responsiveSize(px: number) {
  const vw = (px / 8).toFixed(2);
  return `clamp(24px, ${vw}vw, ${px}px)`;
}

// Fondo de fotos dispersas tipo "estrellas", fijo detrás de toda la
// experiencia (calculadora + escena 3D) — imágenes planas livianas
// (WebP, ~15-30KB c/u), sin costo de GPU/WebGL.
export function StarField({ revealed }: { revealed: boolean }) {
  return (
    <div
      className={`${styles.field} ${revealed ? styles.revealed : ""}`}
      aria-hidden="true"
    >
      <div className={styles.dots} />
      {STARS.map((star, i) => (
        <img
          key={i}
          src={PHOTOS[star.photo]}
          alt=""
          className={styles.star}
          style={
            {
              top: star.top,
              left: star.left,
              width: responsiveSize(star.size),
              animationDelay: `${star.delay}s`,
              "--base-opacity": star.opacity,
              "--rot": `${star.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
