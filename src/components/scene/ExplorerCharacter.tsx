import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ActiveOverlay } from '../../types';
import { LANDMARK_POSITIONS } from '../../data/portfolioData';

interface ExplorerCharacterProps {
  walkTarget: [number, number, number] | null;
  onReachTarget: () => void;
  onStartManualExplore: () => void;
  characterPosRef: React.MutableRefObject<THREE.Vector3>;
  activeOverlay: ActiveOverlay;
  isExploring: boolean;
  hasManualWalk: boolean;
  cameraResetSignal: number;
}

export type VirtualKeyName = 'w' | 'a' | 's' | 'd' | 'space';

const ISLAND_SAFE_RADIUS = 20.2;
const MOVE_SPEED = 7.0;
const JUMP_VELOCITY = 6.8;

const idealLookAt = new THREE.Vector3();
const currentLookAt = new THREE.Vector3(0, 1.2, 0);
const moveVec = new THREE.Vector2();

function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

interface CameraProfile {
  fov: number;
  exploreRadius: number;
  exploreHeight: number;
  homeRadius: number;
  homeHeight: number;
  modalScale: number;
  followPanFactor: number;
}

/**
 * Computes aspect-ratio & viewport-aware 3D camera distances so Phone (portrait/landscape),
 * iPad/Tablet (portrait/landscape), and Desktop all frame the floating island comfortably.
 */
function getResponsiveCameraProfile(width: number, height: number): CameraProfile {
  const safeH = Math.max(1, height);
  const aspect = width / safeH;

  // 1. Phone Portrait (e.g. iPhone 375x812, 390x844, 430x932)
  if (width < 640 && aspect < 0.85) {
    const ultraTallBoost = aspect < 0.5 ? 1.08 : 1.0;
    return {
      fov: 50,
      exploreRadius: 45.5 * ultraTallBoost,
      exploreHeight: 33.5 * ultraTallBoost,
      homeRadius: 58.0 * ultraTallBoost,
      homeHeight: 36.5 * ultraTallBoost,
      modalScale: 1.55,
      followPanFactor: 0.32,
    };
  }

  // 2. iPad / Tablet Portrait (e.g. iPad Mini/Air/Pro 744x1133, 768x1024, 820x1180, 1024x1366)
  if (aspect < 1.0) {
    const narrowTabletBoost = aspect < 0.72 ? 1.06 : 1.0;
    return {
      fov: 46,
      exploreRadius: 39.5 * narrowTabletBoost,
      exploreHeight: 29.0 * narrowTabletBoost,
      homeRadius: 51.5 * narrowTabletBoost,
      homeHeight: 32.5 * narrowTabletBoost,
      modalScale: 1.35,
      followPanFactor: 0.36,
    };
  }

  // 3. Phone Landscape (compact height, e.g. 844x390)
  if (height < 520) {
    return {
      fov: 44,
      exploreRadius: 34.5,
      exploreHeight: 25.0,
      homeRadius: 46.0,
      homeHeight: 29.0,
      modalScale: 1.18,
      followPanFactor: 0.38,
    };
  }

  // 4. iPad / Tablet Landscape (e.g. 1024x768, 1180x820, 1194x834)
  if (width < 1220 || aspect < 1.42) {
    return {
      fov: 43,
      exploreRadius: 34.5,
      exploreHeight: 25.2,
      homeRadius: 46.5,
      homeHeight: 29.2,
      modalScale: 1.18,
      followPanFactor: 0.4,
    };
  }

  // 5. Desktop Widescreen
  return {
    fov: 40,
    exploreRadius: 27.5,
    exploreHeight: 20.5,
    homeRadius: 41.5,
    homeHeight: 26.0,
    modalScale: 1.0,
    followPanFactor: 0.46,
  };
}

export function ExplorerCharacter({
  walkTarget,
  onReachTarget,
  onStartManualExplore,
  characterPosRef,
  activeOverlay,
  isExploring,
  hasManualWalk,
  cameraResetSignal,
}: ExplorerCharacterProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const charBodyRef = useRef<THREE.Mesh>(null);
  const charHeadRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });
  const walkCycleRef = useRef(0);
  const facingAngleRef = useRef(0);
  const manualRoamRef = useRef(false);
  const stuckTimerRef = useRef(0);
  const orbitAngleRef = useRef(0);

  const initialProfile =
    typeof window !== 'undefined'
      ? getResponsiveCameraProfile(window.innerWidth, window.innerHeight)
      : getResponsiveCameraProfile(1280, 800);

  const camRadiusRef = useRef(initialProfile.homeRadius);
  const camHeightRef = useRef(initialProfile.homeHeight);
  const camPivotXRef = useRef(0);
  const camPivotZRef = useRef(0);

  // Return to showcase orbit when exiting Explore Mode ("Back Home")
  useEffect(() => {
    if (!isExploring) {
      manualRoamRef.current = false;
    }
  }, [isExploring]);

  // Recenter character & camera when requested
  useEffect(() => {
    if (cameraResetSignal > 0 && bodyRef.current) {
      bodyRef.current.setTranslation({ x: 0, y: 0.5, z: 5.5 }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [cameraResetSignal]);

  useEffect(() => {
    const isTypingInField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || target.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingInField(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keysRef.current.w = true;
      if (k === 's' || e.key === 'ArrowDown') keysRef.current.s = true;
      if (k === 'a' || e.key === 'ArrowLeft') keysRef.current.a = true;
      if (k === 'd' || e.key === 'ArrowRight') keysRef.current.d = true;
      if (e.code === 'Space') {
        keysRef.current.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keysRef.current.w = false;
      if (k === 's' || e.key === 'ArrowDown') keysRef.current.s = false;
      if (k === 'a' || e.key === 'ArrowLeft') keysRef.current.a = false;
      if (k === 'd' || e.key === 'ArrowRight') keysRef.current.d = false;
      if (e.code === 'Space') keysRef.current.space = false;
    };

    // Touch D-Pad virtual key listener for iPad & Phone
    const handleVirtualKey = (e: Event) => {
      const detail = (e as CustomEvent<{ key: VirtualKeyName; pressed: boolean }>).detail;
      if (!detail) return;
      keysRef.current[detail.key] = detail.pressed;
    };

    const handleBlur = () => {
      keysRef.current = { w: false, a: false, s: false, d: false, space: false };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('virak-virtual-key', handleVirtualKey);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('virak-virtual-key', handleVirtualKey);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const rb = bodyRef.current;
    if (!rb) return;

    const pos = rb.translation();
    const linvel = rb.linvel();

    let inputX = 0;
    let inputZ = 0;
    if (keysRef.current.w) inputZ -= 1;
    if (keysRef.current.s) inputZ += 1;
    if (keysRef.current.a) inputX -= 1;
    if (keysRef.current.d) inputX += 1;

    let vx = 0;
    let vz = 0;
    let isMoving = false;

    // Manual WASD / Arrow / Touch D-Pad movement overrides click-to-walk target
    if (inputX !== 0 || inputZ !== 0) {
      manualRoamRef.current = true;
      stuckTimerRef.current = 0;
      if (!isExploring && activeOverlay === 'none') {
        onStartManualExplore();
      }
      if (walkTarget) onReachTarget();
      moveVec.set(inputX, inputZ).normalize();
      vx = moveVec.x * MOVE_SPEED;
      vz = moveVec.y * MOVE_SPEED;
      isMoving = true;
    } else if (walkTarget) {
      const dx = walkTarget[0] - pos.x;
      const dz = walkTarget[2] - pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.32) {
        const speedScale = Math.min(1, Math.max(0.45, dist / 2.2));
        vx = (dx / dist) * MOVE_SPEED * speedScale;
        vz = (dz / dist) * MOVE_SPEED * speedScale;
        isMoving = true;

        // Stop auto-walk cleanly if blocked against a tree or building collider
        const actualHorizontalSpeed = Math.hypot(linvel.x, linvel.z);
        if (actualHorizontalSpeed < 0.75) {
          stuckTimerRef.current += delta;
          if (stuckTimerRef.current > 0.35) {
            stuckTimerRef.current = 0;
            onReachTarget();
          }
        } else {
          stuckTimerRef.current = 0;
        }
      } else {
        stuckTimerRef.current = 0;
        onReachTarget();
      }
    } else {
      stuckTimerRef.current = 0;
    }

    // Soft island perimeter boundary guard
    const nextX = pos.x + vx * delta;
    const nextZ = pos.z + vz * delta;
    const radialDist = Math.hypot(nextX, nextZ);
    if (radialDist > ISLAND_SAFE_RADIUS) {
      const nx = nextX / radialDist;
      const nz = nextZ / radialDist;
      const outwardDot = vx * nx + vz * nz;
      if (outwardDot > 0) {
        vx -= outwardDot * nx;
        vz -= outwardDot * nz;
      }
    }

    // Gentle jump when grounded
    let vy = linvel.y;
    const isGrounded = pos.y < 0.25 && Math.abs(linvel.y) < 0.35;
    if (keysRef.current.space && isGrounded) {
      vy = JUMP_VELOCITY;
      keysRef.current.space = false;
    }

    // Respawn safety if ever pushed below island
    if (pos.y < -6) {
      rb.setTranslation({ x: 0, y: 1.0, z: 5.5 }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    rb.setLinvel({ x: vx, y: vy, z: vz }, true);

    // Update shared mutable position ref (no React re-render)
    characterPosRef.current.set(pos.x, Math.max(0, pos.y), pos.z);

    // Smooth character rotation & limb walk cycle
    if (isMoving && (Math.abs(vx) > 0.05 || Math.abs(vz) > 0.05)) {
      const targetAngle = Math.atan2(vx, vz);
      facingAngleRef.current = dampAngle(facingAngleRef.current, targetAngle, 12, delta);
      walkCycleRef.current += delta * 12.5;

      const swing = Math.sin(walkCycleRef.current);
      const bounce = Math.abs(Math.sin(walkCycleRef.current * 2)) * 0.07;

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing * 0.62;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * 0.62;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.52;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.52;
      if (charBodyRef.current) charBodyRef.current.position.y = 0.95 + bounce;
      if (charHeadRef.current) charHeadRef.current.position.y = 1.8 + bounce;
    } else {
      const dampFactor = 1 - Math.exp(-10 * delta);
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 1 - dampFactor;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 1 - dampFactor;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 1 - dampFactor;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 1 - dampFactor;
      if (charBodyRef.current) {
        charBodyRef.current.position.y = 0.95 + Math.sin(elapsed * 2.4) * 0.018;
      }
      if (charHeadRef.current) {
        charHeadRef.current.position.y = 1.8 + Math.sin(elapsed * 2.4) * 0.022;
      }
    }

    if (visualRef.current) {
      visualRef.current.rotation.y = facingAngleRef.current;
    }

    // Responsive Camera Framing for Desktop, iPad, and Phone
    const profile = getResponsiveCameraProfile(state.size.width, state.size.height);
    const camAlpha = 1 - Math.exp(-3.4 * delta);

    if (state.camera instanceof THREE.PerspectiveCamera) {
      const nextFov = state.camera.fov + (profile.fov - state.camera.fov) * camAlpha;
      if (Math.abs(nextFov - state.camera.fov) > 0.04) {
        state.camera.fov = nextFov;
        state.camera.updateProjectionMatrix();
      }
    }

    let targetPivotX = pos.x * profile.followPanFactor;
    let targetPivotZ = pos.z * profile.followPanFactor;
    let targetRadius = profile.exploreRadius;
    let targetHeight = profile.exploreHeight;

    if (activeOverlay === 'about') {
      const p = LANDMARK_POSITIONS.about.building;
      targetPivotX = p[0] * 0.5;
      targetPivotZ = p[2] * 0.45;
      targetRadius = 24.0 * profile.modalScale;
      targetHeight = 18.5 * profile.modalScale;
      idealLookAt.set(p[0] * 0.42, 2.2, p[2] * 0.42);
      orbitAngleRef.current = dampAngle(orbitAngleRef.current, 0, 3.4, delta);
    } else if (activeOverlay === 'contact') {
      const p = LANDMARK_POSITIONS.contact.building;
      targetPivotX = p[0] * 0.5;
      targetPivotZ = p[2] * 0.45;
      targetRadius = 24.0 * profile.modalScale;
      targetHeight = 18.5 * profile.modalScale;
      idealLookAt.set(p[0] * 0.42, 2.2, p[2] * 0.42);
      orbitAngleRef.current = dampAngle(orbitAngleRef.current, 0, 3.4, delta);
    } else if (activeOverlay === 'experience') {
      targetPivotX = 0;
      targetPivotZ = 0;
      targetRadius = 20.5 * profile.modalScale;
      targetHeight = 18.0 * profile.modalScale;
      idealLookAt.set(0, 2.4, -3.5);
      orbitAngleRef.current = dampAngle(orbitAngleRef.current, 0, 3.4, delta);
    } else if (activeOverlay === 'work') {
      const p = LANDMARK_POSITIONS.work.building;
      targetPivotX = p[0] * 0.5;
      targetPivotZ = p[2] * 0.45;
      targetRadius = 24.0 * profile.modalScale;
      targetHeight = 18.5 * profile.modalScale;
      idealLookAt.set(p[0] * 0.42, 2.2, p[2] * 0.42);
      orbitAngleRef.current = dampAngle(orbitAngleRef.current, 0, 3.4, delta);
    } else if (!isExploring && !hasManualWalk && !manualRoamRef.current) {
      targetPivotX = 0;
      targetPivotZ = 0;
      targetRadius = profile.homeRadius;
      targetHeight = profile.homeHeight;
      idealLookAt.set(0, 1.2, 0);
      orbitAngleRef.current = (orbitAngleRef.current + delta * 0.22) % (Math.PI * 2);
    } else {
      idealLookAt.set(
        pos.x * (profile.followPanFactor * 0.72),
        1.6,
        pos.z * (profile.followPanFactor * 0.72)
      );
      orbitAngleRef.current = dampAngle(orbitAngleRef.current, 0, 3.8, delta);
    }

    camRadiusRef.current += (targetRadius - camRadiusRef.current) * camAlpha;
    camHeightRef.current += (targetHeight - camHeightRef.current) * camAlpha;
    camPivotXRef.current += (targetPivotX - camPivotXRef.current) * camAlpha;
    camPivotZRef.current += (targetPivotZ - camPivotZRef.current) * camAlpha;

    state.camera.position.set(
      camPivotXRef.current + Math.sin(orbitAngleRef.current) * camRadiusRef.current,
      camHeightRef.current,
      camPivotZRef.current + Math.cos(orbitAngleRef.current) * camRadiusRef.current
    );
    currentLookAt.lerp(idealLookAt, camAlpha);
    state.camera.lookAt(currentLookAt);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      enabledRotations={[false, false, false]}
      position={[0, 0.35, 5.5]}
      linearDamping={4}
      friction={0}
    >
      <CapsuleCollider args={[0.48, 0.42]} position={[0, 0.9, 0]} />

      <group ref={visualRef}>
        {/* Ground Contact Shadow Disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.62, 20]} />
          <meshBasicMaterial color="#3d5a27" transparent opacity={0.34} />
        </mesh>

        {/* Terracotta Coat Torso */}
        <mesh ref={charBodyRef} position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.85, 0.95, 0.55]} />
          <meshLambertMaterial color="#d3543a" />
        </mesh>

        {/* Backpack Craft Satchel */}
        <mesh position={[0, 0.98, -0.34]} castShadow>
          <boxGeometry args={[0.62, 0.64, 0.24]} />
          <meshLambertMaterial color="#8c5a38" />
        </mesh>

        {/* Head */}
        <group ref={charHeadRef} position={[0, 1.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.66, 0.66, 0.66]} />
            <meshLambertMaterial color="#ffdfbe" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.14, 0.04, 0.34]}>
            <boxGeometry args={[0.08, 0.1, 0.02]} />
            <meshBasicMaterial color="#241914" />
          </mesh>
          <mesh position={[0.14, 0.04, 0.34]}>
            <boxGeometry args={[0.08, 0.1, 0.02]} />
            <meshBasicMaterial color="#241914" />
          </mesh>
          {/* Forest Pine Explorer Cone Hat */}
          <mesh position={[0, 0.52, 0]} rotation={[0, Math.PI / 6, 0]} castShadow>
            <coneGeometry args={[0.62, 0.56, 6]} />
            <meshLambertMaterial color="#394f3e" />
          </mesh>
        </group>

        {/* Legs */}
        <mesh ref={leftLegRef} position={[-0.23, 0.28, 0]} castShadow>
          <boxGeometry args={[0.28, 0.56, 0.28]} />
          <meshLambertMaterial color="#242d38" />
        </mesh>
        <mesh ref={rightLegRef} position={[0.23, 0.28, 0]} castShadow>
          <boxGeometry args={[0.28, 0.56, 0.28]} />
          <meshLambertMaterial color="#242d38" />
        </mesh>

        {/* Arms */}
        <mesh ref={leftArmRef} position={[-0.53, 0.92, 0]} castShadow>
          <boxGeometry args={[0.2, 0.62, 0.2]} />
          <meshLambertMaterial color="#d3543a" />
        </mesh>
        <mesh ref={rightArmRef} position={[0.53, 0.92, 0]} castShadow>
          <boxGeometry args={[0.2, 0.62, 0.2]} />
          <meshLambertMaterial color="#d3543a" />
        </mesh>
      </group>
    </RigidBody>
  );
}
