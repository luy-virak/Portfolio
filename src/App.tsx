import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ActiveOverlay, LandmarkId } from './types';
import { LANDMARK_POSITIONS } from './data/portfolioData';
import { DioramaWorld } from './components/scene/DioramaWorld';
import { StitchHud } from './components/hud/StitchHud';
import { WorkShowcaseModal } from './components/hud/WorkShowcaseModal';
import { AboutSkillsCard } from './components/hud/AboutSkillsCard';
import { ContactDrawer } from './components/hud/ContactDrawer';
import { ExperienceModal } from './components/hud/ExperienceModal';

export default function App() {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>('none');
  const [isExploring, setIsExploring] = useState(false);
  const [hasManualWalk, setHasManualWalk] = useState(false);
  const [walkTarget, setWalkTarget] = useState<[number, number, number] | null>(null);
  const [nearbyLandmark, setNearbyLandmark] = useState<LandmarkId | null>(null);

  const characterPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5.5));

  const handleGroundWalk = useCallback((point: [number, number, number]) => {
    setActiveOverlay('none');
    setIsExploring(true);
    setHasManualWalk(true);
    setWalkTarget(point);
  }, []);

  const handleStartManualExplore = useCallback(() => {
    setActiveOverlay('none');
    setIsExploring(true);
  }, []);

  const handleNavigateLandmark = useCallback((landmark: LandmarkId) => {
    setWalkTarget(LANDMARK_POSITIONS[landmark].walkTarget);
    setActiveOverlay((prev) => (prev === landmark ? 'none' : landmark));
  }, []);

  const handleExploreCenter = useCallback(() => {
    setActiveOverlay('none');
    setIsExploring(true);
    setWalkTarget([0, 0, 1.8]);
  }, []);

  const handleBackHome = useCallback(() => {
    setActiveOverlay('none');
    setIsExploring(false);
    setHasManualWalk(false);
    setWalkTarget([0, 0, 5.5]);
  }, []);

  // Poll proximity at 5Hz so HUD can show diegetic "[E] Inspect" prompt near buildings
  useEffect(() => {
    const interval = window.setInterval(() => {
      const p = characterPosRef.current;
      const dAbout = Math.hypot(
        p.x - LANDMARK_POSITIONS.about.building[0],
        p.z - LANDMARK_POSITIONS.about.building[2]
      );
      const dExp = Math.hypot(
        p.x - LANDMARK_POSITIONS.experience.building[0],
        p.z - LANDMARK_POSITIONS.experience.building[2]
      );
      const dWork = Math.hypot(
        p.x - LANDMARK_POSITIONS.work.building[0],
        p.z - LANDMARK_POSITIONS.work.building[2]
      );
      const dContact = Math.hypot(
        p.x - LANDMARK_POSITIONS.contact.building[0],
        p.z - LANDMARK_POSITIONS.contact.building[2]
      );

      if (dAbout < 5.6) setNearbyLandmark('about');
      else if (dExp < 5.8) setNearbyLandmark('experience');
      else if (dWork < 5.8) setNearbyLandmark('work');
      else if (dContact < 5.6) setNearbyLandmark('contact');
      else setNearbyLandmark(null);
    }, 200);

    return () => window.clearInterval(interval);
  }, []);

  // Global ESC to dismiss overlays & [E] to open nearby landmark
  useEffect(() => {
    const isTypingInField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || target.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveOverlay('none');
        return;
      }
      if (isTypingInField(e.target)) return;
      if (e.key.toLowerCase() === 'e' && nearbyLandmark && activeOverlay === 'none') {
        setActiveOverlay(nearbyLandmark);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nearbyLandmark, activeOverlay]);

  const isTouchOrMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#dceef5] select-none touch-none">
      {/* Layer 0: Fullscreen 60fps 3D Walkable Terrarium Canvas */}
      <div className="fixed inset-0 z-0 touch-none">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-[#dceef5] px-4">
              <div className="px-6 py-4 rounded-2xl paper-texture border-2 border-[#dfcbb4] craft-shadow flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#d3543a] animate-ping shrink-0" />
                <span className="font-mono font-bold text-xs text-[#2c1d11] tracking-wider uppercase">
                  Initializing Terrarium Physics &amp; Diorama...
                </span>
              </div>
            </div>
          }
        >
          <Canvas
            shadows
            dpr={isTouchOrMobile ? [1, 1.5] : [1, 2]}
            camera={{ position: [0, 28, 45], fov: 44, near: 0.1, far: 300 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <DioramaWorld
              walkTarget={walkTarget}
              onSetWalkTarget={handleGroundWalk}
              onClearWalkTarget={() => setWalkTarget(null)}
              onStartManualExplore={handleStartManualExplore}
              characterPosRef={characterPosRef}
              activeOverlay={activeOverlay}
              isExploring={isExploring}
              hasManualWalk={hasManualWalk}
              onSelectLandmark={handleNavigateLandmark}
              cameraResetSignal={0}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Layer 1: Stitch Screen 1 Torn-Paper & Keycap Perimeter HUD */}
      <StitchHud
        activeOverlay={activeOverlay}
        isExploring={isExploring}
        onNavigateLandmark={handleNavigateLandmark}
        onExploreCenter={handleExploreCenter}
        onBackHome={handleBackHome}
      />

      {/* Layer 2: Stitch Matching Overlay Screens */}
      {activeOverlay === 'experience' && (
        <ExperienceModal
          onClose={() => setActiveOverlay('none')}
          onExploreWork={() => handleNavigateLandmark('work')}
        />
      )}

      {activeOverlay === 'work' && (
        <WorkShowcaseModal
          onClose={() => setActiveOverlay('none')}
          onJumpToContact={() => handleNavigateLandmark('contact')}
        />
      )}

      {activeOverlay === 'about' && (
        <AboutSkillsCard
          onClose={() => setActiveOverlay('none')}
          onExploreExperience={() => handleNavigateLandmark('experience')}
        />
      )}

      {activeOverlay === 'contact' && (
        <ContactDrawer onClose={() => setActiveOverlay('none')} />
      )}
    </div>
  );
}
