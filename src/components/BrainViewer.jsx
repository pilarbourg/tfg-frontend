import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { BrainModel } from './BrainModel'

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  )
}

export function BrainViewer({ activeRegions = [], regionColours = {}, onRegionClick }) {
  const [hoveredRegion, setHoveredRegion] = useState(null)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative'}}>

      {hoveredRegion && (
        <div style={{
          position: 'absolute',
          bottom: 15,
          left: 15,
          background: '#334155',
          color: 'white',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 13,
          pointerEvents: 'none',
          zIndex: 15000,
          fontFamily: 'monospace',
        }}>
          {hoveredRegion.replace(/_/g, ' ')}
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 350], fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: true }}
      >

        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 100, 100]} intensity={0.8} />
        <directionalLight position={[-100, -50, -100]} intensity={0.3} color="#6688cc" />

        <Suspense fallback={<LoadingFallback />}>
          <BrainModel
            activeRegions={activeRegions}
            regionColours={regionColours}
            onRegionClick={onRegionClick}
            onRegionHover={setHoveredRegion}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={50}
          maxDistance={500}

        />
      </Canvas>
    </div>
  )
}

export default BrainViewer