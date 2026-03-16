"use client";

import React from "react";
import {
  MIN_SCENE_DURATION,
  MAX_SCENE_DURATION,
} from "@code-to-animation/animation-core";

interface DurationInputProps {
  value: number;
  onChange: (duration: number) => void;
}

export function DurationInput({ value, onChange }: DurationInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    if (isNaN(raw)) return;
    const clamped = Math.min(
      Math.max(raw, MIN_SCENE_DURATION),
      MAX_SCENE_DURATION
    );
    onChange(clamped);
  };

  return (
    <div className="w-24">
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
        Duration (s)
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={MIN_SCENE_DURATION}
        max={MAX_SCENE_DURATION}
        step={0.5}
        className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
      />
    </div>
  );
}
