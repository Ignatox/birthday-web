"use client";

import { useCallback, useRef, useState } from "react";
import type { Howl } from "howler";

import { AccessScreen } from "@/components/entry/AccessScreen";
import { HeroSection } from "@/components/hero/HeroSection";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  // Vive acá (no en AccessScreen) para que la canción siga sonando
  // cuando AccessScreen se desmonta al revelar la escena 3D.
  const soundRef = useRef<Howl | null>(null);
  const handleReveal = useCallback(() => setUnlocked(true), []);

  return (
    <main style={{ width: "100vw", height: "100dvh" }}>
      {unlocked ? (
        <HeroSection />
      ) : (
        <AccessScreen onReveal={handleReveal} soundRef={soundRef} />
      )}
    </main>
  );
}
