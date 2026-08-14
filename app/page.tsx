"use client";

import { useCallback, useState } from "react";

import { AccessScreen } from "@/components/entry/AccessScreen";
import { HeroSection } from "@/components/hero/HeroSection";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const handleReveal = useCallback(() => setUnlocked(true), []);

  return (
    <main style={{ width: "100vw", height: "100dvh" }}>
      {unlocked ? <HeroSection /> : <AccessScreen onReveal={handleReveal} />}
    </main>
  );
}
