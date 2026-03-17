"use client";

import React from "react";
import { Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import type { Scene } from "@code-to-animation/animation-core";
import { useProjectStore } from "@/store/useProjectStore";
import { AnimationPicker } from "./AnimationPicker";
import { DurationInput } from "./DurationInput";

interface SceneCardProps {
  scene: Scene;
  index: number;
}

export function SceneCard({ scene, index }: SceneCardProps) {
  const {
    updateSceneText,
    removeScene,
    setAnimationForScene,
    setDurationForScene,
    reorderScenes,
    config,
  } = useProjectStore();

  const isFirst = index === 0;
  const isLast = index === config.scenes.length - 1;
  const canDelete = config.scenes.length > 1;

  return (
    <div className="rounded-lg border border-border bg-card p-3 group">
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center gap-0.5 pt-1">
          <GripVertical size={14} className="text-muted-foreground" />
          <button
            onClick={() => reorderScenes(index, index - 1)}
            disabled={isFirst}
            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={() => reorderScenes(index, index + 1)}
            disabled={isLast}
            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Scene {index + 1}
            </span>
            {canDelete && (
              <button
                onClick={() => removeScene(scene.id)}
                className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <textarea
            value={scene.text}
            onChange={(e) => updateSceneText(scene.id, e.target.value)}
            placeholder="Enter your text..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />

          <div className="flex items-center gap-3 mt-2">
            <AnimationPicker
              value={scene.animation}
              onChange={(anim) => setAnimationForScene(scene.id, anim)}
            />
            <DurationInput
              value={scene.duration}
              onChange={(dur) => setDurationForScene(scene.id, dur)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
