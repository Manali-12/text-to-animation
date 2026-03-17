export type AnimationId =
  | "fade"
  | "slideUp"
  | "slideLeft"
  | "zoomIn"
  | "typewriter"
  | "blurIn";

export type FontFamily =
  | "Inter"
  | "Poppins"
  | "Montserrat"
  | "Playfair Display"
  | "Roboto";

export interface GsapAnimationParams {
  from: Record<string, string | number>;
  to: Record<string, string | number>;
  ease: string;
}

export interface RemotionAnimationParams {
  from: Record<string, number>;
  to: Record<string, number>;
  easing: "spring" | "linear" | "easeInOut" | "easeOut";
  springConfig?: {
    damping: number;
    mass: number;
    stiffness: number;
    overshootClamping: boolean;
  };
}

export interface AnimationPreset {
  id: AnimationId;
  label: string;
  gsap: GsapAnimationParams;
  remotion: RemotionAnimationParams;
}

export interface Scene {
  id: string;
  text: string;
  animation: AnimationId;
  duration: number;
  order: number;
}

export interface GlobalStyles {
  fontFamily: FontFamily;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export interface ProjectConfig {
  scenes: Scene[];
  globalStyles: GlobalStyles;
  fps: number;
}

export interface RenderConfig {
  width: number;
  height: number;
  maxTotalDurationSeconds: number;
  maxConcurrentRenders: number;
}

export type RenderStatus = "QUEUED" | "RENDERING" | "COMPLETED" | "FAILED";

export interface RenderJob {
  id: string;
  status: RenderStatus;
  progress: number;
  filePath: string | null;
  error: string | null;
  config: ProjectConfig;
  createdAt: number;
}

export interface RenderJobStatus {
  id: string;
  status: RenderStatus;
  progress: number;
  downloadUrl: string | null;
  error: string | null;
}
