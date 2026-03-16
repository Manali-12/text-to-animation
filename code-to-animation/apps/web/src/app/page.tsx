"use client";

import { SplitLayout } from "@/components/layout/SplitLayout";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { SceneEditor } from "@/components/editor/SceneEditor";
import { GlobalStylesPanel } from "@/components/controls/GlobalStylesPanel";
import { RenderControls } from "@/components/controls/RenderControls";

export default function HomePage() {
  return (
    <SplitLayout
      left={<PreviewPanel />}
      right={
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex items-center px-4 py-2 border-b border-border bg-card">
            <h2 className="text-sm font-semibold text-foreground">Editor</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SceneEditor />
            <GlobalStylesPanel />
          </div>
        </div>
      }
      bottom={<RenderControls />}
    />
  );
}
