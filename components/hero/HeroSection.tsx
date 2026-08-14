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
      {/* Posiciones y rotaciones ya definitivas — panel oculto para los
          invitados. Sacar `hidden` si hace falta reajustar algo. */}
      <Leva hidden />
      <div className={styles.glow} />
      <div className={styles.canvasLayer}>
        <MainScene />
      </div>
      <HeroContent />
    </div>
  );
}
