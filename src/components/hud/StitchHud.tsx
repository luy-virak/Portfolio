import { useCallback, useEffect, useState } from 'react';
import { Compass, Home } from 'lucide-react';
import { ActiveOverlay, LandmarkId } from '../../types';
import { VirtualKeyName } from '../scene/ExplorerCharacter';

interface StitchHudProps {
  activeOverlay: ActiveOverlay;
  isExploring: boolean;
  onNavigateLandmark: (landmark: LandmarkId) => void;
  onExploreCenter: () => void;
  onBackHome: () => void;
}

export function StitchHud({
  activeOverlay,
  isExploring,
  onNavigateLandmark,
  onExploreCenter,
  onBackHome,
}: StitchHudProps) {
  const [pressedKeys, setPressedKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });

  // Dispatch virtual key state for touch D-Pad on iPad & Phone
  const triggerVirtualKey = useCallback((key: VirtualKeyName, pressed: boolean) => {
    setPressedKeys((prev) => (prev[key] === pressed ? prev : { ...prev, [key]: pressed }));
    window.dispatchEvent(
      new CustomEvent('virak-virtual-key', {
        detail: { key, pressed },
      })
    );
  }, []);

  // Visual keycap highlight feedback for physical keyboards
  useEffect(() => {
    const isTypingInField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || target.isContentEditable;
    };

    const onDown = (e: KeyboardEvent) => {
      if (isTypingInField(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') setPressedKeys((p) => (p.w ? p : { ...p, w: true }));
      if (k === 'a' || e.key === 'ArrowLeft') setPressedKeys((p) => (p.a ? p : { ...p, a: true }));
      if (k === 's' || e.key === 'ArrowDown') setPressedKeys((p) => (p.s ? p : { ...p, s: true }));
      if (k === 'd' || e.key === 'ArrowRight') setPressedKeys((p) => (p.d ? p : { ...p, d: true }));
      if (e.code === 'Space') setPressedKeys((p) => (p.space ? p : { ...p, space: true }));
    };

    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') setPressedKeys((p) => (!p.w ? p : { ...p, w: false }));
      if (k === 'a' || e.key === 'ArrowLeft') setPressedKeys((p) => (!p.a ? p : { ...p, a: false }));
      if (k === 's' || e.key === 'ArrowDown') setPressedKeys((p) => (!p.s ? p : { ...p, s: false }));
      if (k === 'd' || e.key === 'ArrowRight') setPressedKeys((p) => (!p.d ? p : { ...p, d: false }));
      if (e.code === 'Space') setPressedKeys((p) => (!p.space ? p : { ...p, space: false }));
    };

    const onBlur = () =>
      setPressedKeys({ w: false, a: false, s: false, d: false, space: false });

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const isModalDimmed = activeOverlay !== 'none';

  return (
    <div
      className={`fixed inset-0 z-10 pointer-events-none flex flex-col justify-between pl-[max(0.875rem,env(safe-area-inset-left))] pr-[max(0.875rem,env(safe-area-inset-right))] sm:px-[max(2rem,env(safe-area-inset-left))] pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:py-8 [@media(max-height:520px)]:py-2.5 transition-opacity duration-200 ${
        isModalDimmed ? 'opacity-35' : 'opacity-100'
      }`}
    >
      {/* TOP PERIMETER BAR */}
      <div className="w-full flex items-start justify-center">
        {!isExploring && (
          <div className="mx-auto flex flex-col items-center pt-0.5 sm:pt-2 [@media(max-height:520px)]:pt-0 pointer-events-none">
            <h1 className="font-headline text-3xl sm:text-5xl md:text-[54px] [@media(max-height:520px)]:text-3xl font-extrabold tracking-[-0.03em] text-center title-stroke mb-2 sm:mb-3 [@media(max-height:520px)]:mb-1.5 select-none">
              Virak’s World
            </h1>
            <button
              type="button"
              onClick={onExploreCenter}
              className="pointer-events-auto touch-manipulation torn-paper craft-shadow craft-shadow-pressed px-5 py-2 sm:px-6 sm:py-2.5 [@media(max-height:520px)]:px-4 [@media(max-height:520px)]:py-1.5 bg-[#fceecf] hover:bg-[#fff5dc] active:bg-[#f3dfbf] text-[#2c1d11] font-headline font-bold text-sm sm:text-base [@media(max-height:520px)]:text-xs tracking-wide flex items-center gap-1.5 transition-all duration-200 border-t border-[#fff9ec] border-b border-[#ddbe8d] cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#d3543a]" />
              <span>Explore World</span>
              <span className="text-sm font-bold opacity-80">&gt;</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM PERIMETER DOCK */}
      <div className="w-full relative pb-0.5 sm:pb-2 [@media(max-height:520px)]:pb-0 flex flex-col items-center">
        <div className="w-full relative min-h-[44px] flex items-end justify-center">
          {/* Bottom-Left Touch & Keyboard Inverted-T WASD + SPACE Keycap Pad
              - On Home (!isExploring): only shown on wide xl (>=1280px) tall viewports so it never collides with the 4 landmark buttons on rotated phones or tablets
              - In Explore Mode (isExploring): shown on all devices (scaled neatly on short landscape phones) */}
          <div
            className={`absolute left-0 bottom-0 flex-col items-center px-3 pt-2.5 pb-3 sm:px-4 sm:pt-3.5 sm:pb-4 rounded-2xl wasd-badge pointer-events-auto touch-none select-none origin-bottom-left ${
              isExploring
                ? 'flex [@media(max-height:520px)]:scale-75'
                : 'hidden xl:flex [@media(max-height:560px)]:!hidden'
            }`}
          >
            {/* Top Row: W */}
            <button
              type="button"
              aria-label="Move Forward"
              onPointerDown={(e) => {
                e.preventDefault();
                triggerVirtualKey('w', true);
              }}
              onPointerUp={() => triggerVirtualKey('w', false)}
              onPointerCancel={() => triggerVirtualKey('w', false)}
              onPointerLeave={() => triggerVirtualKey('w', false)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold uppercase wasd-key mb-1.5 cursor-pointer ${
                pressedKeys.w ? 'wasd-key-active' : ''
              }`}
            >
              W
            </button>

            {/* Middle Row: A S D */}
            <div className="flex items-center gap-1.5 mb-2">
              {(['a', 's', 'd'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-label={`Move ${k.toUpperCase()}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    triggerVirtualKey(k, true);
                  }}
                  onPointerUp={() => triggerVirtualKey(k, false)}
                  onPointerCancel={() => triggerVirtualKey(k, false)}
                  onPointerLeave={() => triggerVirtualKey(k, false)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold uppercase wasd-key cursor-pointer ${
                    pressedKeys[k] ? 'wasd-key-active' : ''
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Bottom Row: SPACE */}
            <button
              type="button"
              aria-label="Jump"
              onPointerDown={(e) => {
                e.preventDefault();
                triggerVirtualKey('space', true);
              }}
              onPointerUp={() => triggerVirtualKey('space', false)}
              onPointerCancel={() => triggerVirtualKey('space', false)}
              onPointerLeave={() => triggerVirtualKey('space', false)}
              className={`w-20 sm:w-24 h-7 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.06em] wasd-key cursor-pointer ${
                pressedKeys.space ? 'wasd-key-active' : ''
              }`}
            >
              SPACE
            </button>
          </div>

          {/* Bottom-Center Torn-Paper Landmark Navigation Buttons (Hidden in Explore Mode) */}
          {!isExploring && (
            <nav
              aria-label="Diorama Landmarks"
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 xl:px-44 pointer-events-auto w-full max-w-[340px] sm:max-w-none"
            >
              <button
                type="button"
                onClick={() => onNavigateLandmark('about')}
                className={`touch-manipulation torn-paper craft-shadow craft-shadow-pressed px-3.5 py-2 sm:px-5 sm:py-2.5 font-headline font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 border-t border-[#fff9ec] cursor-pointer ${
                  activeOverlay === 'about'
                    ? 'bg-[#2b4c3f] text-[#fff9ee] border-b-2 border-[#1b332a] scale-105'
                    : 'bg-[#f5e6cc] hover:bg-[#faeed6] active:bg-[#ebd7b8] text-[#2c1d11] border-b border-[#cfae7d]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    activeOverlay === 'about' ? 'bg-emerald-300' : 'bg-[#2b4c3f]'
                  }`}
                />
                <span>About Me</span>
                <span className="text-xs font-bold opacity-75">&gt;</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateLandmark('experience')}
                className={`touch-manipulation torn-paper craft-shadow craft-shadow-pressed px-3.5 py-2 sm:px-5 sm:py-2.5 font-headline font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 border-t border-[#fff9ec] cursor-pointer ${
                  activeOverlay === 'experience'
                    ? 'bg-[#a6341d] text-[#fff9ee] border-b-2 border-[#751f0f] scale-105'
                    : 'bg-[#f5e6cc] hover:bg-[#faeed6] active:bg-[#ebd7b8] text-[#2c1d11] border-b border-[#cfae7d]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    activeOverlay === 'experience' ? 'bg-amber-200' : 'bg-[#a6341d]'
                  }`}
                />
                <span>Job Experience</span>
                <span className="text-xs font-bold opacity-75">&gt;</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateLandmark('work')}
                className={`touch-manipulation torn-paper craft-shadow craft-shadow-pressed px-3.5 py-2 sm:px-5 sm:py-2.5 font-headline font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 border-t border-[#fff9ec] cursor-pointer ${
                  activeOverlay === 'work'
                    ? 'bg-[#2d587b] text-[#fff9ee] border-b-2 border-[#1e3d57] scale-105'
                    : 'bg-[#f5e6cc] hover:bg-[#faeed6] active:bg-[#ebd7b8] text-[#2c1d11] border-b border-[#cfae7d]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    activeOverlay === 'work' ? 'bg-sky-300' : 'bg-[#2d587b]'
                  }`}
                />
                <span>My Work</span>
                <span className="text-xs font-bold opacity-75">&gt;</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateLandmark('contact')}
                className={`touch-manipulation torn-paper craft-shadow craft-shadow-pressed px-3.5 py-2 sm:px-5 sm:py-2.5 font-headline font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 border-t border-[#fff9ec] cursor-pointer ${
                  activeOverlay === 'contact'
                    ? 'bg-[#d3543a] text-[#fff9ee] border-b-2 border-[#9e3722] scale-105'
                    : 'bg-[#f5e6cc] hover:bg-[#faeed6] active:bg-[#ebd7b8] text-[#2c1d11] border-b border-[#cfae7d]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    activeOverlay === 'contact' ? 'bg-amber-200' : 'bg-[#c45e22]'
                  }`}
                />
                <span>Contact</span>
                <span className="text-xs font-bold opacity-75">&gt;</span>
              </button>
            </nav>
          )}

          {/* Bottom-Right "Back Home" Button (Shown in Explore Mode) */}
          {isExploring && (
            <button
              type="button"
              onClick={onBackHome}
              className="absolute right-0 bottom-0 pointer-events-auto touch-manipulation torn-paper craft-shadow craft-shadow-pressed px-4 py-2 sm:px-5 sm:py-2.5 bg-[#fceecf] hover:bg-[#fff5dc] active:bg-[#f3dfbf] text-[#2c1d11] font-headline font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all duration-200 border-t border-[#fff9ec] border-b border-[#ddbe8d] cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#d3543a]" />
              <span>Back Home</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
