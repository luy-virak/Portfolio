export type LandmarkId = 'about' | 'experience' | 'work' | 'contact';

export type ActiveOverlay = 'none' | LandmarkId;

export type ProjectCategory = 'All' | '3D WebGL' | 'Full-Stack' | 'Interactive UI';

export interface PortfolioProject {
  id: string;
  indexTag: string;
  category: Exclude<ProjectCategory, 'All'>;
  domainBadge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  accentColor: string;
  previewType: 'biome' | 'navigator' | 'telegraph' | 'shader';
  techStack: string[];
  demoUrl: string;
  sourceUrl: string;
}

export interface ExperienceItem {
  id: string;
  indexTag: string;
  period: string;
  role: string;
  company: string;
  location: string;
  badge: string;
  summary: string;
  highlights: string[];
  techStack: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  dotColor: string;
  skills: string[];
}

export interface Vec3Tuple {
  x: number;
  y: number;
  z: number;
}
