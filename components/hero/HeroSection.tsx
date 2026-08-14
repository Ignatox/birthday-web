"use client";

import dynamic from "next/dynamic";
import { Leva } from "leva";

import { HeroContent } from "./HeroContent";
import styles from "./HeroSection.module.css";

const MainScene = dynamic(() => import("@/components/scene/MainScene"), {
  ssr: false,
});

export function HeroSection() {
  return (
    <div className={styles.wrapper}>
      {/* Posiciones ya configuradas — panel oculto. Poner hidden={false}
          para volver a ajustar desde la UI de Leva. */}
      <Leva hidden />
      <div className={styles.glow} />
      <div className={styles.canvasLayer}>
        <MainScene />
      </div>
      <HeroContent />
    </div>
  );
}
