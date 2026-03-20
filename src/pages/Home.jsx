import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { Brain } from "../components/Brain";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <>
      <div className="fab-container">
        <div className="fab-label">
          <span className="fab-label-text">How to use</span>
          <span className="fab-arrow">→</span>
        </div>
        <Link to="/About" title="About this Project" className="fab-button">
          ?
        </Link>
      </div>

      <div className="grain-overlay" />

      <Header />

      <div className="atlas-container">
        <Sidebar />

        <main className="viewer-pane">
          <Canvas shadows camera={{ position: [0, 0, 50], fov: 40 }}>
            <ambientLight intensity={0.5} />

            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />

            <Environment preset="city" />

            <Center>
              <Brain />
            </Center>

            <ContactShadows
              resolution={1024}
              scale={50}
              blur={2.5}
              opacity={0.6}
              far={10}
            />

            <OrbitControls
              makeDefault
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.5}
            />
          </Canvas>
        </main>
      </div>
    </>
  );
}

export default Home;
