import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ActiveOverlay, LandmarkId } from '../../types';
import { LANDMARK_POSITIONS } from '../../data/portfolioData';

interface LandmarkMarkersProps {
  characterPosRef: React.MutableRefObject<THREE.Vector3>;
  activeOverlay: ActiveOverlay;
  onSelectLandmark: (landmark: LandmarkId) => void;
}

interface SingleMarkerProps {
  id: LandmarkId;
  label: string;
  tagColor: string;
  pinColor: string;
  markerPos: [number, number, number];
  buildingPos: [number, number, number];
  ringPos: [number, number, number];
  bobOffset: number;
  characterPosRef: React.MutableRefObject<THREE.Vector3>;
  isOverlayOpen: boolean;
  onClick: () => void;
}

function SingleDistanceMarker({
  label,
  tagColor,
  pinColor,
  markerPos,
  buildingPos,
  ringPos,
  bobOffset,
  characterPosRef,
  isOverlayOpen,
  onClick,
}: SingleMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pinRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const distSpanRef = useRef<HTMLSpanElement>(null);
  const hintSpanRef = useRef<HTMLSpanElement>(null);
  const lastDistRef = useRef<string>('');
  const lastNearRef = useRef<boolean>(false);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y =
        markerPos[1] + Math.sin(elapsed * 2.4 + bobOffset) * 0.22;
    }
    if (pinRef.current) {
      pinRef.current.rotation.y += delta * 1.4;
    }

    const dx = characterPosRef.current.x - buildingPos[0];
    const dz = characterPosRef.current.z - buildingPos[2];
    const dist = Math.max(0, Math.hypot(dx, dz) - 2.6);
    const formatted = dist < 1.3 ? 'Arrived' : `${dist.toFixed(1)}m`;
    const isNear = dist < 4.5;

    if (distSpanRef.current && lastDistRef.current !== formatted) {
      lastDistRef.current = formatted;
      distSpanRef.current.textContent = formatted;
    }

    if (hintSpanRef.current && lastNearRef.current !== isNear) {
      lastNearRef.current = isNear;
      hintSpanRef.current.style.display = isNear ? 'inline-flex' : 'none';
    }

    if (ringRef.current) {
      const pulse = 1 + Math.sin(elapsed * 3.2 + bobOffset) * 0.08;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group>
      {/* Subtle interactive ground ring in front of the landmark */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ringPos[0], 0.03, ringPos[2]]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <ringGeometry args={[0.95, 1.25, 28]} />
        <meshBasicMaterial color={pinColor} transparent opacity={0.48} />
      </mesh>

      {/* Floating 3D Marker Group */}
      <group ref={groupRef} position={markerPos}>
        {/* Tactile Parchment Distance Pill matching Screen 1 (Responsive for Phone/iPad/Desktop) */}
        {!isOverlayOpen && (
          <Html
            center
            distanceFactor={34}
            zIndexRange={[18, 0]}
            style={{ pointerEvents: 'auto' }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="group relative flex flex-col items-center px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-[#f7eedf] hover:bg-[#fff8ec] border-2 border-[#dfcbb4] hover:border-[#d3543a] craft-shadow transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer select-none min-w-[114px] sm:min-w-[146px] whitespace-nowrap touch-manipulation"
            >
              <span
                className="font-headline font-extrabold text-[10px] sm:text-[11px] tracking-[0.09em] uppercase leading-tight"
                style={{ color: tagColor }}
              >
                {label}
              </span>
              <span
                ref={distSpanRef}
                className="font-headline font-extrabold text-base sm:text-lg text-[#2c221e] leading-tight tabular-nums mt-0.5"
              >
                10.0m
              </span>
              <span
                ref={hintSpanRef}
                style={{ display: 'none' }}
                className="mt-1 px-2 py-0.5 rounded bg-[#d3543a] text-[#fff9ee] font-mono font-bold text-[9px] tracking-wider uppercase"
              >
                Click or [E] Open
              </span>
              {/* Downward pointer notch */}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#f7eedf] group-hover:bg-[#fff8ec] border-r-2 border-b-2 border-[#dfcbb4] group-hover:border-[#d3543a]" />
            </button>
          </Html>
        )}

        {/* Low-Poly Rotating Diamond Anchor Pin */}
        <mesh
          ref={pinRef}
          position={[0, -1.45, 0]}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <octahedronGeometry args={[0.34, 0]} />
          <meshLambertMaterial color={pinColor} />
        </mesh>
      </group>
    </group>
  );
}

export function LandmarkMarkers({
  characterPosRef,
  activeOverlay,
  onSelectLandmark,
}: LandmarkMarkersProps) {
  const hideMarkers = activeOverlay !== 'none';

  return (
    <group>
      <SingleDistanceMarker
        id="about"
        label="About Me"
        tagColor="#2b4c3f"
        pinColor="#d3543a"
        markerPos={LANDMARK_POSITIONS.about.marker}
        buildingPos={LANDMARK_POSITIONS.about.building}
        ringPos={LANDMARK_POSITIONS.about.walkTarget}
        bobOffset={3.2}
        characterPosRef={characterPosRef}
        isOverlayOpen={hideMarkers}
        onClick={() => onSelectLandmark('about')}
      />
      <SingleDistanceMarker
        id="experience"
        label="Job Experience"
        tagColor="#a6341d"
        pinColor="#d3543a"
        markerPos={LANDMARK_POSITIONS.experience.marker}
        buildingPos={LANDMARK_POSITIONS.experience.building}
        ringPos={LANDMARK_POSITIONS.experience.walkTarget}
        bobOffset={0.8}
        characterPosRef={characterPosRef}
        isOverlayOpen={hideMarkers}
        onClick={() => onSelectLandmark('experience')}
      />
      <SingleDistanceMarker
        id="work"
        label="My Work"
        tagColor="#2d587b"
        pinColor="#d3543a"
        markerPos={LANDMARK_POSITIONS.work.marker}
        buildingPos={LANDMARK_POSITIONS.work.building}
        ringPos={LANDMARK_POSITIONS.work.walkTarget}
        bobOffset={0}
        characterPosRef={characterPosRef}
        isOverlayOpen={hideMarkers}
        onClick={() => onSelectLandmark('work')}
      />
      <SingleDistanceMarker
        id="contact"
        label="Contact"
        tagColor="#c45e22"
        pinColor="#d3543a"
        markerPos={LANDMARK_POSITIONS.contact.marker}
        buildingPos={LANDMARK_POSITIONS.contact.building}
        ringPos={LANDMARK_POSITIONS.contact.walkTarget}
        bobOffset={1.6}
        characterPosRef={characterPosRef}
        isOverlayOpen={hideMarkers}
        onClick={() => onSelectLandmark('contact')}
      />
    </group>
  );
}
