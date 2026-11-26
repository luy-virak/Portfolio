import { useState } from 'react';
import { Activity, CheckCircle2, Code2, ExternalLink, Layers } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../../data/portfolioData';
import { PortfolioProject, ProjectCategory } from '../../types';

interface WorkShowcaseModalProps {
  onClose: () => void;
  onJumpToContact: () => void;
}

const CATEGORIES: ProjectCategory[] = ['All', '3D WebGL', 'Full-Stack', 'Interactive UI'];

export function WorkShowcaseModal({ onClose, onJumpToContact }: WorkShowcaseModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [inspectedProject, setInspectedProject] = useState<PortfolioProject | null>(null);

  const visibleProjects =
    selectedCategory === 'All'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#25170d]/45 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="My Work Showcase"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[86dvh] flex flex-col paper-texture rounded-2xl sm:rounded-3xl border-2 border-[#dfcbb4] craft-shadow-lg overflow-hidden touch-auto"
      >
        {/* Top Terracotta Header Bar — Identical to Job Experience Template */}
        <div className="w-full bg-gradient-to-r from-[#a6341d] via-[#c8533d] to-[#9e3722] px-6 py-2.5 flex items-center justify-between border-b-2 border-[#751f0f] text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-[11px] font-mono tracking-widest uppercase font-bold text-[#fff5ea] border border-white/25">
              <Layers className="w-3 h-3 text-[#ffe29a]" />
              MY WORK // WORKSHOP ARCHIVE
            </span>
            <span className="hidden sm:inline text-xs font-mono text-white/75 tracking-wider">
              EAST RIDGE : SECTOR 02
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#ffeedb]">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span className="font-bold text-[11px] tracking-wide">03 FEATURED BUILDS</span>
          </div>
        </div>

        {/* Scrollable Showcase Content matching Job Experience Template */}
        <div className="flex-1 overflow-y-auto craft-scroll px-6 py-5 sm:px-8 sm:py-6 space-y-5">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfcbb4]">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-[#a6341d] uppercase">
                Featured Engineering &amp; Spatial UI
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-[#2c1d11] tracking-tight mt-0.5">
                My Work
              </h2>
              <p className="mt-1 text-sm text-[#58413d] max-w-xl leading-relaxed">
                Selected 3D WebGL micro-worlds, tactile interface systems, and low-latency
                full-stack applications.
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

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    active
                      ? 'bg-[#2c1d11] text-[#f7e8ce] shadow-sm'
                      : 'bg-[#faedd8] text-[#58413d] border border-[#dfcbb4] hover:text-[#2c1d11]'
                  }`}
                >
                  {cat === 'All' ? `All (0${PORTFOLIO_PROJECTS.length})` : cat}
                </button>
              );
            })}
          </div>

          {/* Inline Live Preview Banner */}
          {inspectedProject && (
            <div className="p-4 rounded-2xl bg-[#faedd8] border-2 border-[#d3543a]/55 craft-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-[10px] text-[#a6341d] uppercase">
                  LIVE SPECIMEN READY // {inspectedProject.indexTag}
                </span>
                <h3 className="font-headline font-bold text-base text-[#2c1d11]">
                  {inspectedProject.title} — {inspectedProject.metrics}
                </h3>
                <p className="text-xs text-[#58413d]">
                  Return to the island scene to test live Rapier physics, 3D markers, and spatial
                  HUD responsiveness.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-terracotta-3d px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Test in Scene ›
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedProject(null)}
                  className="btn-parchment-3d px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Hide
                </button>
              </div>
            </div>
          )}

          {/* Project Cards matching Job Experience Linen-Card Template */}
          <div className="space-y-4">
            {visibleProjects.map((project) => (
              <article
                key={project.id}
                className="linen-card rounded-2xl border-2 border-[#e2d1b8] hover:border-[#d3543a]/60 craft-shadow p-5 transition-colors space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-[#2c1d11] text-[#f7e8ce] font-mono font-bold text-[10px] tracking-wider">
                        PROJECT // {project.indexTag.replace('#', '')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#d3543a]/12 border border-[#d3543a]/30 text-[#a6341d] font-mono font-bold text-[10px] uppercase">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-headline font-bold text-[#2c1d11]">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-[#2d587b] mt-0.5">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#faedd8] border border-[#dfcbb4] font-mono font-bold text-xs text-[#2c1d11] self-start">
                    <Activity className="w-3.5 h-3.5 text-[#a6341d]" />
                    <span>{project.metrics}</span>
                  </div>
                </div>

                <p className="text-sm text-[#443224] leading-relaxed">{project.description}</p>

                <div className="flex items-start gap-2 text-[13px] text-[#58413d]">
                  <CheckCircle2 className="w-4 h-4 text-[#2b4c3f] shrink-0 mt-0.5" />
                  <span>
                    Engineered under <strong>{project.domainBadge}</strong> standards for smooth
                    desktop &amp; mobile responsiveness.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md bg-[#faf3e4] border border-[#dfcbb4] text-[11px] font-mono font-bold text-[#2c1d11]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInspectedProject(project)}
                      className="btn-terracotta-3d px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Launch Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-parchment-3d px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-3.5 bg-[#f3e8d2]/85 border-t border-[#dfcbb4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#58413d] shrink-0">
          <span>Press [ESC] or click outside to resume island roaming</span>
          <button
            type="button"
            onClick={onJumpToContact}
            className="btn-terracotta-3d px-4 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer"
          >
            Contact Telegraph Outpost ›
          </button>
        </footer>
      </section>
    </div>
  );
}
