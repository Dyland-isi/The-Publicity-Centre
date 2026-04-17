'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 150 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10
      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005
    }
    return { positions, velocities }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    if (!mesh.current) return
    const { pointer } = state
    mouse.current.x = pointer.x * viewport.width * 0.5
    mouse.current.y = pointer.y * viewport.height * 0.5

    const posAttr = mesh.current.geometry.attributes.position
    const posArray = posAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArray[i3] += velocities[i3]
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2]

      const dx = posArray[i3] - mouse.current.x
      const dy = posArray[i3 + 1] - mouse.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 3) {
        const force = (3 - dist) * 0.002
        posArray[i3] += dx * force
        posArray[i3 + 1] += dy * force
      }

      if (posArray[i3] > 10) posArray[i3] = -10
      if (posArray[i3] < -10) posArray[i3] = 10
      if (posArray[i3 + 1] > 10) posArray[i3 + 1] = -10
      if (posArray[i3 + 1] < -10) posArray[i3 + 1] = 10
      if (posArray[i3 + 2] > 5) posArray[i3 + 2] = -5
      if (posArray[i3 + 2] < -5) posArray[i3 + 2] = 5
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        color="#93C63B"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingSpheres({ count = 30 }: { count?: number }) {
  const group = useRef<THREE.Group>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const sphereData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.03,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.2,
    }))
  }, [count])

  useFrame((state) => {
    if (!group.current) return
    const { pointer, clock } = state
    mouse.current.x = pointer.x * viewport.width * 0.5
    mouse.current.y = pointer.y * viewport.height * 0.5
    const t = clock.getElapsedTime()

    group.current.children.forEach((child, i) => {
      const data = sphereData[i]
      if (!data) return
      child.position.x = data.position[0] + Math.sin(t * data.speed + data.offset) * 0.5
      child.position.y = data.position[1] + Math.cos(t * data.speed + data.offset) * 0.5
      child.position.z = data.position[2]

      const dx = child.position.x - mouse.current.x
      const dy = child.position.y - mouse.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 4) {
        const force = (4 - dist) * 0.01
        child.position.x += dx * force
        child.position.y += dy * force
      }
    })
  })

  return (
    <group ref={group}>
      {sphereData.map((data, i) => (
        <mesh key={i} position={data.position} scale={data.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#93C63B" transparent opacity={data.opacity} />
        </mesh>
      ))}
    </group>
  )
}

function GeckoWatermark() {
  const groupRef = useRef<THREE.Group>(null!)

  const geckoBody = useMemo(() => {
    const shape = new THREE.Shape()
    shape.ellipse(0, 0, 2.5, 4, 0, Math.PI * 2, false, 0)
    return shape
  }, [])

  const geckoHead = useMemo(() => {
    const shape = new THREE.Shape()
    shape.ellipse(0, 4.5, 1.8, 1.5, 0, Math.PI * 2, false, 0)
    return shape
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <mesh>
        <shapeGeometry args={[geckoBody]} />
        <meshBasicMaterial color="#93C63B" transparent opacity={0.04} />
      </mesh>
      <mesh>
        <shapeGeometry args={[geckoHead]} />
        <meshBasicMaterial color="#93C63B" transparent opacity={0.04} />
      </mesh>
      {[
        { pos: [-2.2, 1.5, 0] as [number, number, number], rot: 0.5 },
        { pos: [2.2, 1.5, 0] as [number, number, number], rot: -0.5 },
        { pos: [-2.0, -1.5, 0] as [number, number, number], rot: 0.8 },
        { pos: [2.0, -1.5, 0] as [number, number, number], rot: -0.8 },
      ].map((leg, i) => (
        <mesh key={i} position={leg.pos} rotation={[0, 0, leg.rot]}>
          <planeGeometry args={[2.5, 0.4]} />
          <meshBasicMaterial color="#93C63B" transparent opacity={0.03} />
        </mesh>
      ))}
      <mesh position={[0, -5.5, 0]} rotation={[0, 0, 0.1]}>
        <planeGeometry args={[0.5, 3]} />
        <meshBasicMaterial color="#93C63B" transparent opacity={0.03} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#f9fafb']} />
      <ambientLight intensity={1} />
      <Particles count={150} />
      <FloatingSpheres count={30} />
      <GeckoWatermark />
    </>
  )
}

function HeroSceneInner() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: '#f9fafb' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default HeroSceneInner
