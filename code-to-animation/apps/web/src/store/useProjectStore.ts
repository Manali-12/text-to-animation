"use client";

import { create } from "zustand";
import {
  type ProjectConfig,
  type Scene,
  type GlobalStyles,
  type AnimationId,
  DEFAULT_PROJECT_CONFIG,
  createScene,
} from "@code-to-animation/animation-core";

interface ProjectStore {
  config: ProjectConfig;
  isPlaying: boolean;
  activeSceneIndex: number;

  addScene: () => void;
  removeScene: (sceneId: string) => void;
  updateSceneText: (sceneId: string, text: string) => void;
  setAnimationForScene: (sceneId: string, animation: AnimationId) => void;
  setDurationForScene: (sceneId: string, duration: number) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  setFps: (fps: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setActiveSceneIndex: (index: number) => void;
  resetToDefault: () => void;
  loadConfig: (config: ProjectConfig) => void;
}

function reindexScenes(scenes: Scene[]): Scene[] {
  return scenes.map((scene, index) => ({ ...scene, order: index }));
}

export const useProjectStore = create<ProjectStore>((set) => ({
  config: structuredClone(DEFAULT_PROJECT_CONFIG),
  isPlaying: false,
  activeSceneIndex: 0,

  addScene: () =>
    set((state) => {
      const newScene = createScene();
      const scenes = [...state.config.scenes, newScene];
      return {
        config: {
          ...state.config,
          scenes: reindexScenes(scenes),
        },
      };
    }),

  removeScene: (sceneId: string) =>
    set((state) => {
      const scenes = state.config.scenes.filter((s) => s.id !== sceneId);
      if (scenes.length === 0) return state;
      return {
        config: {
          ...state.config,
          scenes: reindexScenes(scenes),
        },
      };
    }),

  updateSceneText: (sceneId: string, text: string) =>
    set((state) => ({
      config: {
        ...state.config,
        scenes: state.config.scenes.map((s) =>
          s.id === sceneId ? { ...s, text } : s
        ),
      },
    })),

  setAnimationForScene: (sceneId: string, animation: AnimationId) =>
    set((state) => ({
      config: {
        ...state.config,
        scenes: state.config.scenes.map((s) =>
          s.id === sceneId ? { ...s, animation } : s
        ),
      },
    })),

  setDurationForScene: (sceneId: string, duration: number) =>
    set((state) => ({
      config: {
        ...state.config,
        scenes: state.config.scenes.map((s) =>
          s.id === sceneId ? { ...s, duration } : s
        ),
      },
    })),

  reorderScenes: (fromIndex: number, toIndex: number) =>
    set((state) => {
      const scenes = [...state.config.scenes];
      const [moved] = scenes.splice(fromIndex, 1);
      scenes.splice(toIndex, 0, moved);
      return {
        config: {
          ...state.config,
          scenes: reindexScenes(scenes),
        },
      };
    }),

  updateGlobalStyles: (styles: Partial<GlobalStyles>) =>
    set((state) => ({
      config: {
        ...state.config,
        globalStyles: { ...state.config.globalStyles, ...styles },
      },
    })),

  setFps: (fps: number) =>
    set((state) => ({
      config: { ...state.config, fps },
    })),

  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),

  setActiveSceneIndex: (index: number) => set({ activeSceneIndex: index }),

  resetToDefault: () =>
    set({
      config: structuredClone(DEFAULT_PROJECT_CONFIG),
      isPlaying: false,
      activeSceneIndex: 0,
    }),

  loadConfig: (config: ProjectConfig) =>
    set({ config, isPlaying: false, activeSceneIndex: 0 }),
}));
