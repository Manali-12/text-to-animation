"use client";

import gsap from "gsap";
import {
  type Scene,
  type GlobalStyles,
  ANIMATION_PRESETS,
  ANIMATION_ENTER_RATIO,
} from "@code-to-animation/animation-core";

export function buildTimeline(
  scenes: Scene[],
  globalStyles: GlobalStyles,
  containerEl: HTMLElement,
  onSceneChange?: (index: number) => void
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });

  containerEl.innerHTML = "";

  scenes.forEach((scene, index) => {
    const sceneEl = document.createElement("div");
    sceneEl.className = "scene-element";
    sceneEl.style.position = "absolute";
    sceneEl.style.inset = "0";
    sceneEl.style.display = "flex";
    sceneEl.style.alignItems = "center";
    sceneEl.style.justifyContent = "center";
    sceneEl.style.padding = "2rem";
    sceneEl.style.opacity = "0";

    const textEl = document.createElement("div");
    textEl.style.fontFamily = `'${globalStyles.fontFamily}', sans-serif`;
    textEl.style.fontSize = `${globalStyles.fontSize}px`;
    textEl.style.color = globalStyles.textColor;
    textEl.style.textAlign = "center";
    textEl.style.lineHeight = "1.3";
    textEl.style.maxWidth = "80%";
    textEl.style.wordBreak = "break-word";

    if (scene.animation === "typewriter") {
      textEl.style.overflow = "hidden";
      textEl.style.whiteSpace = "nowrap";
      textEl.style.borderRight = `3px solid ${globalStyles.textColor}`;
      textEl.textContent = scene.text;
    } else {
      textEl.textContent = scene.text;
    }

    sceneEl.appendChild(textEl);
    containerEl.appendChild(sceneEl);

    const preset = ANIMATION_PRESETS[scene.animation];
    const enterDuration = scene.duration * ANIMATION_ENTER_RATIO;
    const holdEnd = scene.duration * 0.9;
    const exitDuration = scene.duration * 0.1;

    const sceneLabel = `scene-${index}`;
    tl.addLabel(sceneLabel);

    if (onSceneChange) {
      tl.call(() => onSceneChange(index), [], sceneLabel);
    }

    if (scene.animation === "typewriter") {
      tl.set(sceneEl, { opacity: 1 }, sceneLabel);
      tl.fromTo(
        textEl,
        { width: "0%" },
        {
          width: "100%",
          duration: enterDuration,
          ease: "steps(20)",
        },
        sceneLabel
      );
      tl.to(
        sceneEl,
        { opacity: 0, duration: exitDuration },
        `${sceneLabel}+=${holdEnd}`
      );
    } else {
      tl.fromTo(
        sceneEl,
        { ...preset.gsap.from },
        {
          ...preset.gsap.to,
          duration: enterDuration,
          ease: preset.gsap.ease,
        },
        sceneLabel
      );
      tl.to(
        sceneEl,
        { opacity: 0, duration: exitDuration },
        `${sceneLabel}+=${holdEnd}`
      );
    }
  });

  return tl;
}
