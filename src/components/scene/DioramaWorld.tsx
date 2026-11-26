import { useMemo, useRef } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { CuboidCollider, CylinderCollider, Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ActiveOverlay, LandmarkId } from '../../types';
import { LANDMARK_POSITIONS } from '../../data/portfolioData';
import { ExplorerCharacter } from './ExplorerCharacter';
import { LandmarkMarkers } from './LandmarkMarkers';

interface DioramaWorldProps {
  walkTarget: [number, number, number] | null;
  onSetWalkTarget: (point: [number, number, number]) => void;
  onClearWalkTarget: () => void;
  characterPosRef: React.MutableRefObject<THREE.Vector3>;
  activeOverlay: ActiveOverlay;
  isExploring: boolean;
  hasManualWalk: boolean;
  onSelectLandmark: (landmark: LandmarkId) => void;
  cameraResetSignal: number;
}

const ISLAND_RADIUS = 22.0;

const TREE_COORDS: [number, number, number, boolean][] = [
  [-17.5, -4.5, 1.35, false],
  [-16.0, 3.0, 1.2, false],
  [-14.5, 7.5, 1.1, false],
  [-18.0, 0.5, 1.4, false],
  [-15.0, -9.0, 1.25, false],
  [-12.5, -13.5, 1.3, false],
  [-8.5, -15.0, 1.15, false],
  [17.5, -4.0, 1.35, false],
  [16.5, 3.5, 1.25, false],
  [15.0, 8.0, 1.15, false],
  [18.2, 1.0, 1.4, false],
  [15.5, -9.5, 1.2, false],
  [12.8, -13.0, 1.3, false],
  [8.0, -15.5, 1.1, false],
  [-4.0, -16.5, 1.4, false],
  [0.0, -17.5, 1.5, false],
  [4.5, -16.5, 1.35, false],
  [-6.5, -12.0, 1.1, true],
  [6.5, -11.5, 1.05, true],
  [-11.0, 12.0, 1.2, false],
  [-7.5, 15.0, 1.15, false],
  [-3.5, 16.5, 1.05, false],
  [8.0, 14.5, 1.15, false],
  [12.0, 11.5, 1.2, false],
  [-7.0, -4.5, 0.95, true],
  [7.0, -4.5, 0.95, true],
  [-5.5, 6.2, 0.9, true],
];

const CLOUD_CONFIGS = [
  { x: -26, y: 15, z: -15, s: 1.25, speed: 0.42 },
  { x: 24, y: 17, z: -18, s: 1.4, speed: 0.52 },
  { x: 28, y: 13, z: 12, s: 1.1, speed: 0.36 },
  { x: -24, y: 18, z: 16, s: 1.35, speed: 0.46 },
  { x: 0, y: 20, z: -28, s: 1.5, speed: 0.32 },
  { x: -16, y: 14, z: 26, s: 1.15, speed: 0.44 },
  { x: 19, y: 18.5, z: 24, s: 1.2, speed: 0.38 },
];

function ConiferTree({
  x,
  z,
  scale,
  withCollider,
}: {
  x: number;
  z: number;
  scale: number;
  withCollider: boolean;
}) {
  const foliageColors = ['#285632', '#33683e', '#3d7b4a', '#4e8d5b'];
  const treeContent = (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.1 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.24 * scale, 0.36 * scale, 2.2 * scale, 8]} />
        <meshLambertMaterial color="#543621" />
      </mesh>
      {foliageColors.map((color, idx) => (
        <mesh
          key={color}
          position={[0, (1.8 + idx * 1.12) * scale, 0]}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[(2.15 - idx * 0.37) * scale, (1.9 - idx * 0.2) * scale, 7]} />
          <meshLambertMaterial color={color} />
        </mesh>
      ))}
    </group>
  );

  if (!withCollider) return treeContent;

  return (
    <RigidBody type="fixed" colliders={false}>
      <CylinderCollider args={[1.2 * scale, 0.42 * scale]} position={[x, 1.2 * scale, z]} />
      {treeContent}
    </RigidBody>
  );
}

function DriftingClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  const puffOffsets = useMemo(
    () =>
      CLOUD_CONFIGS.map((cfg, cIdx) => {
        const puffs: { pos: [number, number, number]; r: number }[] = [];
        const count = 6;
        for (let p = 0; p < count; p++) {
          const seed = (cIdx + 1) * 13 + p * 7;
          const r = (1.35 + ((seed % 5) / 5) * 0.75) * cfg.s;
          puffs.push({
            pos: [
              (p - count / 2) * 1.45 * cfg.s,
              Math.sin(p * 1.3) * 0.42 * cfg.s,
              (((seed % 7) / 7) - 0.5) * 1.1 * cfg.s,
            ],
            r,
          });
        }
        return puffs;
      }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;
    if (!cloudsRef.current) return;

    cloudsRef.current.children.forEach((cloud, idx) => {
      const cfg = CLOUD_CONFIGS[idx];
      cloud.position.x += cfg.speed * dt;
      cloud.position.y = cfg.y + Math.sin(elapsed * 1.1 + idx) * 0.45;
      if (cloud.position.x > 38) cloud.position.x = -38;
    });
  });

  return (
    <group ref={cloudsRef}>
      {CLOUD_CONFIGS.map((cfg, idx) => (
        <group key={idx} position={[cfg.x, cfg.y, cfg.z]}>
          {puffOffsets[idx].map((puff, pIdx) => (
            <mesh key={pIdx} position={puff.pos}>
              <dodecahedronGeometry args={[puff.r, 1]} />
              <meshLambertMaterial color="#ffffff" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function ClickTargetBeacon({ target }: { target: [number, number, number] | null }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current || !target) return;
    const s = 0.85 + Math.sin(state.clock.elapsedTime * 6) * 0.16;
    ringRef.current.scale.set(s, s, 1);
  });

  if (!target) return null;

  return (
    <group position={[target[0], 0.04, target[2]]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.58, 24]} />
        <meshBasicMaterial color="#fceecf" transparent opacity={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color="#d3543a" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export function DioramaWorld({
  walkTarget,
  onSetWalkTarget,
  onClearWalkTarget,
  characterPosRef,
  activeOverlay,
  isExploring,
  hasManualWalk,
  onSelectLandmark,
  cameraResetSignal,
}: DioramaWorldProps) {
  const pointerDownScreen = useRef<{ x: number; y: number } | null>(null);
  const wheelRef = useRef<THREE.Mesh>(null);

  // Precompute cobblestone paths & rim rocks once
  const cobblestones = useMemo(() => {
    const segments: [THREE.Vector3, THREE.Vector3, THREE.Vector3, number][] = [
      [new THREE.Vector3(0, 0.02, 6.2), new THREE.Vector3(0, 0.02, 1.5), new THREE.Vector3(0, 0.02, -2.0), 12],
      [new THREE.Vector3(0, 0.02, 1.5), new THREE.Vector3(5.5, 0.02, 0.4), new THREE.Vector3(10.2, 0.02, -1.5), 14],
      [new THREE.Vector3(0, 0.02, 1.5), new THREE.Vector3(-5.5, 0.02, 0.4), new THREE.Vector3(-10.2, 0.02, -1.5), 14],
      [new THREE.Vector3(0, 0.02, 6.0), new THREE.Vector3(1.6, 0.02, 9.2), new THREE.Vector3(3.0, 0.02, 11.4), 12],
    ];

    const stones: {
      pos: [number, number, number];
      size: [number, number, number];
      rotY: number;
      color: string;
    }[] = [];

    segments.forEach(([p0, p1, p2, count]) => {
      const curve = new THREE.CatmullRomCurve3([p0, p1, p2]);
      curve.getPoints(count).forEach((pt, idx) => {
        stones.push({
          pos: [pt.x, 0.04, pt.z],
          size: [1.0 + Math.sin(idx * 0.8) * 0.24, 0.08, 0.85 + Math.cos(idx * 0.5) * 0.2],
          rotY: idx * 0.16,
          color: idx % 2 === 0 ? '#ede2d2' : '#e2d6c3',
        });
      });
    });

    return stones;
  }, []);

  const rimRocks = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const rad = ISLAND_RADIUS - 1.1 + ((i % 3) * 0.25);
      return {
        pos: [
          Math.cos(angle) * rad,
          -2.7 - ((i * 7) % 10) * 0.14,
          Math.sin(angle) * rad,
        ] as [number, number, number],
        rot: [(i * 0.7) % Math.PI, (i * 1.1) % Math.PI, 0] as [number, number, number],
        radius: 1.25 + ((i * 5) % 7) * 0.1,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z -= Math.min(delta, 0.05) * 0.9;
    }
  });

  const isCompactDevice =
    typeof window !== 'undefined' &&
    (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches);
  const shadowMapRes = isCompactDevice ? 1024 : 2048;

  const handleGroundPointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownScreen.current = { x: e.clientX, y: e.clientY };
  };

  const handleGroundPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!pointerDownScreen.current) return;
    const moved = Math.hypot(
      e.clientX - pointerDownScreen.current.x,
      e.clientY - pointerDownScreen.current.y
    );
    pointerDownScreen.current = null;
    const maxTapSlop = e.pointerType === 'touch' ? 18 : 8;
    if (moved > maxTapSlop) return;

    e.stopPropagation();
    const pt = e.point;
    const dist = Math.hypot(pt.x, pt.z);
    if (dist < ISLAND_RADIUS - 1.6) {
      onSetWalkTarget([pt.x, 0, pt.z]);
    }
  };

  return (
    <>
      <color attach="background" args={['#dceef5']} />
      <fogExp2 attach="fog" args={['#dceef5', 0.0052]} />

      {/* Sunlit Miniature Diorama Lighting */}
      <ambientLight color="#fff6ec" intensity={0.95} />
      <directionalLight
        color="#fffaee"
        intensity={1.35}
        position={[24, 42, 22]}
        castShadow
        shadow-mapSize={[shadowMapRes, shadowMapRes]}
        shadow-camera-near={0.5}
        shadow-camera-far={110}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
        shadow-bias={-0.0004}
      />
      <directionalLight color="#b5daf5" intensity={0.45} position={[-20, 18, -20]} />

      <DriftingClouds />

      <Physics gravity={[0, -22, 0]}>
        {/* 1. Walkable Floating Island Terrarium Base */}
        <RigidBody type="fixed" colliders={false} friction={0}>
          <CylinderCollider args={[2.1, ISLAND_RADIUS]} position={[0, -2.1, 0]} />

          {/* Walkable Grass Top Disc (Click-to-Move Receiver) */}
          <mesh
            position={[0, -0.15, 0]}
            receiveShadow
            onPointerDown={handleGroundPointerDown}
            onPointerUp={handleGroundPointerUp}
          >
            <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS - 0.3, 0.3, 64]} />
            <meshLambertMaterial color="#82b956" />
          </mesh>

          {/* Tapered Earthy Cliff Underside */}
          <mesh position={[0, -2.25, 0]} receiveShadow>
            <cylinderGeometry args={[ISLAND_RADIUS - 0.3, ISLAND_RADIUS - 3.2, 3.9, 48]} />
            <meshLambertMaterial color="#7c5438" />
          </mesh>

          {/* Underside Crag Rim Rocks */}
          {rimRocks.map((rock, idx) => (
            <mesh key={idx} position={rock.pos} rotation={rock.rot}>
              <dodecahedronGeometry args={[rock.radius, 0]} />
              <meshLambertMaterial color="#6e492e" />
            </mesh>
          ))}

          {/* Serene Scenic Pond (West-South Lawn) */}
          <group position={[-6.2, 0.02, 5.2]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[2.6, 28]} />
              <meshLambertMaterial color="#d9c6a5" />
            </mesh>
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.25, 28]} />
              <meshLambertMaterial color="#5ab2c6" />
            </mesh>
          </group>

          {/* Interconnected Cobblestone Stepping Pathways */}
          {cobblestones.map((stone, idx) => (
            <mesh
              key={idx}
              position={stone.pos}
              rotation={[0, stone.rotY, 0]}
              receiveShadow
              onPointerDown={handleGroundPointerDown}
              onPointerUp={handleGroundPointerUp}
            >
              <boxGeometry args={stone.size} />
              <meshLambertMaterial color={stone.color} />
            </mesh>
          ))}
        </RigidBody>

        {/* 2. Central Atelier Hub Pavilion — "Job Experience" */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.3, 2.0, 2.0]} position={[0, 2.0, -4.0]} />
          <group
            position={LANDMARK_POSITIONS.experience.building}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmark('experience');
            }}
          >
            <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[4.4, 3.2, 3.8]} />
              <meshLambertMaterial color="#c8533d" />
            </mesh>
            <mesh position={[0, 4.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[3.7, 2.2, 4]} />
              <meshLambertMaterial color="#38271e" />
            </mesh>
            <mesh position={[0, 2.2, 2.25]} castShadow>
              <boxGeometry args={[2.4, 0.16, 1.1]} />
              <meshLambertMaterial color="#f1dfc8" />
            </mesh>
            <mesh position={[0, 0.9, 1.92]}>
              <boxGeometry args={[1.0, 1.8, 0.1]} />
              <meshLambertMaterial color="#221712" />
            </mesh>
            <mesh position={[-1.25, 1.55, 1.92]}>
              <boxGeometry args={[0.75, 0.75, 0.08]} />
              <meshBasicMaterial color="#ffefb8" />
            </mesh>
            <mesh position={[1.25, 1.55, 1.92]}>
              <boxGeometry args={[0.75, 0.75, 0.08]} />
              <meshBasicMaterial color="#ffefb8" />
            </mesh>
            <mesh position={[1.3, 4.4, -0.6]} castShadow>
              <boxGeometry args={[0.6, 1.6, 0.6]} />
              <meshLambertMaterial color="#6e6561" />
            </mesh>
          </group>
        </RigidBody>

        {/* 3. Landmark A — "About Me" Pine-Sage Archive Library (West) */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.9, 1.8, 1.8]} position={[-11.5, 1.8, -2.5]} rotation={[0, 0.35, 0]} />
          <group
            position={LANDMARK_POSITIONS.about.building}
            rotation={[0, 0.35, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmark('about');
            }}
          >
            <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.6, 2.8, 3.4]} />
              <meshLambertMaterial color="#486b51" />
            </mesh>
            <mesh position={[0, 3.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[3.2, 1.8, 4]} />
              <meshLambertMaterial color="#273b2c" />
            </mesh>
            <mesh position={[0, 2.65, 1.78]} castShadow>
              <boxGeometry args={[1.8, 0.55, 0.14]} />
              <meshLambertMaterial color="#f6ebd9" />
            </mesh>
            <mesh position={[0.9, 1.3, 1.72]}>
              <boxGeometry args={[1.0, 1.0, 0.1]} />
              <meshBasicMaterial color="#ffea9f" />
            </mesh>
            <mesh position={[-0.7, 0.75, 1.72]}>
              <boxGeometry args={[0.8, 1.5, 0.1]} />
              <meshLambertMaterial color="#221712" />
            </mesh>
          </group>
        </RigidBody>

        {/* 4. Landmark B — "My Work" Slate-Indigo Gallery Workshop (East) */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[2.1, 1.9, 1.85]} position={[11.5, 1.9, -2.5]} rotation={[0, -0.35, 0]} />
          <group
            position={LANDMARK_POSITIONS.work.building}
            rotation={[0, -0.35, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmark('work');
            }}
          >
            <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[4.0, 2.9, 3.5]} />
              <meshLambertMaterial color="#3d668c" />
            </mesh>
            <mesh position={[0, 3.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[3.4, 2.0, 4]} />
              <meshLambertMaterial color="#1f3448" />
            </mesh>
            <mesh position={[-0.8, 1.35, 1.78]}>
              <boxGeometry args={[1.6, 1.2, 0.1]} />
              <meshBasicMaterial color="#ffefb8" />
            </mesh>
            <mesh position={[0.9, 0.85, 1.78]}>
              <boxGeometry args={[1.1, 1.7, 0.1]} />
              <meshLambertMaterial color="#181f26" />
            </mesh>
            <mesh position={[0, 2.8, 1.82]} castShadow>
              <boxGeometry args={[1.9, 0.58, 0.15]} />
              <meshLambertMaterial color="#f5edd6" />
            </mesh>
            {/* Rotating Atelier Mill Wheel Accent */}
            <mesh ref={wheelRef} position={[2.12, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.75, 0.12, 8, 12]} />
              <meshLambertMaterial color="#6d482c" />
            </mesh>
          </group>
        </RigidBody>

        {/* 5. Landmark C — "Contact" Amber-Terracotta Telegraph Outpost (South-East) */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[1.7, 1.8, 1.6]} position={[3.5, 1.8, 12.8]} rotation={[0, -Math.PI * 0.85, 0]} />
          <group
            position={LANDMARK_POSITIONS.contact.building}
            rotation={[0, -Math.PI * 0.85, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLandmark('contact');
            }}
          >
            <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 2.6, 3.0]} />
              <meshLambertMaterial color="#d97736" />
            </mesh>
            <mesh position={[0, 3.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[2.8, 2.2, 4]} />
              <meshLambertMaterial color="#3d2719" />
            </mesh>
            {/* Telegraph Spire & Crossbars */}
            <mesh position={[0, 5.1, 0]}>
              <cylinderGeometry args={[0.06, 0.1, 2.2, 6]} />
              <meshLambertMaterial color="#8a7b73" />
            </mesh>
            <mesh position={[0, 5.6, 0]}>
              <boxGeometry args={[0.9, 0.07, 0.07]} />
              <meshLambertMaterial color="#543621" />
            </mesh>
            <mesh position={[0, 6.25, 0]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshBasicMaterial color="#ff6b4a" />
            </mesh>
            <mesh position={[0, 0.75, 1.52]}>
              <boxGeometry args={[0.85, 1.5, 0.1]} />
              <meshLambertMaterial color="#221712" />
            </mesh>
            <mesh position={[0.85, 1.4, 1.52]}>
              <boxGeometry args={[0.68, 0.68, 0.08]} />
              <meshBasicMaterial color="#ffea9f" />
            </mesh>
          </group>
        </RigidBody>

        {/* 6. Conifer Pine Forest */}
        {TREE_COORDS.map(([x, z, scale, withCollider], idx) => (
          <ConiferTree
            key={idx}
            x={x}
            z={z}
            scale={scale}
            withCollider={withCollider}
          />
        ))}

        {/* 7. Playable Character with Rapier Capsule Physics + Damped Camera */}
        <ExplorerCharacter
          walkTarget={walkTarget}
          onReachTarget={onClearWalkTarget}
          characterPosRef={characterPosRef}
          activeOverlay={activeOverlay}
          isExploring={isExploring}
          hasManualWalk={hasManualWalk}
          cameraResetSignal={cameraResetSignal}
        />
      </Physics>

      {/* Click-to-Move Ground Indicator */}
      <ClickTargetBeacon target={walkTarget} />

      {/* Interactive 3D Floating Distance Markers for Work & Contact */}
      <LandmarkMarkers
        characterPosRef={characterPosRef}
        activeOverlay={activeOverlay}
        onSelectLandmark={onSelectLandmark}
      />
    </>
  );
}
