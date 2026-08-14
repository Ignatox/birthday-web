import { useGLTF } from "@react-three/drei";

import { MODEL_URLS } from "./modelUrls";

const SATELLITE_URLS = [
  MODEL_URLS.oldPc,
  MODEL_URLS.ps2Controller,
  MODEL_URLS.calculator,
  MODEL_URLS.worldCupTrophy,
];

const SATELLITE_STAGGER_MS = 600;

// La cara se precarga primero y sola; los 4 satélites se piden de a uno,
// escalonados, para no saturar CPU/GPU de celulares modestos bajando y
// decodificando 5 modelos al mismo tiempo.
export function preloadModelsStaggered() {
  useGLTF.preload(MODEL_URLS.body);
  SATELLITE_URLS.forEach((url, i) => {
    setTimeout(() => useGLTF.preload(url), SATELLITE_STAGGER_MS * (i + 1));
  });
}
