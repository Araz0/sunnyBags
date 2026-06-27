export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';
export type PreviewSide = 'A' | 'B';

export interface ResolutionEntry {
  id: string;
  w: number;
  h: number;
  name: string;
}

export interface SideState {
  front: boolean;
  back: boolean;
}
