import { CheckCircle2, MapPin, User } from 'lucide-react';
import { CHARACTER_STATS, SKILL_GROUPS } from '../../data/portfolioData';

interface AboutSkillsCardProps {
  onClose: () => void;
  onExploreExperience: () => void;
}

export function AboutSkillsCard({ onClose, onExploreExperience }: AboutSkillsCardProps) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#25170d]/45 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="About Me and Technical Skills"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[86dvh] flex flex-col paper-texture rounded-2xl sm:rounded-3xl border-2 border-[#dfcbb4] craft-shadow-lg overflow-hidden touch-auto"
      >
        {/* Top Terracotta Header Bar — Identical to Job Experience Template */}
        <div className="w-full bg-gradient-to-r from-[#a6341d] via-[#c8533d] to-[#9e3722] px-6 py-2.5 flex items-center justify-between border-b-2 border-[#751f0f] text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-[11px] font-mono tracking-widest uppercase font-bold text-[#fff5ea] border border-white/25">
              <User className="w-3 h-3 text-[#ffe29a]" />
              ABOUT ME // ARCHIVE LIBRARY
            </span>
            <span className="hidden sm:inline text-xs font-mono text-white/75 tracking-wider">
              WEST GROVE : SECTOR 01
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#ffeedb]">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span className="font-bold text-[11px] tracking-wide">PHNOM PENH · UTC+7</span>
          </div>
        </div>

        {/* Scrollable Content matching Job Experience Template */}
        <div className="flex-1 overflow-y-auto craft-scroll px-6 py-5 sm:px-8 sm:py-6 space-y-5">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfcbb4]">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-[#a6341d] uppercase">
                Developer Profile &amp; Technical Stack
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-[#2c1d11] tracking-tight mt-0.5">
                About Me
              </h2>
              <p className="mt-1 text-sm text-[#58413d] max-w-xl leading-relaxed">
                Creative Technologist &amp; 3D Web Engineer bridging handcrafted spatial design with
                high-frame-rate full-stack web engineering.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="self-start sm:self-center keycap-close flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer shrink-0"
            >
              <span className="px-1.5 h-6 rounded bg-[#fff8ed] border border-[#d6ba99] flex items-center justify-center font-mono font-bold text-[11px] text-[#2c1d11]">
                ESC
              </span>
              <span className="text-xs font-mono font-bold text-[#443224]">CLOSE</span>
            </button>
          </header>

          {/* Card 01: Developer Bio & Telemetry */}
          <article className="linen-card rounded-2xl border-2 border-[#e2d1b8] hover:border-[#d3543a]/60 craft-shadow p-5 transition-colors space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#2c1d11] text-[#f7e8ce] font-mono font-bold text-[10px] tracking-wider">
                    PROFILE // 01
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#2b4c3f]/12 border border-[#2b4c3f]/30 text-[#2b4c3f] font-mono font-bold text-[10px] uppercase">
                    ONLINE &amp; EXPLORING
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold text-[#2c1d11]">
                  Virak — Creative Technologist &amp; 3D Web Engineer
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#faedd8] border border-[#dfcbb4] font-mono font-bold text-xs text-[#2c1d11] self-start">
                <MapPin className="w-3.5 h-3.5 text-[#a6341d]" />
                <span>Phnom Penh, Cambodia</span>
              </div>
            </div>

            <p className="text-sm text-[#443224] leading-relaxed">
              I specialize in bespoke WebGL and React Three Fiber architectures, procedural
              miniature worlds, and scalable full-stack web applications engineered with
              mathematical precision and physical craft warmth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {CHARACTER_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl bg-[#faedd8] border border-[#dfcbb4] flex flex-col justify-between"
                >
                  <span
                    className="font-mono font-bold text-[10px] tracking-[0.08em] uppercase"
                    style={{ color: stat.accent }}
                  >
                    {stat.label}
                  </span>
                  <span className="font-mono font-bold text-xs text-[#2c1d11] mt-1">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </article>

          {/* Card 02: Technical Skills Matrix */}
          <article className="linen-card rounded-2xl border-2 border-[#e2d1b8] hover:border-[#d3543a]/60 craft-shadow p-5 transition-colors space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#2c1d11] text-[#f7e8ce] font-mono font-bold text-[10px] tracking-wider">
                  STACK // 02
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d3543a]/12 border border-[#d3543a]/30 text-[#a6341d] font-mono font-bold text-[10px] uppercase">
                  CORE TOOLKIT
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-headline font-bold text-[#2c1d11]">
                Engineering Capabilities &amp; Tech Stack
              </h3>
            </div>

            <div className="space-y-3.5">
              {SKILL_GROUPS.map((group) => (
                <div key={group.id} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#58413d]">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: group.dotColor }}
                    />
                    <span>{group.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-md bg-[#faf3e4] border border-[#dfcbb4] text-[11px] font-mono font-bold text-[#2c1d11]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-3.5 bg-[#f3e8d2]/85 border-t border-[#dfcbb4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#58413d] shrink-0">
          <span>Press [ESC] or click outside to resume island roaming</span>
          <button
            type="button"
            onClick={onExploreExperience}
            className="btn-terracotta-3d px-4 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer"
          >
            Inspect Job Experience ›
          </button>
        </footer>
      </section>
    </div>
  );
}
