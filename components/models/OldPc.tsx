/*
Author: LiliumLetifer (https://sketchfab.com/LiliumLetifer)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/old-pc-5aa0b296714b4347ac796c0774653cf4
Title: Old PC
*/

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh
    defaultMaterial_1: THREE.Mesh
  }
  materials: {
    COMPLEMENTOS: THREE.MeshStandardMaterial
    PRINCIPAL: THREE.MeshStandardMaterial
  }
}

export function OldPc(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/old_pc.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group>
        <mesh geometry={nodes.defaultMaterial.geometry} material={materials.COMPLEMENTOS} scale={0.21} />
        <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.PRINCIPAL} scale={0.21} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/old_pc.glb')
