import React from "react";
import { Series, useVideoConfig } from "remotion";
import type { ProjectConfig } from "@code-to-animation/animation-core";
import { secondsToFrames } from "@code-to-animation/animation-core";
import { TextScene } from "./TextScene";

interface CompositionProps {
  config: ProjectConfig;
}

export const AnimationComposition: React.FC<CompositionProps> = ({ config }) => {
  const { fps } = useVideoConfig();

  return (
    <Series>
      {config.scenes.map((scene) => (
        <Series.Sequence
          key={scene.id}
          durationInFrames={secondsToFrames(scene.duration, fps)}
        >
          <TextScene scene={scene} globalStyles={config.globalStyles} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
