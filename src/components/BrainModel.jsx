/*
  BrainModel.jsx
  Interactive brain atlas with per-region heatmap highlighting.
  Props:
    activeRegions  : string[]  — list of region names to highlight (from RAG)
    onRegionClick  : (name: string) => void  — called when a region is clicked
    onRegionHover  : (name: string | null) => void  — called on hover
*/

import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";

const COLOUR_DEFAULT = "#b5a99a";
const COLOUR_ACTIVE = "#ff4444";
const COLOUR_HOVER = "#ffaa00";
const OPACITY_DEFAULT = 0.55;
const OPACITY_ACTIVE = 1.0;
const EMISSIVE_ACTIVE = "#cc0000";
const EMISSIVE_HOVER = "#886600";

function BrainRegion({
  name,
  geometry,
  activeRegions,
  regionColours,
  onRegionClick,
  onRegionHover,
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const isActive = activeRegions.includes(name)
  const activeColour = regionColours[name] || COLOUR_ACTIVE

  const colour = isActive
    ? COLOUR_ACTIVE
    : hovered
    ? COLOUR_HOVER
    : COLOUR_DEFAULT;

  const opacity = isActive ? OPACITY_ACTIVE : OPACITY_DEFAULT;

  const emissive = isActive
    ? activeColour
    : hovered
    ? EMISSIVE_HOVER
    : "#000000";

  const emissiveIntensity = isActive ? 0.4 : hovered ? 0.3 : 0;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, Math.PI / 2, Math.PI / 2]}
      onClick={(e) => {
        e.stopPropagation();
        onRegionClick?.(name);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onRegionHover?.(name);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onRegionHover?.(null);
        document.body.style.cursor = "default";
      }}
    >
      <meshStandardMaterial
        attach="material"
        color={colour}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={opacity}
        roughness={0.7}
        metalness={0.05}
        depthWrite={!isActive}
        vertexColors={false}
        map={null}
        envMap={null}
      />
    </mesh>
  );
}

export function BrainModel({
  activeRegions = [],
  regionColours = {},
  onRegionClick,
  onRegionHover,
  ...props
}) {
  const { nodes } = useGLTF("/full_brain.glb");

  return (
    <group {...props} dispose={null}>
      {Object.entries(nodes).map(([name, node]) => {
        if (!node.isMesh) return null;

        if (node.geometry.attributes.color) {
          node.geometry.deleteAttribute("color");
        }

        return (
          <BrainRegion
            key={name}
            name={name}
            geometry={node.geometry}
            activeRegions={activeRegions}
            regionColours={regionColours}
            onRegionClick={onRegionClick}
            onRegionHover={onRegionHover}
            vertexColors={false}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload("/full_brain.glb");
