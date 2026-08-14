/*
Author: rhcreations (https://sketchfab.com/rhcreations)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/ps2-controller-9b0db71448a14907a6235c79bdce786a
Title: PS2 Controller
*/

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh
    Object_5: THREE.Mesh
  }
  materials: {
    PS2_Controller_Plastic_Material: THREE.MeshStandardMaterial
    PS2_Controller_Rubber_Material: THREE.MeshStandardMaterial
  }
}

export function Ps2Controller(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/ps2_controller.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group>
        <mesh geometry={nodes.Object_4.geometry} material={materials.PS2_Controller_Plastic_Material} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.PS2_Controller_Rubber_Material} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/ps2_controller.glb')
