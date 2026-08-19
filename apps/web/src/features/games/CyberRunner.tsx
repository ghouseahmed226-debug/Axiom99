// [Division 1 & 2] Game Cartridge: CyberRunner 2099
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sound } from '../../core/audio/SoundSynth'

interface Obstacle {
  id: number
  lane: number
  z: number
}

interface Orb {
  id: number
  lane: number
  z: number
  collected: boolean
}

export const CyberRunner: React.FC<{ onGameOver: (score: number) => void }> = ({ onGameOver }) => {
  const [lane, setLane] = useState(0) // -1: Left, 0: Center, 1: Right
  const [jumping, setJumping] = useState(false)
  const [score, setScore] = useState(0)
  const [isDead, setIsDead] = useState(false)

  const playerRef = useRef<THREE.Group>(null)
  const playerY = useRef(0.5)
  const playerVY = useRef(0)
  const speed = useRef(18)
  const nextSpawnZ = useRef(-30)

  const obstacles = useRef<Obstacle[]>([
    { id: 1, lane: 0, z: -25 },
    { id: 2, lane: 1, z: -50 },
    { id: 3, lane: -1, z: -75 },
  ])

  const orbs = useRef<Orb[]>([
    { id: 1, lane: 1, z: -15, collected: false },
    { id: 2, lane: -1, z: -35, collected: false },
    { id: 3, lane: 0, z: -60, collected: false },
  ])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDead) return
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setLane((l) => Math.max(-1, l - 1))
        sound.playClick()
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setLane((l) => Math.min(1, l + 1))
        sound.playClick()
      } else if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && !jumping) {
        setJumping(true)
        playerVY.current = 9
        sound.playJump()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jumping, isDead])

  useFrame((_, delta) => {
    if (isDead) return
    const dt = Math.min(delta, 0.1)

    // Player jump physics
    if (jumping) {
      playerVY.current -= 22 * dt
      playerY.current += playerVY.current * dt
      if (playerY.current <= 0.5) {
        playerY.current = 0.5
        playerVY.current = 0
        setJumping(false)
      }
    }

    if (playerRef.current) {
      const targetX = lane * 2.5
      playerRef.current.position.x += (targetX - playerRef.current.position.x) * 15 * dt
      playerRef.current.position.y = playerY.current
    }

    // Move obstacles & collision test
    obstacles.current.forEach((obs) => {
      obs.z += speed.current * dt
      if (obs.z > 5) {
        obs.z = nextSpawnZ.current - Math.random() * 20
        obs.lane = Math.floor(Math.random() * 3) - 1
      }
      // Collision check
      if (Math.abs(obs.z - 0) < 1.2 && obs.lane === lane && playerY.current < 1.2) {
        setIsDead(true)
        sound.playExplosion()
        onGameOver(score)
      }
    })

    // Move orbs & collect
    orbs.current.forEach((orb) => {
      orb.z += speed.current * dt
      if (orb.z > 5) {
        orb.z = nextSpawnZ.current - Math.random() * 25
        orb.lane = Math.floor(Math.random() * 3) - 1
        orb.collected = false
      }
      if (!orb.collected && Math.abs(orb.z - 0) < 1.5 && orb.lane === lane) {
        orb.collected = true
        sound.playCoin()
        setScore((s) => s + 50)
      }
    })

    setScore((s) => s + Math.floor(speed.current * dt * 2))
    speed.current = Math.min(35, speed.current + dt * 0.2)
  })

  return (
    <group>
      {/* Highway floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]}>
        <planeGeometry args={[10, 150]} />
        <meshStandardMaterial color="#0f0f18" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Lane divider glow lines */}
      {[-1.25, 1.25].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -50]}>
          <planeGeometry args={[0.08, 150]} />
          <meshBasicMaterial color="#6c47ff" />
        </mesh>
      ))}

      {/* Player Runner Craft */}
      <group ref={playerRef} position={[0, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.6, 1.4]} />
          <meshStandardMaterial color="#6c47ff" roughness={0.2} metalness={0.9} emissive="#a78bfa" emissiveIntensity={0.4} />
        </mesh>
        {/* Thruster glow */}
        <pointLight color="#00ffff" intensity={2} distance={3} position={[0, 0, 1]} />
      </group>

      {/* Obstacles */}
      {obstacles.current.map((obs) => (
        <mesh key={obs.id} position={[obs.lane * 2.5, 0.6, obs.z]}>
          <boxGeometry args={[1.5, 1.2, 0.8]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Orbs */}
      {orbs.current.map(
        (orb) =>
          !orb.collected && (
            <mesh key={orb.id} position={[orb.lane * 2.5, 0.8, orb.z]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.8} />
            </mesh>
          )
      )}

      {/* Ambient & Directional Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 15, -10]} intensity={1.5} color="#c4b5fd" />
    </group>
  )
}