"use client";

import React from "react";
import {
  type AnimationId,
  ANIMATION_OPTIONS,
} from "@code-to-animation/animation-core";

interface AnimationPickerProps {
  value: AnimationId;
  onChange: (animation: AnimationId) => void;
}

export function AnimationPicker({ value, onChange }: AnimationPickerProps) {
  return (
    <div className="flex-1">
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
        Animation
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AnimationId)}
        className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
      >
        {ANIMATION_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
