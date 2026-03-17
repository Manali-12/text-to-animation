"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { SceneCard } from "./SceneCard";

export function SceneEditor() {
  const { config, addScene } = useProjectStore();

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Scenes</h2>
        <button
          onClick={addScene}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          Add Scene
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {config.scenes.map((scene, index) => (
          <SceneCard key={scene.id} scene={scene} index={index} />
        ))}
      </div>
      {config.scenes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No scenes yet. Click &quot;Add Scene&quot; to get started.
        </div>
      )}
    </div>
  );
}
