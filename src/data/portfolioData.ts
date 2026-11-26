import { ExperienceItem, PortfolioProject, SkillGroup } from '../types';

export const LANDMARK_POSITIONS = {
  hub: { x: 0, y: 0, z: -4.0 },
  spawn: { x: 0, y: 0, z: 5.5 },
  about: {
    building: [-11.5, 0, -2.5] as [number, number, number],
    walkTarget: [-8.6, 0, -0.6] as [number, number, number],
    marker: [-11.5, 6.8, -2.5] as [number, number, number],
  },
  experience: {
    building: [0, 0, -4.0] as [number, number, number],
    walkTarget: [0, 0, -0.6] as [number, number, number],
    marker: [0, 7.6, -4.0] as [number, number, number],
  },
  work: {
    building: [11.5, 0, -2.5] as [number, number, number],
    walkTarget: [8.6, 0, -0.6] as [number, number, number],
    marker: [11.5, 7.0, -2.5] as [number, number, number],
  },
  contact: {
    building: [3.5, 0, 12.8] as [number, number, number],
    walkTarget: [2.8, 0, 9.6] as [number, number, number],
    marker: [3.5, 7.4, 12.8] as [number, number, number],
  },
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'procedural-miniature-biome',
    indexTag: '#01',
    category: '3D WebGL',
    domainBadge: 'WEBGL // R3F',
    title: 'Procedural Miniature Biome',
    subtitle: 'Interactive Voxel & Low-Poly Terrarium Engine',
    description:
      'Real-time procedural island generator with Rapier rigid-body physics, custom atmospheric fog shaders, dynamic day/night sun arcs, and spatial WebAudio foliage synthesis locked at 60 FPS.',
    metrics: '60 FPS · 1.8ms Draw',
    accentColor: '#2d587b',
    previewType: 'biome',
    techStack: ['React Three Fiber', 'Rapier Physics', 'GLSL Shaders', 'TypeScript'],
    demoUrl: '#biome-demo',
    sourceUrl: 'https://github.com',
  },
  {
    id: 'tactile-spatial-navigator',
    indexTag: '#02',
    category: 'Interactive UI',
    domainBadge: 'SPATIAL HUD // UI',
    title: 'Tactile Craft HUD System',
    subtitle: 'Diegetic Game-Inspired Design System for Web Worlds',
    description:
      'Composable React + Tailwind interface toolkit pairing torn-parchment physical craft affordances, mechanical keyboard telemetry, and billboarded 3D waypoint markers over WebGL viewports.',
    metrics: 'Zero Layout Shift · A11y',
    accentColor: '#2b4c3f',
    previewType: 'navigator',
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Drei'],
    demoUrl: '#hud-demo',
    sourceUrl: 'https://github.com',
  },
  {
    id: 'telegraph-realtime-studio',
    indexTag: '#03',
    category: 'Full-Stack',
    domainBadge: 'PROTOCOL // SYNC',
    title: 'Telegraph Multiplayer Studio',
    subtitle: 'Low-Latency Collaborative Canvas & Audio Dispatch',
    description:
      'Distributed collaborative workspace combining WebSocket state synchronization, synthesized tactile Morse & spatial audio cues, and persistent PostgreSQL room snapshots.',
    metrics: '< 28ms Sync Latency',
    accentColor: '#c45e22',
    previewType: 'telegraph',
    techStack: ['Node.js', 'WebSockets', 'PostgreSQL', 'Web Audio API'],
    demoUrl: '#telegraph-demo',
    sourceUrl: 'https://github.com',
  },
];

export const JOB_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'senior-creative-3d-engineer',
    indexTag: 'ROLE // 01',
    period: '2024 — PRESENT',
    role: 'Senior Creative Technologist & 3D Web Engineer',
    company: 'Atelier Spatial Studio',
    location: 'Phnom Penh · Hybrid',
    badge: 'CURRENT',
    summary:
      'Leading interactive 3D web experiences, spatial product configurators, and game-inspired React design systems running smoothly across desktop and mobile GPUs.',
    highlights: [
      'Architected React Three Fiber + Rapier physics scenes sustaining 60 FPS under <2ms CPU frame budgets.',
      'Built shared Tailwind & design-token HUD libraries bridging 2D UI accessibility with 3D WebGL viewports.',
    ],
    techStack: ['React Three Fiber', 'TypeScript', 'Rapier', 'GLSL', 'Tailwind CSS'],
  },
  {
    id: 'fullstack-frontend-engineer',
    indexTag: 'ROLE // 02',
    period: '2022 — 2024',
    role: 'Full-Stack & Interactive UI Engineer',
    company: 'Mekong Digital Systems',
    location: 'Phnom Penh, Cambodia',
    badge: 'FULL-TIME',
    summary:
      'Engineered real-time collaborative web platforms, low-latency WebSocket dashboards, and high-craft interactive marketing experiences.',
    highlights: [
      'Delivered 15+ production React & Next.js web applications with Node.js and PostgreSQL backends.',
      'Reduced initial bundle load by 42% through code-splitting, asset compression, and instanced WebGL geometry.',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'WebSockets'],
  },
  {
    id: 'creative-frontend-developer',
    indexTag: 'ROLE // 03',
    period: '2020 — 2022',
    role: 'Frontend & Motion Developer',
    company: 'Crafted Web Collective',
    location: 'Remote',
    badge: 'FOUNDATION',
    summary:
      'Crafted bespoke editorial websites, interactive Canvas/Three.js micro-sites, and component libraries for design-led startups.',
    highlights: [
      'Translated Figma & Stitch prototypes into pixel-accurate responsive interfaces with tactile micro-interactions.',
      'Created reusable Three.js scene templates and custom post-processing transitions.',
    ],
    techStack: ['Three.js', 'TypeScript', 'Vite', 'CSS Architecture', 'Figma'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: '3d-graphics',
    title: '3D & GRAPHICS ENGINE',
    dotColor: '#d3543a',
    skills: [
      'Three.js',
      'React Three Fiber',
      'Drei',
      'Rapier Physics',
      'GLSL Shaders',
      'Blender Low-Poly',
    ],
  },
  {
    id: 'frontend-ui',
    title: 'FRONTEND & TACTILE UI',
    dotColor: '#2b4c3f',
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'Next.js',
      'Spatial HUD Design',
    ],
  },
  {
    id: 'backend-tools',
    title: 'BACKEND & INFRASTRUCTURE',
    dotColor: '#2d587b',
    skills: ['Node.js', 'PostgreSQL', 'WebSockets', 'REST / GraphQL', 'Docker', 'Git / CI'],
  },
];

export const CHARACTER_STATS = [
  { label: 'LVL / EXP', value: 'LVL 28 // 5+ YRS', accent: '#2b4c3f' },
  { label: 'SHIPPED BUILDS', value: '34 PROD WORLDS', accent: '#d3543a' },
  { label: 'FRAME BUDGET', value: '60 FPS LOCKED', accent: '#2d587b' },
];
