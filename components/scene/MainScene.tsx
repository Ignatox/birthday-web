"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Float, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import type { Group } from "three";

import { Body } from "@/components/models/Body";
import { Calculator } from "@/components/models/Calculator";
import { OldPc } from "@/components/models/OldPc";
import { Ps2Controller } from "@/components/models/Ps2Controller";
import { WorldCupTrophy } from "@/components/models/WorldCupTrophy";

type Vec3 = [number, number, number];

// Si un modelo falla al cargar (celular flojo, red mala, etc.) que
// desaparezca solo, sin tirar abajo el resto de la escena.
class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("No se pudo cargar un modelo decorativo:", error);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

// Revela `count` elementos de a uno, cada `delayMs` — así en celulares
// modestos no se sube todo a la GPU en el mismo frame.
function useStaggeredCount(count: number, delayMs: number) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= count) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), delayMs);
    return () => clearTimeout(t);
  }, [revealed, count, delayMs]);

  return revealed;
}

// El modelo protagonista: fijo en el centro, con un movimiento sutil
// (float suave) en vez del giro continuo. La rotación queda expuesta en
// Leva para poder orientarlo mirando de frente a cámara.
//
// El escaneo 3D no tiene su geometría centrada en el (0,0,0) del mesh, así
// que sin <Center> el pivote real queda corrido del punto que usan los
// satélites como centro de órbita — sobre todo notorio a escalas grandes.
// <Center> mide el bounding box y recentra el contenido, para que
// `position` sea realmente el centro visual del modelo.
//
// El bounding box no siempre coincide con lo que a ojo se ve "centrado"
// (geometría asimétrica del escaneo). "Cara — ajuste fino" corrige eso a
// mano, SIN tocar `position` — así el centro de órbita de los satélites
// no se mueve cuando se afina solo el encuadre de la cara. El offset va
// afuera de <Center>, si fuera adentro Center lo volvería a cancelar.
function SteadyBody({
  position,
  rotation,
  scale,
}: {
  position: Vec3;
  rotation: Vec3;
  scale: number;
}) {
  const { offset } = useControls("Cara — ajuste fino", {
    offset: { value: [0.05, 0, 0] as Vec3, step: 0.01 },
  });

  return (
    <Float speed={1} rotationIntensity={0.08} floatIntensity={0.25}>
      <group position={position} rotation={rotation} scale={scale}>
        <group position={offset}>
          <Center>
            <Body />
          </Center>
        </group>
      </group>
    </Float>
  );
}

// Objetos decorativos orbitando alrededor de la cara, como satélites —
// no se desplazan sobre su propio eje al girar la órbita: `rotation` es
// una orientación fija propia del objeto (para encararlo, ej. calculadora
// y PC "de frente"), separada del movimiento orbital de `ref`.
function OrbitingModel({
  name,
  Component: ModelComponent,
  center,
  defaultRadius,
  defaultHeight,
  defaultSpeed,
  defaultPhaseDeg,
  defaultScale = 1,
  defaultRotation = [0, 0, 0],
}: {
  name: string;
  Component: ComponentType<Record<string, never>>;
  center: Vec3;
  defaultRadius: number;
  defaultHeight: number;
  defaultSpeed: number;
  defaultPhaseDeg: number;
  defaultScale?: number;
  defaultRotation?: Vec3;
}) {
  const ref = useRef<Group>(null);
  const { radius, height, speed, phaseDeg, scale, rotation } = useControls(
    name,
    {
      radius: { value: defaultRadius, min: 0, max: 12, step: 0.05 },
      height: { value: defaultHeight, min: -6, max: 6, step: 0.05 },
      speed: { value: defaultSpeed, min: -2, max: 2, step: 0.01 },
      phaseDeg: { value: defaultPhaseDeg, min: -180, max: 180, step: 1 },
      scale: { value: defaultScale, min: 0.01, max: 10, step: 0.01 },
      rotation: { value: defaultRotation, step: 0.01 },
    }
  );

  const phase = useMemo(() => (phaseDeg * Math.PI) / 180, [phaseDeg]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const angle = clock.elapsedTime * speed + phase;
    ref.current.position.set(
      center[0] + Math.cos(angle) * radius,
      center[1] + height,
      center[2] + Math.sin(angle) * radius
    );
  });

  return (
    <group ref={ref} scale={scale}>
      <group rotation={rotation}>
        <Center>
          <ModelComponent />
        </Center>
      </group>
    </group>
  );
}

const SATELLITES = [
  {
    key: "oldPc",
    name: "PC viejo (satélite)",
    Component: OldPc,
    defaultRadius: 4.05,
    defaultHeight: -0.41,
    defaultSpeed: 0.3,
    defaultPhaseDeg: -90,
    defaultScale: 2.5,
    defaultRotation: [0, 5, 0] as Vec3,
  },
  {
    key: "ps2",
    name: "Control PS2 (satélite)",
    Component: Ps2Controller,
    defaultRadius: 4.52,
    defaultHeight: -0.31,
    defaultSpeed: 0.3,
    defaultPhaseDeg: -180,
    defaultScale: 0.3,
    defaultRotation: [1, 0, 0] as Vec3,
  },
  {
    key: "calculator",
    name: "Calculadora (satélite)",
    Component: Calculator,
    defaultRadius: 3.8,
    defaultHeight: -0.2,
    defaultSpeed: 0.3,
    defaultPhaseDeg: 0,
    defaultScale: 0.25,
    defaultRotation: [20, 0, 0] as Vec3,
  },
  {
    key: "trophy",
    name: "Copa del mundo (satélite)",
    Component: WorldCupTrophy,
    defaultRadius: 2.95,
    defaultHeight: -0.25,
    defaultSpeed: 0.3,
    defaultPhaseDeg: 90,
    defaultScale: 1.95,
  },
] as const;

const SATELLITE_REVEAL_DELAY_MS = 500;

export default function MainScene() {
  const {
    position: bodyPosition,
    rotation: bodyRotation,
    scale: bodyScale,
  } = useControls("Cara (protagonista)", {
    position: { value: [0.0, 0.0, -3.0] as Vec3, step: 0.1 },
    rotation: { value: [0, 0, 0] as Vec3, step: 0.01 },
    scale: { value: 10, min: 0.01, max: 10, step: 0.01 },
  });

  // La cara aparece primero, sola; los satélites se van sumando de a uno.
  const revealedSatellites = useStaggeredCount(
    SATELLITES.length,
    SATELLITE_REVEAL_DELAY_MS
  );

  return (
    <Canvas
      camera={{ position: [0, 0.4, 5], fov: 42 }}
      gl={{ alpha: true }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1} />
      <pointLight position={[-4, 1, -2]} intensity={8} color="#7c5cff" />
      <pointLight position={[4, -1, -2]} intensity={8} color="#4fd7ff" />

      <Suspense fallback={null}>
        <ModelErrorBoundary>
          <SteadyBody
            position={bodyPosition}
            rotation={bodyRotation}
            scale={bodyScale}
          />
        </ModelErrorBoundary>
      </Suspense>

      {SATELLITES.slice(0, revealedSatellites).map((sat) => (
        <Suspense key={sat.key} fallback={null}>
          <ModelErrorBoundary>
            <OrbitingModel
              name={sat.name}
              Component={sat.Component}
              center={bodyPosition}
              defaultRadius={sat.defaultRadius}
              defaultHeight={sat.defaultHeight}
              defaultSpeed={sat.defaultSpeed}
              defaultPhaseDeg={sat.defaultPhaseDeg}
              defaultScale={sat.defaultScale}
            />
          </ModelErrorBoundary>
        </Suspense>
      ))}

      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={8} />
    </Canvas>
  );
}
