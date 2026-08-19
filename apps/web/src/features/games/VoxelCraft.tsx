// [Division 1 & 2] Game Cartridge: VoxelCraft 3D Sandbox Builder
import React, { useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { sound } from '../../core/audio/SoundSynth'

interface Voxel {
  id: string
  x: number
  y: number
  z: number
  color: string
}

const PALETTE = ['#6c47ff', '#00ffcc', '#ffd32a', '#ff4757', '#2ed573', '#ffffff']

export const VoxelCraft: React.FC = () => {
  const [color, setColor] = useState(PALETTE[0])
  const [voxels, setVoxels] = useState<Voxel[]>([
    { id: '0,0,0', x: 0, y: 0.5, z: 0, color: '#6c47ff' },
    { id: '1,0,0', x: 1, y: 0.5, z: 0, color: '#00ffcc' },
    { id: '-1,0,0', x: -1, y: 0.5, z: 0, color: '#ffd32a' },
  ])

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.button !== 0) return // Left click only

    if (e.shiftKey && e.object.name === 'voxel') {
      // Remove voxel
      const { x, y, z } = e.object.position
      setVoxels((v) => v.filter((item) => !(item.x === x && item.y === y && item.z === z)))
      sound.playExplosion()
      return
    }

    if (e.face) {
      const normal = e.face.normal
      const pos = e.object.position.clone().add(normal)
      const nx = Math.round(pos.x)
      const ny = Math.max(0.5, Math.round(pos.y - 0.5) + 0.5)
      const nz = Math.round(pos.z)
      const id = `${nx},${ny},${nz}`

      if (!voxels.some((v) => v.id === id)) {
        setVoxels((v) => [...v, { id, x: nx, y: ny, z: nz, color }])
        sound.playCoin()
      }
    }
  }

  return (
    <>
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={4} maxDistance={25} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 15]} intensity={1.5} castShadow />

      {/* Build Grid Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onPointerDown={handlePointerDown}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#111118" roughness={0.8} />
      </mesh>
      <gridHelper args={[30, 30, '#6c47ff', '#252538']} position={[0, 0.01, 0]} />

      {/* Voxels */}
      {voxels.map((v) => (
        <mesh key={v.id} name="voxel" position={[v.x, v.y, v.z]} onPointerDown={handlePointerDown} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={v.color} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </>
  )
}