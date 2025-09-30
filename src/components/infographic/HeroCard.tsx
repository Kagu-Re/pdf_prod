import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { BaseCard, HeroCardBase, CardColor } from './BaseCard';
import { Icon, IconName, IconWithBackground } from './IconSystem';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface HeroCardProps {
  // Content
  title: string;
  subtitle?: string;
  tagline?: string;
  cta?: string;
  description?: string;
  
  // Visual elements
  logo?: React.ReactNode;
  icon?: IconName;
  decoration?: boolean;
  backgroundPattern?: boolean;
  
  // Styling
  color?: CardColor;
  background?: 'gradient' | 'solid' | 'pattern';
  backgroundColor?: string;
  
  // Animation
  animate?: boolean;
  animationDelay?: number;
  animationDuration?: number;
  
  // Layout
  width?: string | number;
  height?: string | number;
  
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  // Custom motion props
  motionProps?: MotionProps;
}

// ========================================
// ANIMATION VARIANTS
// ========================================

const heroAnimationVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
      staggerChildren: 0.2
    }
  }
};

const badgeVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1] // easeOutBack
    }
  }
};

const titleVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const subtitleVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.7,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.9,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const decorationVariants = {
  hidden: {
    scale: 0,
    rotate: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    rotate: 360,
    opacity: 1,
    transition: {
      delay: 1.2,
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const secondDecorationVariants = {
  hidden: {
    scale: 0,
    rotate: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    rotate: -180,
    opacity: 1,
    transition: {
      delay: 1.4,
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ========================================
// BACKGROUND GRADIENT MAPPING
// ========================================

const getBackgroundGradient = (color: CardColor): string => {
  const gradientMap: Record<CardColor, string> = {
    primary: 'from-blue-600 via-purple-600 to-blue-800',
    secondary: 'from-purple-600 via-pink-600 to-purple-800',
    accent: 'from-orange-600 via-red-600 to-orange-800',
    success: 'from-green-600 via-emerald-600 to-green-800',
    warning: 'from-yellow-600 via-orange-600 to-yellow-800',
    error: 'from-red-600 via-pink-600 to-red-800',
    neutral: 'from-gray-600 via-gray-700 to-gray-800'
  };
  
  return gradientMap[color];
};

// ========================================
// MAIN COMPONENT
// ========================================

export const HeroCard: React.FC<HeroCardProps> = ({
  // Content
  title,
  subtitle,
  tagline,
  cta,
  description,
  
  // Visual elements
  logo,
  icon,
  decoration = true,
  backgroundPattern = true,
  
  // Styling
  color = 'primary',
  background = 'gradient',
  backgroundColor,
  
  // Animation
  animate = true,
  animationDelay = 0,
  animationDuration = 1.2,
  
  // Layout
  width = '100%',
  height = '100%',
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  
  // Custom motion props
  motionProps,
  
  ...props
}) => {
  // Build background classes
  const backgroundClasses = background === 'gradient' 
    ? `bg-gradient-to-br ${getBackgroundGradient(color)}`
    : background === 'pattern'
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : backgroundColor 
    ? `bg-[${backgroundColor}]`
    : `bg-${color}-600`;

  // Combine motion props
  const finalMotionProps: MotionProps = {
    variants: heroAnimationVariants,
    initial: animate ? 'hidden' : false,
    animate: animate ? 'visible' : false,
    transition: {
      delay: animationDelay,
      duration: animationDuration,
      ...motionProps?.transition
    },
    ...motionProps
  };

  return (
    <HeroCardBase
      className={`${backgroundClasses} text-white relative overflow-hidden`}
      color={color}
      background={background}
      backgroundColor={backgroundColor}
      width={width}
      height={height}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      animate={animate}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
      motionProps={finalMotionProps}
      {...props}
    >
      {/* Background Pattern Overlay */}
      {backgroundPattern && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)`
          }}
        />
      )}

      {/* Decorative Elements */}
      {decoration && (
        <>
          <motion.div
            variants={decorationVariants}
            className="absolute top-8 right-8 w-24 h-24 border-2 border-white/20 rounded-full"
          />
          <motion.div
            variants={secondDecorationVariants}
            className="absolute bottom-8 left-8 w-16 h-16 border-2 border-white/20 rounded-full"
          />
          <motion.div
            variants={decorationVariants}
            className="absolute top-1/2 left-8 w-8 h-8 border border-white/10 rounded-full"
          />
          <motion.div
            variants={secondDecorationVariants}
            className="absolute top-1/4 right-1/4 w-4 h-4 bg-white/10 rounded-full"
          />
        </>
      )}

      {/* Logo Section */}
      {logo && (
        <motion.div
          variants={badgeVariants}
          className="mb-8 flex justify-center"
        >
          {logo}
        </motion.div>
      )}

      {/* Main Icon */}
      {icon && !logo && (
        <motion.div
          variants={badgeVariants}
          className="mb-8 flex justify-center"
        >
          <IconWithBackground
            name={icon}
            size="3xl"
            color="white"
            background="subtle"
            backgroundSize="3xl"
            className="bg-white/20"
          />
        </motion.div>
      )}

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col justify-center h-full">
        
        {/* CTA Badge */}
        {cta && (
          <motion.div
            variants={badgeVariants}
            className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/10"
            style={{
              background: `conic-gradient(from 0deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))`
            }}
          >
            <span className="text-white font-medium text-lg tracking-wide">
              {cta}
            </span>
          </motion.div>
        )}

        {/* Main Title */}
        <motion.h1
          variants={titleVariants}
          className="text-6xl font-black mb-6 leading-tight"
          style={{ 
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-family-primary)'
          }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.h2
            variants={subtitleVariants}
            className="text-3xl font-light text-white/90 mb-8"
            style={{ fontFamily: 'var(--font-family-primary)' }}
          >
            {subtitle}
          </motion.h2>
        )}

        {/* Tagline */}
        {tagline && (
          <motion.p
            variants={contentVariants}
            className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-6"
            style={{ fontFamily: 'var(--font-family-primary)' }}
          >
            {tagline}
          </motion.p>
        )}

        {/* Description */}
        {description && (
          <motion.p
            variants={contentVariants}
            className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-family-primary)' }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Bottom Decorative Elements */}
      {decoration && (
        <>
          <motion.div
            variants={decorationVariants}
            className="absolute bottom-20 right-20 w-12 h-12 border border-white/10 rounded-full"
          />
          <motion.div
            variants={secondDecorationVariants}
            className="absolute top-20 left-20 w-6 h-6 bg-white/5 rounded-full"
          />
        </>
      )}
    </HeroCardBase>
  );
};

// ========================================
// PRESET VARIANTS
// ========================================

// Digital Transformation Hero
export const DigitalTransformationHero: React.FC<Omit<HeroCardProps, 'title' | 'subtitle' | 'color'>> = (props) => (
  <HeroCard
    title="Digital Transformation Journey"
    subtitle="From Problem to Future"
    tagline="A comprehensive approach to modernizing your business operations"
    cta="🚀 Start Your Journey"
    icon="rocket"
    color="primary"
    {...props}
  />
);

// Innovation Hero
export const InnovationHero: React.FC<Omit<HeroCardProps, 'title' | 'subtitle' | 'color'>> = (props) => (
  <HeroCard
    title="Innovation at Scale"
    subtitle="Transforming Ideas into Impact"
    tagline="Unlock your organization's potential with cutting-edge solutions"
    cta="💡 Innovate Now"
    icon="idea"
    color="accent"
    {...props}
  />
);

// Success Hero
export const SuccessHero: React.FC<Omit<HeroCardProps, 'title' | 'subtitle' | 'color'>> = (props) => (
  <HeroCard
    title="Achieving Success"
    subtitle="Measurable Results, Real Impact"
    tagline="Data-driven strategies that deliver exceptional outcomes"
    cta="📈 View Results"
    icon="trending-up"
    color="success"
    {...props}
  />
);

// Security Hero
export const SecurityHero: React.FC<Omit<HeroCardProps, 'title' | 'subtitle' | 'color'>> = (props) => (
  <HeroCard
    title="Enterprise Security"
    subtitle="Protecting What Matters Most"
    tagline="Advanced security solutions for the modern enterprise"
    cta="🛡️ Secure Now"
    icon="security"
    color="warning"
    {...props}
  />
);

// ========================================
// DEFAULT EXPORT
// ========================================

export default HeroCard;
