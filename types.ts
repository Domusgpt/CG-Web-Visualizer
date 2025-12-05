export interface ScrollProgress {
  scrollY: number;
  progress: number;
}

export interface SectionProps {
  id?: string;
  className?: string;
}

export type CrystalShape = 'hex' | 'shard' | 'orb';

export interface HoloCardProps {
  title: string;
  description: string;
  shape?: CrystalShape;
  index: number;
}
