"use client";

import React from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { GSAPRenderer } from "./GSAPRenderer";

export function PreviewPanel() {
  const { config, isPlaying, activeSceneIndex } = useProjectStore();
  const totalScenes = config.scenes.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <h2 className="text-sm font-semibold text-foreground">Preview</h2>
        <span className="text-xs text-muted-foreground">
          Scene {activeSceneIndex + 1} / {totalScenes}
          {isPlaying ? " — Playing" : " — Paused"}
        </span>
      </div>
      <div
        className="flex-1 relative overflow-hidden"
        style={{ backgroundColor: config.globalStyles.backgroundColor }}
      >
        <GSAPRenderer />
      </div>
    </div>
  );
}
