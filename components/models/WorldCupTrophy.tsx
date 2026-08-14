import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    ['tripo_node_f8610b72-69b1-4164-9b84-1b61374b0c3d']: THREE.Mesh
  }
  materials: {
    ['tripo_material_f8610b72-69b1-4164-9b84-1b61374b0c3d']: THREE.MeshStandardMaterial
  }
}

export function WorldCupTrophy(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/world_cup_trophy.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group>
        <mesh geometry={nodes['tripo_node_f8610b72-69b1-4164-9b84-1b61374b0c3d'].geometry} material={materials['tripo_material_f8610b72-69b1-4164-9b84-1b61374b0c3d']} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/world_cup_trophy.glb')
