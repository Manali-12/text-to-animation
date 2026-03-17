import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene, GlobalStyles } from "@code-to-animation/animation-core";
import { getAnimatedStyle, getTypewriterText } from "./animations/remotion-animations";

interface TextSceneProps {
  scene: Scene;
  globalStyles: GlobalStyles;
}

export const TextScene: React.FC<TextSceneProps> = ({ scene, globalStyles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const style = getAnimatedStyle(scene.animation, frame, fps, scene.duration);

  const isTypewriter = scene.animation === "typewriter";
  const typewriter = isTypewriter
    ? getTypewriterText(scene.text, frame, fps, scene.duration)
    : null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: globalStyles.backgroundColor,
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontFamily: `'${globalStyles.fontFamily}', sans-serif`,
          fontSize: globalStyles.fontSize,
          color: globalStyles.textColor,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: "80%",
          wordBreak: "break-word",
          opacity: style.opacity,
          transform: style.transform,
          filter: style.filter,
        }}
      >
        {isTypewriter && typewriter ? (
          <span>
            {typewriter.visibleText}
            {typewriter.showCursor && (
              <span style={{ borderRight: `3px solid ${globalStyles.textColor}`, paddingRight: 2 }} />
            )}
          </span>
        ) : (
          scene.text
        )}
      </div>
    </div>
  );
};
