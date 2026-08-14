"use client";

import { useCallback, useRef, useState } from "react";
import type { Howl } from "howler";

import { StarField } from "@/components/background/StarField";
import { AccessScreen } from "@/components/entry/AccessScreen";
import { HeroSection } from "@/components/hero/HeroSection";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  // Se prende apenas el código es correcto (no recién en el reveal final),
  // así las estrellas aparecen ya desde la cuenta regresiva / "CARGANDO...".
  const [codeVerified, setCodeVerified] = useState(false);
  // Vive acá (no en AccessScreen) para que la canción siga sonando
  // cuando AccessScreen se desmonta al revelar la escena 3D.
  const soundRef = useRef<Howl | null>(null);
  const handleReveal = useCallback(() => setUnlocked(true), []);
  const handleCodeVerified = useCallback(() => setCodeVerified(true), []);

  return (
    <main style={{ width: "100vw", height: "100dvh" }}>
      {/* Fuera del switch de fases: mismo fondo, sin remontarse, desde la
          calculadora hasta la escena final. */}
      <StarField revealed={codeVerified} />
      {unlocked ? (
        <HeroSection />
      ) : (
        <AccessScreen
          onReveal={handleReveal}
          onCodeVerified={handleCodeVerified}
          soundRef={soundRef}
        />
      )}
    </main>
  );
}
