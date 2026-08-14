/*
Author: Niilo Poutanen (https://sketchfab.com/niilo.poutanen)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/casio-classwiz-calculator-22ac8280c1434e5f8b41e2fdec45abd6
Title: Casio classwiz calculator
*/

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

import { MODEL_URLS } from '@/lib/modelUrls'

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh
    Object_3: THREE.Mesh
    Object_4: THREE.Mesh
    Object_5: THREE.Mesh
    Object_6: THREE.Mesh
    Object_7: THREE.LineSegments
    Object_8: THREE.Mesh
    Object_9: THREE.Mesh
    Object_10: THREE.Mesh
  }
  materials: {
    harmaa: THREE.LineBasicMaterial | THREE.MeshStandardMaterial
    Func: THREE.MeshStandardMaterial
    Lasi: THREE.MeshStandardMaterial
    Musta_muovi: THREE.MeshStandardMaterial
    material: THREE.MeshStandardMaterial
    Nytt: THREE.MeshStandardMaterial
    Napit: THREE.MeshStandardMaterial
    Runko: THREE.MeshPhysicalMaterial
  }
}

export function Calculator(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF(MODEL_URLS.calculator) as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group>
        <lineSegments geometry={nodes.Object_7.geometry} material={materials.harmaa} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_2.geometry} material={materials.Func} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.Lasi} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.Musta_muovi} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.material} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.Nytt} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.harmaa} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.Napit} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.Runko} rotation={[-Math.PI / 2, 0, 0]} />
      </group>
    </group>
  )
}

