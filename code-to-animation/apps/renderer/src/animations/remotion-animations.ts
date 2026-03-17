import { interpolate, spring, Easing } from "remotion";
import {
  type AnimationId,
  ANIMATION_PRESETS,
  getAnimationFrames,
} from "@code-to-animation/animation-core";

interface AnimatedStyle {
  opacity: number;
  transform: string;
  filter: string;
}

interface TypewriterResult {
  visibleText: string;
  showCursor: boolean;
}

export function getAnimatedStyle(
  animationId: AnimationId,
  frame: number,
  fps: number,
  durationInSeconds: number
): AnimatedStyle {
  const preset = ANIMATION_PRESETS[animationId];
  const { enterFrames, totalFrames } = getAnimationFrames(durationInSeconds, fps);
  const remotionParams = preset.remotion;

  const exitStart = Math.round(totalFrames * 0.9);
  const exitEnd = totalFrames;

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  let blur = 0;

  if (animationId === "typewriter") {
    opacity = 1;
    const exitOpacity = frame >= exitStart
      ? interpolate(frame, [exitStart, exitEnd], [1, 0], { extrapolateRight: "clamp" })
      : 1;
    return {
      opacity: exitOpacity,
      transform: "none",
      filter: "none",
    };
  }

  if (remotionParams.easing === "spring") {
    const springValue = spring({
      frame,
      fps,
      config: remotionParams.springConfig ?? {
        damping: 15,
        mass: 1,
        stiffness: 80,
        overshootClamping: false,
      },
      durationInFrames: enterFrames,
    });

    if (remotionParams.from.opacity !== undefined) {
      opacity = interpolate(springValue, [0, 1], [remotionParams.from.opacity, remotionParams.to.opacity]);
    }
    if (remotionParams.from.translateX !== undefined) {
      translateX = interpolate(springValue, [0, 1], [remotionParams.from.translateX, remotionParams.to.translateX]);
    }
    if (remotionParams.from.translateY !== undefined) {
      translateY = interpolate(springValue, [0, 1], [remotionParams.from.translateY, remotionParams.to.translateY]);
    }
    if (remotionParams.from.scale !== undefined) {
      scale = interpolate(springValue, [0, 1], [remotionParams.from.scale, remotionParams.to.scale]);
    }
    if (remotionParams.from.blur !== undefined) {
      blur = interpolate(springValue, [0, 1], [remotionParams.from.blur, remotionParams.to.blur]);
    }
  } else {
    const easingFn = remotionParams.easing === "easeOut" ? Easing.out(Easing.quad) :
                     remotionParams.easing === "easeInOut" ? Easing.inOut(Easing.quad) :
                     (x: number) => x;

    if (remotionParams.from.opacity !== undefined) {
      opacity = interpolate(frame, [0, enterFrames], [remotionParams.from.opacity, remotionParams.to.opacity], {
        extrapolateRight: "clamp",
        easing: easingFn,
      });
    }
    if (remotionParams.from.blur !== undefined) {
      blur = interpolate(frame, [0, enterFrames], [remotionParams.from.blur, remotionParams.to.blur], {
        extrapolateRight: "clamp",
        easing: easingFn,
      });
    }
  }

  const exitOpacity = frame >= exitStart
    ? interpolate(frame, [exitStart, exitEnd], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return {
    opacity: opacity * exitOpacity,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
    filter: blur > 0 ? `blur(${blur}px)` : "none",
  };
}

export function getTypewriterText(
  text: string,
  frame: number,
  fps: number,
  durationInSeconds: number
): TypewriterResult {
  const { enterFrames, totalFrames } = getAnimationFrames(durationInSeconds, fps);
  const progress = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  const charCount = Math.floor(progress * text.length);
  const visibleText = text.substring(0, charCount);
  const showCursor = frame < totalFrames * 0.9;

  return { visibleText, showCursor };
}
