"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AVAILABLE_FONTS, type FontFamily } from "@code-to-animation/animation-core";
import { useProjectStore } from "@/store/useProjectStore";

export function GlobalStylesPanel() {
  const { config, updateGlobalStyles } = useProjectStore();
  const { globalStyles } = config;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Global Styles
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              Font Family
            </label>
            <select
              value={globalStyles.fontFamily}
              onChange={(e) =>
                updateGlobalStyles({ fontFamily: e.target.value as FontFamily })
              }
              className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
            >
              {AVAILABLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={globalStyles.backgroundColor}
                  onChange={(e) =>
                    updateGlobalStyles({ backgroundColor: e.target.value })
                  }
                  className="w-8 h-8 rounded border border-input cursor-pointer"
                />
                <input
                  type="text"
                  value={globalStyles.backgroundColor}
                  onChange={(e) =>
                    updateGlobalStyles({ backgroundColor: e.target.value })
                  }
                  className="flex-1 px-2 py-1.5 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground font-mono"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={globalStyles.textColor}
                  onChange={(e) =>
                    updateGlobalStyles({ textColor: e.target.value })
                  }
                  className="w-8 h-8 rounded border border-input cursor-pointer"
                />
                <input
                  type="text"
                  value={globalStyles.textColor}
                  onChange={(e) =>
                    updateGlobalStyles({ textColor: e.target.value })
                  }
                  className="flex-1 px-2 py-1.5 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              Font Size: {globalStyles.fontSize}px
            </label>
            <input
              type="range"
              min={16}
              max={120}
              value={globalStyles.fontSize}
              onChange={(e) =>
                updateGlobalStyles({ fontSize: parseInt(e.target.value, 10) })
              }
              className="w-full accent-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
