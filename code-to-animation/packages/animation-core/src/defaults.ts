import { GlobalStyles, ProjectConfig, RenderConfig, Scene } from "./types";
import { DEFAULT_FPS, DEFAULT_SCENE_DURATION } from "./timing";

let sceneCounter = 0;

export function createScene(overrides?: Partial<Pick<Scene, "text" | "animation" | "duration">>): Scene {
  sceneCounter += 1;
  return {
    id: `scene-${Date.now()}-${sceneCounter}`,
    text: overrides?.text ?? "Your text here",
    animation: overrides?.animation ?? "fade",
    duration: overrides?.duration ?? DEFAULT_SCENE_DURATION,
    order: 0,
  };
}

export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  fontFamily: "Inter",
  backgroundColor: "#000000",
  textColor: "#ffffff",
  fontSize: 48,
};

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  scenes: [
    { ...createScene({ text: "Welcome to our product" }), order: 0 },
    { ...createScene({ text: "It saves you 10 hours per week", animation: "slideUp" }), order: 1 },
    { ...createScene({ text: "Start today", animation: "zoomIn" }), order: 2 },
  ],
  globalStyles: { ...DEFAULT_GLOBAL_STYLES },
  fps: DEFAULT_FPS,
};

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  width: 1080,
  height: 1080,
  maxTotalDurationSeconds: 30,
  maxConcurrentRenders: 1,
};

export const AVAILABLE_FONTS = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Playfair Display",
  "Roboto",
] as const;
