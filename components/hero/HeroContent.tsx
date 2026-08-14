"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { siteConfig } from "@/config/site";
import { displayFont } from "@/lib/fonts";
import styles from "./HeroContent.module.css";

export function HeroContent() {
  const { event, ageTurning } = siteConfig;
  const mapsHref = event.mapsUrl || undefined;

  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Título y detalle arrancan invisibles, corridos hacia el centro vertical
  // de la pantalla. Aparecen ahí (uno después del otro) y recién después
  // se deslizan a su posición final (arriba/abajo) — de paso, esto le da
  // más tiempo de fondo a los modelos para terminar de cargar en celulares
  // menos potentes antes de que la escena quede completamente asentada.
  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    const detailsEl = detailsRef.current;
    if (!titleEl || !detailsEl) return;

    const ctx = gsap.context(() => {
      const GAP = 24; // separación deseada entre título y detalle al aparecer
      const viewportCenter = window.innerHeight / 2;
      const titleRect = titleEl.getBoundingClientRect();
      const detailsRect = detailsEl.getBoundingClientRect();

      const titleOffset =
        viewportCenter - (titleRect.top + titleRect.height / 2);

      // El detalle NO apunta al centro de la pantalla (ahí ya está el
      // título) — apunta a "justo debajo de donde va a quedar el título",
      // para que no se superpongan al aparecer.
      const titleBottomAfterMove = viewportCenter + titleRect.height / 2;
      const detailsTargetCenter =
        titleBottomAfterMove + GAP + detailsRect.height / 2;
      const detailsOffset =
        detailsTargetCenter - (detailsRect.top + detailsRect.height / 2);

      gsap.set(titleEl, { y: titleOffset, opacity: 0, scale: 0.92 });
      gsap.set(detailsEl, { y: detailsOffset, opacity: 0, scale: 0.92 });

      gsap
        .timeline({ delay: 0.2 })
        .to(titleEl, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
        })
        .to(
          detailsEl,
          { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
          "+=0.3"
        )
        // Pausa con todo ya asentado en el centro antes de separarse.
        .to(
          [titleEl, detailsEl],
          { y: 0, duration: 0.9, ease: "power3.inOut" },
          "+=3"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.overlay}>
      <h1
        ref={titleRef}
        className={`${styles.title} ${displayFont.className}`}
      >
        Te invito a mi <span className={styles.highlight}>cumpleaños</span>{" "}
        <span className={styles.badge}>N°{ageTurning}</span>
      </h1>

      <div ref={detailsRef} className={styles.details}>
        <div className={`${styles.chipRow} ${displayFont.className}`}>
          <span className={`${styles.chip} ${styles.chipCyan}`}>
            {event.date}
          </span>
          <span className={`${styles.chip} ${styles.chipPurple}`}>
            {event.time}
          </span>
          <span className={`${styles.chip} ${styles.chipPink}`}>
            {event.location}
          </span>
        </div>

        {mapsHref ? (
          <a
            className={styles.mapsLink}
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
          >
            click para ubicación
          </a>
        ) : (
          <span className={styles.mapsPending}>click para ubicación</span>
        )}
      </div>
    </div>
  );
}
