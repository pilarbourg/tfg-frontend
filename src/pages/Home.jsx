import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { Brain } from "../components/Brain";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function LoadingBrain() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={styles.loadingOverlay}>
      <div style={styles.loadingText}>Loading atlas{".".repeat(dots)}</div>
    </div>
  );
}

function Home() {
  const [loaded, setLoaded] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e) => window.scrollBy({ top: e.deltaY });
    el.addEventListener("wheel", handler, { passive: true });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroVisible(false), 3000);
    return () => clearTimeout(t1);
  }, []);

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
        <main
          className="viewer-pane"
          style={{ position: "relative" }}
          ref={canvasRef}
        >
          {!loaded && <LoadingBrain />}

          <Canvas
            shadows
            camera={{ position: [0, 0, 50], fov: 40 }}
            onCreated={() => setTimeout(() => setLoaded(true), 800)}
          >
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
              enableZoom={false}
            />
          </Canvas>

          <div style={styles.dragHint}>
            <span style={styles.dragHintIcon}>↻</span>
            <span>drag to rotate</span>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "#f2aeb1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    pointerEvents: "none",
  },
  loadingText: {
    fontSize: "0.7rem",
    color: "#3d5a5e",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    width: "220px",
  },
  introOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#13151de9",
    padding: "2rem 2.25rem",
    borderRadius: "20px",
    textAlign: "center",
    zIndex: 40,
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  introEyebrow: {
    fontSize: "0.6rem",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#4b595d",
    fontWeight: 600,
  },
  introTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#c8d0d4",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
    textShadow: "0 0 40px rgba(19,21,29,0.8)",
  },
  introSub: {
    fontSize: "0.78rem",
    color: "#7e7b7b",
    letterSpacing: "0.03em",
  },
  navCardsContainer: {
    position: "absolute",
    bottom: "2rem",
    left: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    zIndex: 30,
  },
  navCard: {
    display: "grid",
    gridTemplateColumns: "20px 1fr 16px",
    background: "#13151de9",
    gridTemplateRows: "auto auto",
    columnGap: "10px",
    rowGap: "2px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid",
    backdropFilter: "blur(12px)",
    textDecoration: "none",
    minWidth: "220px",
  },
  navCardIcon: {
    fontSize: "14px",
    gridRow: "1 / 3",
    gridColumn: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "2px",
  },
  navCardLabel: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#c8d0d4",
    letterSpacing: "0.03em",
    gridRow: "1",
    gridColumn: "2",
  },
  navCardDesc: {
    fontSize: "0.65rem",
    color: "#4b595d",
    gridRow: "2",
    gridColumn: "2",
  },
  navCardArrow: {
    fontSize: "0.85rem",
    gridRow: "1 / 3",
    gridColumn: "3",
    display: "flex",
    alignItems: "center",
    transition: "opacity 0.2s",
  },
  statsBar: {
    position: "absolute",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "0",
    background: "#13151de9",
    backdropFilter: "blur(12px)",
    border: "1px solid #22252f",
    borderRadius: "10px",
    padding: "10px 20px",
    zIndex: 30,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 16px",
    position: "relative",
  },
  statValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#c8d0d4",
    letterSpacing: "-0.01em",
  },
  statLabel: {
    fontSize: "0.58rem",
    color: "#4b595d",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    whiteSpace: "nowrap",
  },
  statDivider: {
    position: "absolute",
    right: 0,
    top: "15%",
    height: "70%",
    width: "1px",
    background: "#13151de9",
  },

  dragHint: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    fontSize: "0.6rem",
    color: "#3d5a5e",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    zIndex: 30,
    pointerEvents: "none",
  },
  dragHintIcon: {
    fontSize: "0.85rem",
  },
};

export default Home;
