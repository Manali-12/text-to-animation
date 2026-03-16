export const DEFAULT_FPS = 30;
export const MIN_SCENE_DURATION = 0.5;
export const MAX_SCENE_DURATION = 10;
export const DEFAULT_SCENE_DURATION = 2;
export const ANIMATION_ENTER_RATIO = 0.4;
export const ANIMATION_HOLD_RATIO = 0.5;
export const ANIMATION_EXIT_RATIO = 0.1;

export function secondsToFrames(seconds: number, fps: number = DEFAULT_FPS): number {
  return Math.round(seconds * fps);
}

export function framesToSeconds(frames: number, fps: number = DEFAULT_FPS): number {
  return frames / fps;
}

export function getAnimationFrames(
  totalDurationSeconds: number,
  fps: number = DEFAULT_FPS
): {
  enterFrames: number;
  holdFrames: number;
  exitFrames: number;
  totalFrames: number;
} {
  const totalFrames = secondsToFrames(totalDurationSeconds, fps);
  const enterFrames = Math.round(totalFrames * ANIMATION_ENTER_RATIO);
  const holdFrames = Math.round(totalFrames * ANIMATION_HOLD_RATIO);
  const exitFrames = totalFrames - enterFrames - holdFrames;

  return { enterFrames, holdFrames, exitFrames, totalFrames };
}

export function getTotalDurationSeconds(sceneDurations: number[]): number {
  return sceneDurations.reduce((sum, d) => sum + d, 0);
}
