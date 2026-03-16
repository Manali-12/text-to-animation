import React from "react";
import { Composition } from "remotion";
import { AnimationComposition } from "./Composition";
import {
  DEFAULT_PROJECT_CONFIG,
  DEFAULT_RENDER_CONFIG,
  getTotalDurationSeconds,
  secondsToFrames,
} from "@code-to-animation/animation-core";

export const RemotionRoot: React.FC = () => {
  const fps = DEFAULT_PROJECT_CONFIG.fps;
  const durations = DEFAULT_PROJECT_CONFIG.scenes.map((s) => s.duration);
  const totalDuration = getTotalDurationSeconds(durations);
  const totalFrames = secondsToFrames(totalDuration, fps);

  return (
    <>
      <Composition
        id="TextAnimation"
        component={AnimationComposition}
        durationInFrames={totalFrames}
        fps={fps}
        width={DEFAULT_RENDER_CONFIG.width}
        height={DEFAULT_RENDER_CONFIG.height}
        defaultProps={{
          config: DEFAULT_PROJECT_CONFIG,
        }}
      />
    </>
  );
};
