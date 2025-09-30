export const tokens = {
  timing: {
    instant: 0.08,
    fast: 0.15,
    base: 0.4,
    slow: 0.8,
    dramatic: 1.2,
    cinematic: 2.0
  },
  easing: {
    primary: [0.25, 0.1, 0.25, 1], // Smooth ease
    dramatic: [0.68, -0.55, 0.265, 1.55], // Overshoot for impact
    zoetrope: [0.645, 0.045, 0.355, 1], // Cinematic easing
    bounce: [0.68, -0.6, 0.32, 1.6], // Playful bounce
    linear: [0, 0, 1, 1] // Linear for mechanical effects
  },
  scale: {
    subtle: 1.02,
    medium: 1.05,
    dramatic: 1.1,
    hero: 1.15
  },
  blur: {
    soft: 4,
    medium: 8,
    dramatic: 16
  }
} as const;
