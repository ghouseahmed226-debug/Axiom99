// [Division 1 & 2] Game Cartridge: NeonArena 3D Top-Down Shooter
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sound } from '../../core/audio/SoundSynth'

interface Bullet {
  id: number
  x: number
  z: number
  vx: number
  vz: number
}

interface Enemy {
  id: number
  x: number
  z: number
  health: number
}

export const NeonArena: React.FC<{ onGameOver: (score: number) => void }> = ({ onGameOver }) => {
  const [score, setScore] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [isDead, setIsDead] = useState(false)

  const playerPos = useRef({ x: 0, z: 0 })
  const playerRef = useRef<THREE.Group>(null)
  const keys = useRef<Record<string, boolean>>({})
  const bullets = useRef<Bullet[]>([])
  const enemies = useRef<Enemy[]>([
    { id: 1, x: -10, z: -10, health: 30 },
    { id: 2, x: 10, z: -10, health: 30 },
    { id: 3, x: 0, z: 15, health: 30 },
  ])
  const bulletIdSeq = useRef(1)
  const enemyIdSeq = useRef(4)
  const spawnTimer = useRef(0)

  const { camera, raycaster, pointer } = useThree()

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => { keys.current[e.code] = true }
    const handleUp = (e: KeyboardEvent) => { keys.current[e.code] = false }

    const handleClick = () => {
      if (isDead) return
      sound.playLaser()
      // Shoot towards pointer
      raycaster.setFromCamera(pointer, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const target = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, target)

      const dir = new THREE.Vector3(target.x - playerPos.current.x, 0, target.z - playerPos.current.z).normalize()
      bullets.current.push({
        id: bulletIdSeq.current++,
        x: playerPos.current.x,
        z: playerPos.current.z,
        vx: dir.x * 25,
        vz: dir.z * 25,
      })
    }

    window.addEventListener('keydown', handleDown)
    window.addEventListener('keyup', handleUp)
    window.addEventListener('pointerdown', handleClick)

    return () => {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
      window.removeEventListener('pointerdown', handleClick)
    }
  }, [isDead, camera, pointer, raycaster])

  useFrame((_, delta) => {
    if (isDead) return
    const dt = Math.min(delta, 0.1)

    // Player movement
    let moveX = 0
    let moveZ = 0
    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveZ -= 1
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveZ += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveX -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveX += 1

    const moveSpeed = 10
    playerPos.current.x = Math.max(-18, Math.min(18, playerPos.current.x + moveX * moveSpeed * dt))
    playerPos.current.z = Math.max(-18, Math.min(18, playerPos.current.z + moveZ * moveSpeed * dt))

    if (playerRef.current) {
      playerRef.current.position.x = playerPos.current.x
      playerRef.current.position.z = playerPos.current.z
    }

    // Bullet updates
    bullets.current.forEach((b) => {
      b.x += b.vx * dt
      b.z += b.vz * dt
    })
    bullets.current = bullets.current.filter((b) => Math.abs(b.x) < 25 && Math.abs(b.z) < 25)

    // Enemy spawn
    spawnTimer.current += dt
    if (spawnTimer.current > 2.5 && enemies.current.length < 12) {
      spawnTimer.current = 0
      const angle = Math.random() * Math.PI * 2
      enemies.current.push({
        id: enemyIdSeq.current++,
        x: Math.cos(angle) * 18,
        z: Math.sin(angle) * 18,
        health: 30,
      })
    }

    // Enemy AI & collision with bullets
    enemies.current.forEach((enemy) => {
      const dx = playerPos.current.x - enemy.x
      const dz = playerPos.current.z - enemy.z
      const dist = Math.hypot(dx, dz)
      if (dist > 0.5) {
        enemy.x += (dx / dist) * 4 * dt
        enemy.z += (dz / dist) * 4 * dt
      }

      // Attack player
      if (dist < 1.2) {
        setPlayerHealth((h) => {
          const next = h - 20 * dt
          if (next <= 0 && !isDead) {
            setIsDead(true)
            sound.playExplosion()
            onGameOver(score)
            return 0
          }
          return next
        })
      }

      // Bullet hit enemy
      bullets.current.forEach((b) => {
        if (Math.hypot(b.x - enemy.x, b.z - enemy.z) < 1.0) {
          enemy.health -= 25
          b.x = 9999 // remove bullet
          if (enemy.health <= 0) {
            sound.playExplosion()
            setScore((s) => s + 100)
          }
        }
      })
    })

    enemies.current = enemies.current.filter((e) => e.health > 0)
  })

  return (
    <group>
      {/* Arena Grid Floor */}
      <gridHelper args={[40, 40, '#6c47ff', '#1f1f38']} position={[0, 0.01, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0b0b14" />
      </mesh>

      {/* Player Ship */}
      <group ref={playerRef} position={[0, 0.5, 0]}>
        <mesh>
          <coneGeometry args={[0.7, 1.4, 4]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.5} />
        </mesh>
        <pointLight color="#00ffcc" intensity={2} distance={5} />
      </group>

      {/* Bullets */}
      {bullets.current.map((b) => (
        <mesh key={b.id} position={[b.x, 0.5, b.z]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}

      {/* Enemies */}
      {enemies.current.map((e) => (
        <mesh key={e.id} position={[e.x, 0.5, e.z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* HUD Info */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} />
    </group>
  )
}