"use client";

import React, { useState, useCallback } from "react";

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  bottom: React.ReactNode;
}

export function SplitLayout({ left, right, bottom }: SplitLayoutProps) {
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.min(Math.max((x / rect.width) * 100, 25), 75);
      setSplitPercent(percent);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div
        className="flex flex-1 min-h-0"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative overflow-hidden"
          style={{ width: `${splitPercent}%` }}
        >
          {left}
        </div>

        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={handleMouseDown}
        />

        <div className="flex-1 overflow-hidden">{right}</div>
      </div>

      <div className="border-t border-border">{bottom}</div>
    </div>
  );
}
