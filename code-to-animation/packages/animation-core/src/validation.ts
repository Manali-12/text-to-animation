import type { ProjectConfig, RenderConfig } from "./types";
import { getTotalDurationSeconds } from "./timing";
import { DEFAULT_RENDER_CONFIG } from "./defaults";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateProjectConfig(
  config: ProjectConfig,
  renderConfig: RenderConfig = DEFAULT_RENDER_CONFIG
): ValidationResult {
  const errors: string[] = [];

  if (!config.scenes || config.scenes.length === 0) {
    errors.push("At least one scene is required");
  }

  if (config.fps <= 0 || config.fps > 60) {
    errors.push("FPS must be between 1 and 60");
  }

  for (const scene of config.scenes) {
    if (!scene.text || scene.text.trim().length === 0) {
      errors.push(`Scene "${scene.id}" has empty text`);
    }
    if (scene.duration <= 0) {
      errors.push(`Scene "${scene.id}" has invalid duration`);
    }
  }

  const totalDuration = getTotalDurationSeconds(
    config.scenes.map((s) => s.duration)
  );

  if (totalDuration > renderConfig.maxTotalDurationSeconds) {
    errors.push(
      `Total duration ${totalDuration}s exceeds maximum ${renderConfig.maxTotalDurationSeconds}s`
    );
  }

  if (!config.globalStyles.fontFamily) {
    errors.push("Font family is required");
  }

  if (!config.globalStyles.backgroundColor) {
    errors.push("Background color is required");
  }

  if (!config.globalStyles.textColor) {
    errors.push("Text color is required");
  }

  if (config.globalStyles.fontSize <= 0) {
    errors.push("Font size must be positive");
  }

  return { valid: errors.length === 0, errors };
}
