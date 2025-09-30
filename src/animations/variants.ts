import { tokens } from '../brand/tokens'

// Minimalist fade effects
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: tokens.timing.base,
      ease: tokens.easing.primary
    } 
  }
}

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: tokens.timing.slow,
      ease: tokens.easing.zoetrope
    } 
  }
}

// Dramatic entrance effects
export const dramaticReveal = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 40,
    filter: "blur(8px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: tokens.timing.dramatic,
      ease: tokens.easing.dramatic
    } 
  }
}

// Zoetrope-style stagger animations
export const staggerGrid = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.12,
      delayChildren: 0.1
    } 
  }
}

export const cinematicStagger = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.2,
      duration: tokens.timing.cinematic
    } 
  }
}

// Impact animations for numbers/metrics
export const impactNumber = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    rotateX: -15 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: { 
      duration: tokens.timing.slow,
      ease: tokens.easing.bounce,
      delay: 0.3
    } 
  }
}

// Subtle breathing/pulse effect
export const subtlePulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, tokens.scale.subtle, 1],
    transition: {
      duration: tokens.timing.cinematic,
      repeat: Infinity,
      ease: tokens.easing.linear
    }
  }
}

// Cinematic slide effects
export const slideFromLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: tokens.timing.base,
      ease: tokens.easing.zoetrope
    }
  }
}

export const slideFromRight = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: tokens.timing.base,
      ease: tokens.easing.zoetrope
    }
  }
}
