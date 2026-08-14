"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Howl } from "howler";

import {
  accessCode,
  introTiming,
  loadingPhrases,
  siteConfig,
} from "@/config/site";
import styles from "./AccessScreen.module.css";

type Status = "idle" | "error" | "success";
type IntroPhase = "code" | "countdown" | "loading";

const KEYPAD_LAYOUT = [7, 8, 9, 4, 5, 6, 1, 2, 3];
const PROGRESS_TICK_MS = 5000;

// Arranca la descarga de los 5 .glb (cada componente llama a
// useGLTF.preload al importarse) sin montar la escena todavía.
function preloadMainScene() {
  import("@/components/scene/MainScene");
}

export function AccessScreen({ onReveal }: { onReveal: () => void }) {
  const [digits, setDigits] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [introPhase, setIntroPhase] = useState<IntroPhase>("code");
  const [countdown, setCountdown] = useState<number>(
    introTiming.countdownSeconds
  );
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const displayRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const introStartedRef = useRef(false);

  // Al acertar: dispara la precarga de modelos + canción, y arranca la
  // cuenta regresiva. Esos ~28s (countdown + revealAtSongSecond) son los
  // que se aprovechan para que todo esté listo antes de mostrar la escena.
  useEffect(() => {
    const el = displayRef.current;
    if (!el) return;

    if (status === "error") {
      gsap.fromTo(
        el,
        { x: -10 },
        { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
      const t = setTimeout(() => {
        setDigits([]);
        setStatus("idle");
      }, 650);
      return () => clearTimeout(t);
    }

    if (status === "success" && !introStartedRef.current) {
      introStartedRef.current = true;

      preloadMainScene();
      soundRef.current = new Howl({
        src: [siteConfig.audio.src],
        html5: true,
        volume: 0,
        onloaderror: () => {
          console.warn(
            `No se pudo cargar ${siteConfig.audio.src}. Revisá public/audio/.`
          );
        },
      });

      gsap.fromTo(
        el,
        { scale: 1 },
        {
          scale: 1.06,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        }
      );

      const t = setTimeout(() => setIntroPhase("countdown"), 700);
      return () => clearTimeout(t);
    }
  }, [status]);

  useEffect(() => {
    if (introPhase !== "countdown") return;

    const interval = setInterval(() => {
      setCountdown((c) => Math.max(c - 1, 0));
    }, 1000);

    const t = setTimeout(() => {
      setIntroPhase("loading");
    }, introTiming.countdownSeconds * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "loading") return;

    soundRef.current?.play();
    soundRef.current?.fade(0, 0.8, 1500);

    const totalTicks = Math.max(
      1,
      Math.round((introTiming.revealAtSongSecond * 1000) / PROGRESS_TICK_MS)
    );
    const step = 100 / totalTicks;

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
      setPhraseIndex((i) => (i + 1) % loadingPhrases.length);
    }, PROGRESS_TICK_MS);

    const t = setTimeout(onReveal, introTiming.revealAtSongSecond * 1000);
    return () => {
      clearInterval(progressInterval);
      clearTimeout(t);
    };
  }, [introPhase, onReveal]);

  useEffect(() => {
    return () => {
      soundRef.current?.unload();
    };
  }, []);

  function pressDigit(n: number) {
    if (status !== "idle" || digits.length >= accessCode.length) return;
    const next = [...digits, String(n)];
    setDigits(next);
    if (next.length === accessCode.length) {
      setStatus(next.join("") === accessCode ? "success" : "error");
    }
  }

  function backspace() {
    if (status !== "idle") return;
    setDigits((prev) => prev.slice(0, -1));
  }

  function clear() {
    if (status !== "idle") return;
    setDigits([]);
  }

  const displayClass = [
    styles.display,
    status === "error" ? styles.displayError : "",
    status === "success" ? styles.displaySuccess : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>
        {introPhase === "code" ? "Ingresá el código de acceso" : " "}
      </p>

      <div className={styles.calculator}>
        <div ref={displayRef} className={displayClass}>
          {introPhase === "code" &&
            Array.from({ length: accessCode.length }).map((_, i) => (
              <span key={i} className={styles.digit}>
                {digits[i] ?? ""}
              </span>
            ))}

          {introPhase === "countdown" && (
            <div className={styles.message}>
              <span className={styles.messageText}>SUBÍ EL VOLUMEN</span>
              <span className={styles.countdownNumber}>{countdown}</span>
            </div>
          )}

          {introPhase === "loading" && (
            <div className={styles.message}>
              <span className={styles.messageTextLoading}>
                CARGANDO... {Math.round(progress)}%
              </span>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.loadingPhrase}>
                {loadingPhrases[phraseIndex]}
              </span>
            </div>
          )}
        </div>

        {introPhase === "code" && (
          <div className={styles.keypad}>
            {KEYPAD_LAYOUT.map((n) => (
              <button
                key={n}
                type="button"
                className={styles.key}
                onClick={() => pressDigit(n)}
              >
                {n}
              </button>
            ))}
            <button type="button" className={styles.keySecondary} onClick={clear}>
              C
            </button>
            <button type="button" className={styles.key} onClick={() => pressDigit(0)}>
              0
            </button>
            <button type="button" className={styles.keySecondary} onClick={backspace}>
              ⌫
            </button>
          </div>
        )}
      </div>

      <p className={styles.hint}>
        {introPhase === "code" ? "Pista: la fecha de nacimiento (DDMMAA)" : " "}
      </p>
    </div>
  );
}
