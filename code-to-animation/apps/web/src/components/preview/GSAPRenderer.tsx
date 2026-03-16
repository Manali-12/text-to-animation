"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { buildTimeline } from "@/lib/gsap-preview";

export function GSAPRenderer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { config, isPlaying, setIsPlaying, setActiveSceneIndex } =
    useProjectStore();

  const buildAndPlay = useCallback(() => {
    if (!containerRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    if (config.scenes.length === 0) return;

    const tl = buildTimeline(
      config.scenes,
      config.globalStyles,
      containerRef.current,
      (index: number) => setActiveSceneIndex(index)
    );

    tl.eventCallback("onComplete", () => {
      setIsPlaying(false);
      setActiveSceneIndex(0);
    });

    timelineRef.current = tl;

    if (isPlaying) {
      tl.play();
    }
  }, [config, isPlaying, setIsPlaying, setActiveSceneIndex]);

  useEffect(() => {
    buildAndPlay();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [config]);

  useEffect(() => {
    if (!timelineRef.current) return;

    if (isPlaying) {
      if (timelineRef.current.progress() >= 1) {
        timelineRef.current.restart();
      } else {
        timelineRef.current.play();
      }
    } else {
      timelineRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ position: "relative", width: "100%", height: "100%" }}
    />
  );
}
