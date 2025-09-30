import React from 'react';
import { motion, MotionProps } from 'framer-motion';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export type CardPadding = 'small' | 'medium' | 'large' | 'xl';
export type CardShadow = 'card' | 'elevated' | 'dramatic' | 'none';
export type CardBorderRadius = 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type CardBackground = 'gradient' | 'solid' | 'pattern' | 'transparent';
export type CardColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';

export interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  
  // Layout props
  padding?: CardPadding;
  shadow?: CardShadow;
  borderRadius?: CardBorderRadius;
  background?: CardBackground;
  backgroundColor?: string;
  color?: CardColor;
  
  // Animation props
  animate?: boolean;
  animationDelay?: number;
  animationDuration?: number;
  
  // Layout props
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  
  // Interaction props
  hover?: boolean;
  clickable?: boolean;
  
  // Accessibility props
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  // Custom motion props
  motionProps?: MotionProps;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

const getPaddingClasses = (padding: CardPadding): string => {
  const paddingMap = {
    small: 'p-card-small',
    medium: 'p-card-medium', 
    large: 'p-card-large',
    xl: 'p-card-xl'
  };
  return paddingMap[padding];
};

const getShadowClasses = (shadow: CardShadow): string => {
  const shadowMap = {
    none: '',
    card: 'shadow-card',
    elevated: 'shadow-elevated',
    dramatic: 'shadow-dramatic'
  };
  return shadowMap[shadow];
};

const getBorderRadiusClasses = (radius: CardBorderRadius): string => {
  const radiusMap = {
    sm: 'rounded-sm',
    base: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  };
  return radiusMap[radius];
};

const getBackgroundClasses = (
  background: CardBackground, 
  backgroundColor?: string,
  color?: CardColor
): string => {
  if (background === 'transparent') {
    return 'bg-transparent';
  }
  
  if (background === 'solid' && backgroundColor) {
    return `bg-[${backgroundColor}]`;
  }
  
  if (background === 'solid' && color) {
    const colorMap = {
      primary: 'bg-blue-50',
      secondary: 'bg-purple-50',
      accent: 'bg-orange-50',
      success: 'bg-green-50',
      warning: 'bg-yellow-50',
      error: 'bg-red-50',
      neutral: 'bg-gray-50'
    };
    return colorMap[color];
  }
  
  if (background === 'pattern') {
    return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';
  }
  
  // Default gradient
  const gradientMap = {
    primary: 'bg-gradient-to-br from-blue-500 to-purple-600',
    secondary: 'bg-gradient-to-br from-purple-500 to-pink-600',
    accent: 'bg-gradient-to-br from-orange-500 to-red-600',
    success: 'bg-gradient-to-br from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    error: 'bg-gradient-to-br from-red-500 to-pink-600',
    neutral: 'bg-gradient-to-br from-gray-500 to-gray-700'
  };
  
  return gradientMap[color || 'primary'];
};

const getTextColorClasses = (color?: CardColor, background?: CardBackground): string => {
  if (background === 'gradient' || background === 'pattern') {
    return 'text-white';
  }
  
  const textColorMap = {
    primary: 'text-blue-900',
    secondary: 'text-purple-900',
    accent: 'text-orange-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    error: 'text-red-900',
    neutral: 'text-gray-900'
  };
  
  return textColorMap[color || 'primary'];
};

// ========================================
// DEFAULT ANIMATION VARIANTS
// ========================================

const defaultAnimationVariants = {
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
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
      staggerChildren: 0.1
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

// ========================================
// MAIN COMPONENT
// ========================================

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = '',
  
  // Layout props
  padding = 'large',
  shadow = 'card',
  borderRadius = '2xl',
  background = 'gradient',
  backgroundColor,
  color = 'primary',
  
  // Animation props
  animate = true,
  animationDelay = 0,
  animationDuration = 0.6,
  
  // Layout props
  width = '100%',
  height = '100%',
  minHeight,
  maxHeight,
  
  // Interaction props
  hover = false,
  clickable = false,
  
  // Accessibility props
  role = 'article',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  
  // Custom motion props
  motionProps,
  
  ...props
}) => {
  // Build CSS classes
  const paddingClass = getPaddingClasses(padding);
  const shadowClass = getShadowClasses(shadow);
  const borderRadiusClass = getBorderRadiusClasses(borderRadius);
  const backgroundClass = getBackgroundClasses(background, backgroundColor, color);
  const textColorClass = getTextColorClasses(color, background);
  
  // Build base classes
  const baseClasses = [
    'relative',
    'overflow-hidden',
    paddingClass,
    shadowClass,
    borderRadiusClass,
    backgroundClass,
    textColorClass,
    'transition-all',
    'duration-normal',
    'ease-out'
  ].filter(Boolean).join(' ');
  
  // Build hover classes
  const hoverClasses = hover ? 'hover:shadow-elevated cursor-pointer' : '';
  const clickableClasses = clickable ? 'cursor-pointer select-none' : '';
  
  // Combine all classes
  const cardClasses = [
    baseClasses,
    hoverClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ');
  
  // Build style object for dynamic properties
  const cardStyle: React.CSSProperties = {
    width,
    height,
    minHeight,
    maxHeight,
    ...props.style
  };
  
  // Prepare motion props
  const finalMotionProps: MotionProps = {
    initial: animate ? 'hidden' : false,
    animate: animate ? 'visible' : false,
    whileHover: hover ? 'hover' : undefined,
    variants: defaultAnimationVariants,
    transition: {
      delay: animationDelay,
      duration: animationDuration,
      ...motionProps?.transition
    },
    ...motionProps
  };
  
  // Choose component type
  const Component = animate ? motion.div : 'div';
  
  // Render the card
  return (
    <Component
      className={cardClasses}
      style={cardStyle}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      {...(animate ? finalMotionProps : {})}
      {...props}
    >
      {/* Background pattern overlay for pattern backgrounds */}
      {background === 'pattern' && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)`
          }}
        />
      )}
      
      {/* Content with relative positioning */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </Component>
  );
};

// ========================================
// EXPORT VARIANTS
// ========================================

// Pre-configured card variants for common use cases
export const HeroCardBase = React.forwardRef<HTMLDivElement, Omit<BaseCardProps, 'padding' | 'shadow' | 'borderRadius'>>((props, ref) => (
  <BaseCard
    ref={ref}
    padding="xl"
    shadow="dramatic"
    borderRadius="3xl"
    background="gradient"
    {...props}
  />
));

export const ContentCardBase = React.forwardRef<HTMLDivElement, Omit<BaseCardProps, 'padding' | 'shadow' | 'borderRadius'>>((props, ref) => (
  <BaseCard
    ref={ref}
    padding="large"
    shadow="elevated"
    borderRadius="2xl"
    background="solid"
    color="neutral"
    {...props}
  />
));

export const MetricCardBase = React.forwardRef<HTMLDivElement, Omit<BaseCardProps, 'padding' | 'shadow' | 'borderRadius'>>((props, ref) => (
  <BaseCard
    ref={ref}
    padding="large"
    shadow="card"
    borderRadius="xl"
    background="solid"
    color="neutral"
    {...props}
  />
));

export const ProcessCardBase = React.forwardRef<HTMLDivElement, Omit<BaseCardProps, 'padding' | 'shadow' | 'borderRadius'>>((props, ref) => (
  <BaseCard
    ref={ref}
    padding="medium"
    shadow="card"
    borderRadius="lg"
    background="solid"
    color="neutral"
    {...props}
  />
));

export const ComparisonCardBase = React.forwardRef<HTMLDivElement, Omit<BaseCardProps, 'padding' | 'shadow' | 'borderRadius'>>((props, ref) => (
  <BaseCard
    ref={ref}
    padding="large"
    shadow="elevated"
    borderRadius="xl"
    background="solid"
    color="neutral"
    {...props}
  />
));

// ========================================
// DEFAULT EXPORT
// ========================================

export default BaseCard;
