"use client";

import { Suspense, useMemo, useRef, type ComponentType } from "react";
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

// El modelo protagonista: fijo en el centro, con un movimiento sutil
// (float suave) en vez del giro continuo. La rotación queda expuesta en
// Leva para poder orientarlo mirando de frente a cámara.
//
// El escaneo 3D no tiene su geometría centrada en el (0,0,0) del mesh, así
// que sin <Center> el pivote real queda corrido del punto que usan los
// satélites como centro de órbita — sobre todo notorio a escalas grandes.
// <Center> mide el bounding box y recentra el contenido, para que
// `position` sea realmente el centro visual del modelo.
function SteadyBody({
  position,
  rotation,
  scale,
}: {
  position: Vec3;
  rotation: Vec3;
  scale: number;
}) {
  return (
    <Float speed={1} rotationIntensity={0.08} floatIntensity={0.25}>
      <group position={position} rotation={rotation} scale={scale}>
        <Center>
          <Body />
        </Center>
      </group>
    </Float>
  );
}

// Objetos decorativos orbitando alrededor de la cara, como satélites —
// no giran sobre su propio eje, se desplazan en círculo alrededor de `center`.
function OrbitingModel({
  name,
  Component,
  center,
  defaultRadius,
  defaultHeight,
  defaultSpeed,
  defaultPhaseDeg,
  defaultScale = 1,
}: {
  name: string;
  Component: ComponentType<Record<string, never>>;
  center: Vec3;
  defaultRadius: number;
  defaultHeight: number;
  defaultSpeed: number;
  defaultPhaseDeg: number;
  defaultScale?: number;
}) {
  const ref = useRef<Group>(null);
  const { radius, height, speed, phaseDeg, scale } = useControls(name, {
    radius: { value: defaultRadius, min: 0, max: 12, step: 0.05 },
    height: { value: defaultHeight, min: -6, max: 6, step: 0.05 },
    speed: { value: defaultSpeed, min: -2, max: 2, step: 0.01 },
    phaseDeg: { value: defaultPhaseDeg, min: -180, max: 180, step: 1 },
    scale: { value: defaultScale, min: 0.01, max: 10, step: 0.01 },
  });

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
      <Component />
    </group>
  );
}

export default function MainScene() {
  const {
    position: bodyPosition,
    rotation: bodyRotation,
    scale: bodyScale,
  } = useControls("Cara (protagonista)", {
    position: { value: [-2.0, 0.0, 0.0] as Vec3, step: 0.1 },
    rotation: { value: [0, 0, 0] as Vec3, step: 0.01 },
    scale: { value: 10, min: 0.01, max: 10, step: 0.01 },
  });

  return (
    <Canvas
      camera={{ position: [0, 0.4, 5], fov: 42 }}
      gl={{ alpha: true }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <Environment preset="night" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1} />
        <pointLight position={[-4, 1, -2]} intensity={8} color="#7c5cff" />
        <pointLight position={[4, -1, -2]} intensity={8} color="#4fd7ff" />

        <SteadyBody
          position={bodyPosition}
          rotation={bodyRotation}
          scale={bodyScale}
        />
        <OrbitingModel
          name="Calculadora (satélite)"
          Component={Calculator}
          center={bodyPosition}
          defaultRadius={3.8}
          defaultHeight={-1.9}
          defaultSpeed={0.3}
          defaultPhaseDeg={-114}
          defaultScale={0.2}
        />
        <OrbitingModel
          name="PC viejo (satélite)"
          Component={OldPc}
          center={bodyPosition}
          defaultRadius={4.05}
          defaultHeight={-1.7}
          defaultSpeed={0.3}
          defaultPhaseDeg={-151}
          defaultScale={2.5}
        />
        <OrbitingModel
          name="Control PS2 (satélite)"
          Component={Ps2Controller}
          center={bodyPosition}
          defaultRadius={3.27}
          defaultHeight={2.1}
          defaultSpeed={0.3}
          defaultPhaseDeg={-150}
          defaultScale={0.3}
        />
        <OrbitingModel
          name="Copa del mundo (satélite)"
          Component={WorldCupTrophy}
          center={bodyPosition}
          defaultRadius={2.95}
          defaultHeight={-1.9}
          defaultSpeed={0.3}
          defaultPhaseDeg={30}
          defaultScale={2.6}
        />
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={8} />
    </Canvas>
  );
}
