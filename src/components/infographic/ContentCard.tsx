import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { BaseCard, ContentCardBase, CardColor } from './BaseCard';
import { Icon, IconName, IconWithBackground } from './IconSystem';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface Statistic {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface DataPoint {
  text: string;
  highlight?: boolean;
  icon?: IconName;
}

export interface ContentCardProps {
  // Content
  title: string;
  subtitle?: string;
  content: string;
  description?: string;
  
  // Visual elements
  icon?: IconName;
  statistics?: Statistic[];
  dataPoints?: DataPoint[];
  
  // Call to action
  cta?: string;
  ctaIcon?: IconName;
  onCtaClick?: () => void;
  
  // Styling
  color?: CardColor;
  background?: 'solid' | 'gradient' | 'pattern';
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

const contentAnimationVariants = {
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
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

const headerVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const iconVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.2,
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1] // easeOutBack
    }
  }
};

const titleVariants = {
  hidden: {
    opacity: 0,
    x: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.6,
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
      delay: 0.5,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const dataPointVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const statisticsVariants = {
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
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const ctaVariants = {
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
      delay: 0.8,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

const getColorClasses = (color: CardColor): {
  text: string;
  icon: string;
  iconBg: string;
  cta: string;
  ctaBg: string;
  statBg: string;
  statBorder: string;
} => {
  const colorMap = {
    primary: {
      text: 'text-blue-900',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      cta: 'text-blue-600',
      ctaBg: 'bg-blue-50 hover:bg-blue-100',
      statBg: 'bg-blue-50',
      statBorder: 'border-blue-200'
    },
    secondary: {
      text: 'text-purple-900',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100',
      cta: 'text-purple-600',
      ctaBg: 'bg-purple-50 hover:bg-purple-100',
      statBg: 'bg-purple-50',
      statBorder: 'border-purple-200'
    },
    accent: {
      text: 'text-orange-900',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
      cta: 'text-orange-600',
      ctaBg: 'bg-orange-50 hover:bg-orange-100',
      statBg: 'bg-orange-50',
      statBorder: 'border-orange-200'
    },
    success: {
      text: 'text-green-900',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
      cta: 'text-green-600',
      ctaBg: 'bg-green-50 hover:bg-green-100',
      statBg: 'bg-green-50',
      statBorder: 'border-green-200'
    },
    warning: {
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      cta: 'text-yellow-600',
      ctaBg: 'bg-yellow-50 hover:bg-yellow-100',
      statBg: 'bg-yellow-50',
      statBorder: 'border-yellow-200'
    },
    error: {
      text: 'text-red-900',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      cta: 'text-red-600',
      ctaBg: 'bg-red-50 hover:bg-red-100',
      statBg: 'bg-red-50',
      statBorder: 'border-red-200'
    },
    neutral: {
      text: 'text-gray-900',
      icon: 'text-gray-600',
      iconBg: 'bg-gray-100',
      cta: 'text-gray-600',
      ctaBg: 'bg-gray-50 hover:bg-gray-100',
      statBg: 'bg-gray-50',
      statBorder: 'border-gray-200'
    }
  };
  
  return colorMap[color];
};

const getTrendIcon = (trend: 'up' | 'down' | 'neutral'): string => {
  const trendMap = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };
  return trendMap[trend];
};

const getTrendColor = (trend: 'up' | 'down' | 'neutral'): string => {
  const colorMap = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };
  return colorMap[trend];
};

// ========================================
// MAIN COMPONENT
// ========================================

export const ContentCard: React.FC<ContentCardProps> = ({
  // Content
  title,
  subtitle,
  content,
  description,
  
  // Visual elements
  icon,
  statistics,
  dataPoints,
  
  // Call to action
  cta,
  ctaIcon,
  onCtaClick,
  
  // Styling
  color = 'primary',
  background = 'solid',
  backgroundColor,
  
  // Animation
  animate = true,
  animationDelay = 0,
  animationDuration = 0.6,
  
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
  const colors = getColorClasses(color);

  // Combine motion props
  const finalMotionProps: MotionProps = {
    variants: contentAnimationVariants,
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
    <ContentCardBase
      className={`${colors.text} relative`}
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
      <div className="flex flex-col h-full">
        
        {/* Header Section */}
        <motion.div 
          variants={headerVariants}
          className="flex items-start gap-6 mb-6"
        >
          {/* Icon */}
          {icon && (
            <motion.div
              variants={iconVariants}
              className={`w-16 h-16 rounded-xl ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon 
                name={icon} 
                size="xl" 
                color={color}
                className={colors.icon}
              />
            </motion.div>
          )}

          {/* Title Section */}
          <div className="flex-1">
            <motion.h2
              variants={titleVariants}
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-family-primary)' }}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.h3
                variants={titleVariants}
                className="text-lg font-medium text-gray-600"
                style={{ fontFamily: 'var(--font-family-primary)' }}
              >
                {subtitle}
              </motion.h3>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          variants={contentVariants}
          className="flex-1 mb-6"
        >
          <p 
            className="text-gray-700 leading-relaxed mb-4"
            style={{ fontFamily: 'var(--font-family-primary)' }}
          >
            {content}
          </p>

          {description && (
            <p 
              className="text-gray-600 leading-relaxed text-sm"
              style={{ fontFamily: 'var(--font-family-primary)' }}
            >
              {description}
            </p>
          )}

          {/* Data Points */}
          {dataPoints && dataPoints.length > 0 && (
            <div className="mt-6 space-y-3">
              {dataPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={dataPointVariants}
                  custom={index}
                  className={`flex items-center text-gray-600 ${
                    point.highlight ? 'font-medium text-gray-800' : ''
                  }`}
                  style={{ fontFamily: 'var(--font-family-primary)' }}
                >
                  {point.icon ? (
                    <Icon 
                      name={point.icon} 
                      size="sm" 
                      color="neutral"
                      className="mr-3 flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${colors.icon} mr-3 flex-shrink-0`} />
                  )}
                  <span>{point.text}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Statistics Section */}
        {statistics && statistics.length > 0 && (
          <motion.div
            variants={statisticsVariants}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            {statistics.map((stat, index) => (
              <div
                key={index}
                className={`${colors.statBg} rounded-lg p-4 border ${colors.statBorder}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'var(--font-family-primary)' }}
                  >
                    {stat.label}
                  </span>
                  {stat.trend && (
                    <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                      {getTrendIcon(stat.trend)}
                    </span>
                  )}
                </div>
                <div 
                  className={`text-xl font-bold ${colors.text}`}
                  style={{ fontFamily: 'var(--font-family-primary)' }}
                >
                  {stat.value}
                </div>
                {stat.description && (
                  <div 
                    className="text-xs text-gray-500 mt-1"
                    style={{ fontFamily: 'var(--font-family-primary)' }}
                  >
                    {stat.description}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        {cta && (
          <motion.div
            variants={ctaVariants}
            className="mt-auto"
          >
            <button 
              className={`w-full py-3 px-6 ${colors.cta} ${colors.ctaBg} rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
              onClick={onCtaClick}
              style={{ fontFamily: 'var(--font-family-primary)' }}
            >
              {ctaIcon && <Icon name={ctaIcon} size="sm" color={color} />}
              {cta}
            </button>
          </motion.div>
        )}
      </div>
    </ContentCardBase>
  );
};

// ========================================
// PRESET VARIANTS
// ========================================

// Problem Card
export const ProblemCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="The Problem"
    icon="alert"
    color="error"
    cta="Learn More"
    ctaIcon="arrow-right"
    {...props}
  />
);

// Discovery Card
export const DiscoveryCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="The Discovery"
    icon="search"
    color="success"
    cta="Explore"
    ctaIcon="arrow-right"
    {...props}
  />
);

// Solution Card
export const SolutionCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="The Solution"
    icon="success"
    color="primary"
    cta="Get Started"
    ctaIcon="arrow-right"
    {...props}
  />
);

// Implementation Card
export const ImplementationCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="The Implementation"
    icon="settings"
    color="warning"
    cta="View Details"
    ctaIcon="arrow-right"
    {...props}
  />
);

// Future Card
export const FutureCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="The Future"
    icon="trending-up"
    color="secondary"
    cta="Plan Ahead"
    ctaIcon="arrow-right"
    {...props}
  />
);

// Business Card
export const BusinessCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="Business Impact"
    icon="business"
    color="primary"
    cta="View Results"
    ctaIcon="chart"
    {...props}
  />
);

// Technology Card
export const TechnologyCard: React.FC<Omit<ContentCardProps, 'title' | 'icon' | 'color'>> = (props) => (
  <ContentCard
    title="Technology Solution"
    icon="desktop"
    color="secondary"
    cta="Learn More"
    ctaIcon="arrow-right"
    {...props}
  />
);

// ========================================
// DEFAULT EXPORT
// ========================================

export default ContentCard;
