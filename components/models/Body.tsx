import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

import { MODEL_URLS } from '@/lib/modelUrls'

type GLTFResult = GLTF & {
  nodes: {
    ['3DModel']: THREE.Mesh
  }
  materials: {
    ['3DModel']: THREE.MeshStandardMaterial
  }
}

export function Body(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF(MODEL_URLS.body) as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group>
        <mesh geometry={nodes['3DModel'].geometry} material={materials['3DModel']} rotation={[Math.PI / 2, 0, 0]} />
      </group>
    </group>
  )
}
