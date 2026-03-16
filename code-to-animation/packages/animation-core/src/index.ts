export type {
  AnimationId,
  AnimationPreset,
  FontFamily,
  GlobalStyles,
  GsapAnimationParams,
  ProjectConfig,
  RenderConfig,
  RenderJob,
  RenderStatus,
  RemotionAnimationParams,
  RenderJobStatus,
  Scene,
} from "./types";

export { ANIMATION_PRESETS, ANIMATION_OPTIONS } from "./animations";

export {
  DEFAULT_FPS,
  MIN_SCENE_DURATION,
  MAX_SCENE_DURATION,
  DEFAULT_SCENE_DURATION,
  ANIMATION_ENTER_RATIO,
  ANIMATION_HOLD_RATIO,
  ANIMATION_EXIT_RATIO,
  secondsToFrames,
  framesToSeconds,
  getAnimationFrames,
  getTotalDurationSeconds,
} from "./timing";

export {
  createScene,
  DEFAULT_GLOBAL_STYLES,
  DEFAULT_PROJECT_CONFIG,
  DEFAULT_RENDER_CONFIG,
  AVAILABLE_FONTS,
} from "./defaults";

export type { ValidationResult } from "./validation";
export { validateProjectConfig } from "./validation";
