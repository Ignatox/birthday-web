import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

import { MODEL_URLS } from '@/lib/modelUrls'

type GLTFResult = GLTF & {
  nodes: {
    ['tripo_node_f8610b72-69b1-4164-9b84-1b61374b0c3d']: THREE.Mesh
  }
  materials: {
    ['tripo_material_f8610b72-69b1-4164-9b84-1b61374b0c3d']: THREE.MeshStandardMaterial
  }
}

export function WorldCupTrophy(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF(MODEL_URLS.worldCupTrophy) as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group>
        <mesh geometry={nodes['tripo_node_f8610b72-69b1-4164-9b84-1b61374b0c3d'].geometry} material={materials['tripo_material_f8610b72-69b1-4164-9b84-1b61374b0c3d']} />
      </group>
    </group>
  )
}
