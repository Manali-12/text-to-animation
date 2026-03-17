"use client";

import React, { useState, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Download, Loader2 } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import type { RenderJobStatus } from "@code-to-animation/animation-core";
import { ProgressBar } from "./ProgressBar";

type RenderState = "idle" | "rendering" | "completed" | "failed";

const POLL_INTERVAL_MS = 1000;

export function RenderControls() {
  const { isPlaying, setIsPlaying, config } = useProjectStore();
  const [renderState, setRenderState] = useState<RenderState>("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const pollStatus = useCallback(
    (jobId: string) => {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/render/${jobId}/status`);
          if (!res.ok) throw new Error("Status check failed");

          const status = (await res.json()) as RenderJobStatus;
          setRenderProgress(status.progress);

          if (status.status === "COMPLETED" && status.downloadUrl) {
            stopPolling();
            setRenderState("completed");
            setDownloadUrl(status.downloadUrl);
          } else if (status.status === "FAILED") {
            stopPolling();
            setRenderState("failed");
            setRenderError(status.error ?? "Render failed");
          }
        } catch {
          stopPolling();
          setRenderState("failed");
          setRenderError("Failed to check render status");
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const handleRender = async () => {
    stopPolling();
    setRenderState("rendering");
    setRenderProgress(0);
    setRenderError(null);
    setDownloadUrl(null);

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const body = (await response.json()) as
        | { jobId: string }
        | { error: string };

      if (!response.ok || "error" in body) {
        const errorMsg = "error" in body ? body.error : "Failed to start render";
        setRenderState("failed");
        setRenderError(errorMsg);
        return;
      }

      pollStatus(body.jobId);
    } catch {
      setRenderState("failed");
      setRenderError("Failed to start render");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "animation.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isRendering = renderState === "rendering";

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw size={14} />
          Replay
        </button>
      </div>

      <div className="h-4 w-px bg-border" />

      <button
        onClick={handleRender}
        disabled={isRendering}
        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRendering ? (
          <Loader2 size={14} className="animate-spin" />
        ) : null}
        {isRendering ? "Rendering..." : "Render MP4"}
      </button>

      {isRendering && (
        <div className="flex-1 max-w-xs">
          <ProgressBar progress={renderProgress} />
        </div>
      )}

      {renderState === "completed" && downloadUrl && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <Download size={14} />
          Download
        </button>
      )}

      {renderError && (
        <span className="text-xs text-destructive">{renderError}</span>
      )}
    </div>
  );
}
