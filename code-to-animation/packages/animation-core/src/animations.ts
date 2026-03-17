import { AnimationId, AnimationPreset } from "./types";

export const ANIMATION_PRESETS: Record<AnimationId, AnimationPreset> = {
  fade: {
    id: "fade",
    label: "Fade In",
    gsap: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      ease: "power2.out",
    },
    remotion: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      easing: "easeOut",
    },
  },
  slideUp: {
    id: "slideUp",
    label: "Slide Up",
    gsap: {
      from: { opacity: 0, y: 80 },
      to: { opacity: 1, y: 0 },
      ease: "power3.out",
    },
    remotion: {
      from: { opacity: 0, translateY: 80 },
      to: { opacity: 1, translateY: 0 },
      easing: "spring",
      springConfig: {
        damping: 15,
        mass: 1,
        stiffness: 80,
        overshootClamping: false,
      },
    },
  },
  slideLeft: {
    id: "slideLeft",
    label: "Slide Left",
    gsap: {
      from: { opacity: 0, x: 100 },
      to: { opacity: 1, x: 0 },
      ease: "power3.out",
    },
    remotion: {
      from: { opacity: 0, translateX: 100 },
      to: { opacity: 1, translateX: 0 },
      easing: "spring",
      springConfig: {
        damping: 15,
        mass: 1,
        stiffness: 80,
        overshootClamping: false,
      },
    },
  },
  zoomIn: {
    id: "zoomIn",
    label: "Zoom In",
    gsap: {
      from: { opacity: 0, scale: 0.5 },
      to: { opacity: 1, scale: 1 },
      ease: "back.out(1.4)",
    },
    remotion: {
      from: { opacity: 0, scale: 0.5 },
      to: { opacity: 1, scale: 1 },
      easing: "spring",
      springConfig: {
        damping: 12,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
      },
    },
  },
  typewriter: {
    id: "typewriter",
    label: "Typewriter",
    gsap: {
      from: { opacity: 1, width: "0%" },
      to: { opacity: 1, width: "100%" },
      ease: "steps(20)",
    },
    remotion: {
      from: { charIndex: 0 },
      to: { charIndex: 1 },
      easing: "linear",
    },
  },
  blurIn: {
    id: "blurIn",
    label: "Blur In",
    gsap: {
      from: { opacity: 0, filter: "blur(20px)" },
      to: { opacity: 1, filter: "blur(0px)" },
      ease: "power2.out",
    },
    remotion: {
      from: { opacity: 0, blur: 20 },
      to: { opacity: 1, blur: 0 },
      easing: "easeOut",
    },
  },
};

export const ANIMATION_OPTIONS: { id: AnimationId; label: string }[] =
  Object.values(ANIMATION_PRESETS).map((preset) => ({
    id: preset.id,
    label: preset.label,
  }));
