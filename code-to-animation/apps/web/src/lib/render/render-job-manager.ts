import path from "path";
import fs from "fs/promises";
import type {
  ProjectConfig,
  RenderJob,
  RenderJobStatus,
  RenderConfig,
} from "@code-to-animation/animation-core";
import {
  DEFAULT_RENDER_CONFIG,
  getTotalDurationSeconds,
  secondsToFrames,
  validateProjectConfig,
} from "@code-to-animation/animation-core";
import type { StorageProvider } from "@/lib/storage/storage-provider";
import { LocalStorageProvider } from "@/lib/storage/local-storage-provider";

const RENDER_OUTPUT_DIR = process.env.RENDER_OUTPUT_DIR || "/tmp/renders";
const RENDERER_ENTRY_POINT = path.resolve(
  process.cwd(),
  "../../apps/renderer/src/entry.tsx"
);
const COMPOSITION_ID = "TextAnimation";

interface RenderState {
  jobs: Map<string, RenderJob>;
  activeRenderCount: number;
  cachedBundleLocation: string | null;
}

const globalForRender = globalThis as unknown as {
  __renderState?: RenderState;
};

function getRenderState(): RenderState {
  if (!globalForRender.__renderState) {
    globalForRender.__renderState = {
      jobs: new Map<string, RenderJob>(),
      activeRenderCount: 0,
      cachedBundleLocation: null,
    };
  }
  return globalForRender.__renderState;
}

const storage: StorageProvider = new LocalStorageProvider(RENDER_OUTPUT_DIR);
const renderConfig: RenderConfig = DEFAULT_RENDER_CONFIG;

function generateJobId(): string {
  return `job-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function getJob(jobId: string): RenderJob | undefined {
  return getRenderState().jobs.get(jobId);
}

export function getJobStatus(jobId: string): RenderJobStatus | null {
  const job = getRenderState().jobs.get(jobId);
  if (!job) return null;

  return {
    id: job.id,
    status: job.status,
    progress: job.progress,
    downloadUrl:
      job.status === "COMPLETED" ? storage.getDownloadUrl(jobId) : null,
    error: job.error,
  };
}

export function isRenderSlotAvailable(): boolean {
  return getRenderState().activeRenderCount < renderConfig.maxConcurrentRenders;
}

export async function startRender(
  config: ProjectConfig
): Promise<{ jobId: string } | { error: string }> {
  const validation = validateProjectConfig(config, renderConfig);
  if (!validation.valid) {
    return { error: validation.errors.join("; ") };
  }

  if (!isRenderSlotAvailable()) {
    return { error: "Server is busy. Please try again shortly." };
  }

  const jobId = generateJobId();

  const job: RenderJob = {
    id: jobId,
    status: "QUEUED",
    progress: 0,
    filePath: null,
    error: null,
    config,
    createdAt: Date.now(),
  };

  getRenderState().jobs.set(jobId, job);

  executeRender(jobId).catch(() => {
    /* errors handled inside */
  });

  return { jobId };
}

async function getBundleLocation(): Promise<string> {
  const state = getRenderState();
  if (state.cachedBundleLocation) {
    try {
      await fs.access(state.cachedBundleLocation);
      return state.cachedBundleLocation;
    } catch {
      state.cachedBundleLocation = null;
    }
  }

  const { bundle } = await import("@remotion/bundler");
  const location = await bundle({
    entryPoint: RENDERER_ENTRY_POINT,
    webpackOverride: (config: Record<string, unknown>) => config,
  });
  state.cachedBundleLocation = location;

  return location;
}

async function executeRender(jobId: string): Promise<void> {
  const state = getRenderState();
  const job = state.jobs.get(jobId);
  if (!job) return;

  state.activeRenderCount += 1;
  job.status = "RENDERING";

  try {
    const { renderMedia, selectComposition } = await import(
      "@remotion/renderer"
    );

    const fps = job.config.fps;
    const durations = job.config.scenes.map((s) => s.duration);
    const totalDuration = getTotalDurationSeconds(durations);
    const totalFrames = secondsToFrames(totalDuration, fps);
    const outputPath = path.join(RENDER_OUTPUT_DIR, `${jobId}.mp4`);

    await fs.mkdir(RENDER_OUTPUT_DIR, { recursive: true });

    const bundleLocation = await getBundleLocation();

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: COMPOSITION_ID,
      inputProps: { config: job.config },
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
      inputProps: { config: job.config },
      onProgress: ({ progress }: { progress: number }) => {
        job.progress = Math.round(progress * 100);
      },
    });

    const savedPath = await storage.save(jobId, outputPath);
    job.filePath = savedPath;
    job.status = "COMPLETED";
    job.progress = 100;
  } catch (err) {
    job.status = "FAILED";
    job.error = err instanceof Error ? err.message : "Unknown render error";
  } finally {
    getRenderState().activeRenderCount -= 1;
  }
}

export async function getJobFilePath(jobId: string): Promise<string | null> {
  return storage.getFilePath(jobId);
}
