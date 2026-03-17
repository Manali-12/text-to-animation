import path from "path";
import fs from "fs/promises";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import type { ProjectConfig, RenderConfig } from "@code-to-animation/animation-core";
import {
  getTotalDurationSeconds,
  secondsToFrames,
  DEFAULT_RENDER_CONFIG,
} from "@code-to-animation/animation-core";

export interface RenderOptions {
  config: ProjectConfig;
  outputDir: string;
  jobId: string;
  renderConfig?: RenderConfig;
  onProgress?: (progress: number) => void;
}

export interface RenderResult {
  outputPath: string;
  durationInSeconds: number;
  totalFrames: number;
}

const ENTRY_POINT = path.resolve(__dirname, "./entry.tsx");
const COMPOSITION_ID = "TextAnimation";

let cachedBundleLocation: string | null = null;

async function getBundleLocation(): Promise<string> {
  if (cachedBundleLocation) {
    try {
      await fs.access(cachedBundleLocation);
      return cachedBundleLocation;
    } catch {
      cachedBundleLocation = null;
    }
  }

  cachedBundleLocation = await bundle({
    entryPoint: ENTRY_POINT,
    webpackOverride: (currentConfig) => currentConfig,
  });

  return cachedBundleLocation;
}

export async function renderVideo(options: RenderOptions): Promise<RenderResult> {
  const {
    config,
    outputDir,
    jobId,
    renderConfig = DEFAULT_RENDER_CONFIG,
    onProgress,
  } = options;

  const fps = config.fps;
  const durations = config.scenes.map((s) => s.duration);
  const totalDuration = getTotalDurationSeconds(durations);
  const totalFrames = secondsToFrames(totalDuration, fps);
  const outputPath = path.join(outputDir, `${jobId}.mp4`);

  await fs.mkdir(outputDir, { recursive: true });

  const bundleLocation = await getBundleLocation();

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: COMPOSITION_ID,
    inputProps: { config },
  });

  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: totalFrames,
      fps,
      width: renderConfig.width,
      height: renderConfig.height,
    },
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { config },
    onProgress: ({ progress }) => {
      if (onProgress) {
        onProgress(Math.round(progress * 100));
      }
    },
  });

  return { outputPath, durationInSeconds: totalDuration, totalFrames };
}
