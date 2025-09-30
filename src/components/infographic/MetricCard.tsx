import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { BaseCard, MetricCardBase, CardColor } from './BaseCard';
import { Icon, IconName, IconWithBackground } from './IconSystem';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface MetricTrend {
  direction: 'up' | 'down' | 'neutral';
  percentage?: string;
  value?: string;
  description?: string;
  timeframe?: string;
}

export interface MetricComparison {
  label: string;
  value: string;
  type?: 'percentage' | 'absolute' | 'ratio';
  description?: string;
}

export interface MetricTarget {
  label: string;
  value: string;
  achieved?: boolean;
  progress?: number; // 0-100
}

export interface MetricCardProps {
  // Main metric
  value: string;
  label: string;
  unit?: string;
  description?: string;
  
  // Visual elements
  icon?: IconName;
  
  // Trend information
  trend?: MetricTrend;
  
  // Comparison data
  comparison?: MetricComparison;
  previousPeriod?: string;
  
  // Target information
  target?: MetricTarget;
  
  // Timeframe
  timeframe?: string;
  period?: string;
  
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

const metricAnimationVariants = {
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

const valueVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 30
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const labelVariants = {
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
      delay: 0.4,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const trendVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9
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

const infoVariants = {
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
      delay: 0.6,
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
  trendUp: string;
  trendDown: string;
  trendNeutral: string;
  targetBg: string;
  targetBorder: string;
  comparisonBg: string;
  comparisonBorder: string;
} => {
  const colorMap = {
    primary: {
      text: 'text-blue-900',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-blue-50',
      targetBorder: 'border-blue-200',
      comparisonBg: 'bg-blue-50',
      comparisonBorder: 'border-blue-200'
    },
    secondary: {
      text: 'text-purple-900',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-purple-50',
      targetBorder: 'border-purple-200',
      comparisonBg: 'bg-purple-50',
      comparisonBorder: 'border-purple-200'
    },
    accent: {
      text: 'text-orange-900',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-orange-50',
      targetBorder: 'border-orange-200',
      comparisonBg: 'bg-orange-50',
      comparisonBorder: 'border-orange-200'
    },
    success: {
      text: 'text-green-900',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-green-50',
      targetBorder: 'border-green-200',
      comparisonBg: 'bg-green-50',
      comparisonBorder: 'border-green-200'
    },
    warning: {
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-yellow-50',
      targetBorder: 'border-yellow-200',
      comparisonBg: 'bg-yellow-50',
      comparisonBorder: 'border-yellow-200'
    },
    error: {
      text: 'text-red-900',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-red-50',
      targetBorder: 'border-red-200',
      comparisonBg: 'bg-red-50',
      comparisonBorder: 'border-red-200'
    },
    neutral: {
      text: 'text-gray-900',
      icon: 'text-gray-600',
      iconBg: 'bg-gray-100',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600',
      trendNeutral: 'text-gray-600',
      targetBg: 'bg-gray-50',
      targetBorder: 'border-gray-200',
      comparisonBg: 'bg-gray-50',
      comparisonBorder: 'border-gray-200'
    }
  };
  
  return colorMap[color];
};

const getTrendIcon = (direction: 'up' | 'down' | 'neutral'): string => {
  const iconMap = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };
  return iconMap[direction];
};

const getTrendColor = (direction: 'up' | 'down' | 'neutral'): string => {
  const colorMap = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };
  return colorMap[direction];
};

// ========================================
// MAIN COMPONENT
// ========================================

export const MetricCard: React.FC<MetricCardProps> = ({
  // Main metric
  value,
  label,
  unit,
  description,
  
  // Visual elements
  icon,
  
  // Trend information
  trend,
  
  // Comparison data
  comparison,
  previousPeriod,
  
  // Target information
  target,
  
  // Timeframe
  timeframe,
  period,
  
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
    variants: metricAnimationVariants,
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
    <MetricCardBase
      className={`${colors.text} text-center relative`}
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
        
        {/* Icon Section */}
        {icon && (
          <motion.div
            variants={iconVariants}
            className="flex justify-center mb-6"
          >
            <IconWithBackground
              name={icon}
              size="3xl"
              color={color}
              background="subtle"
              backgroundSize="3xl"
            />
          </motion.div>
        )}

        {/* Main Metric Section */}
        <motion.div
          variants={valueVariants}
          className="flex-1 flex flex-col justify-center mb-6"
        >
          <div className={`text-5xl font-black ${colors.text} mb-2`} style={{ fontFamily: 'var(--font-family-primary)' }}>
            {value}
            {unit && <span className="text-2xl font-medium text-gray-600 ml-1">{unit}</span>}
          </div>
          <div className={`text-lg font-medium text-gray-600`} style={{ fontFamily: 'var(--font-family-primary)' }}>
            {label}
          </div>
        </motion.div>

        {/* Trend Section */}
        {trend && (
          <motion.div
            variants={trendVariants}
            className="mb-6"
          >
            <div className={`flex items-center justify-center gap-2 ${getTrendColor(trend.direction)}`}>
              <span className="text-2xl font-bold">
                {getTrendIcon(trend.direction)}
              </span>
              <div className="text-center">
                {trend.percentage && (
                  <div className="font-semibold text-lg">
                    {trend.percentage}
                  </div>
                )}
                {trend.value && (
                  <div className="font-medium">
                    {trend.value}
                  </div>
                )}
              </div>
            </div>
            {trend.description && (
              <div className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'var(--font-family-primary)' }}>
                {trend.description}
              </div>
            )}
            {trend.timeframe && (
              <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'var(--font-family-primary)' }}>
                {trend.timeframe}
              </div>
            )}
          </motion.div>
        )}

        {/* Additional Information Section */}
        <motion.div
          variants={infoVariants}
          className="space-y-3"
        >
          {/* Timeframe */}
          {timeframe && (
            <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-family-primary)' }}>
              {timeframe}
            </div>
          )}
          
          {period && (
            <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-family-primary)' }}>
              {period}
            </div>
          )}

          {/* Comparison */}
          {comparison && (
            <div className={`${colors.comparisonBg} rounded-lg p-3 border ${colors.comparisonBorder}`}>
              <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'var(--font-family-primary)' }}>
                {comparison.label}
              </div>
              <div className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-family-primary)' }}>
                {comparison.value}
              </div>
              {comparison.description && (
                <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'var(--font-family-primary)' }}>
                  {comparison.description}
                </div>
              )}
            </div>
          )}

          {/* Target */}
          {target && (
            <div className={`${colors.targetBg} rounded-lg p-3 border ${colors.targetBorder}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-family-primary)' }}>
                  {target.label}
                </span>
                {target.achieved !== undefined && (
                  <span className={`text-xs font-medium ${target.achieved ? 'text-green-600' : 'text-gray-500'}`}>
                    {target.achieved ? '✓ Achieved' : 'In Progress'}
                  </span>
                )}
              </div>
              <div className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-family-primary)' }}>
                {target.value}
              </div>
              {target.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${colors.icon}`}
                    style={{ width: `${Math.min(100, Math.max(0, target.progress))}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-family-primary)' }}>
              {description}
            </div>
          )}

          {/* Previous Period */}
          {previousPeriod && (
            <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-family-primary)' }}>
              vs {previousPeriod}
            </div>
          )}
        </motion.div>
      </div>
    </MetricCardBase>
  );
};

// ========================================
// PRESET VARIANTS
// ========================================

// Revenue Metric
export const RevenueMetric: React.FC<Omit<MetricCardProps, 'label' | 'icon' | 'color'>> = (props) => (
  <MetricCard
    label="Revenue"
    icon="money"
    color="success"
    unit="$"
    {...props}
  />
);

// User Growth Metric
export const UserGrowthMetric: React.FC<Omit<MetricCardProps, 'label' | 'icon' | 'color'>> = (props) => (
  <MetricCard
    label="User Growth"
    icon="trending-up"
    color="primary"
    unit="%"
    {...props}
  />
);

// Performance Metric
export const PerformanceMetric: React.FC<Omit<MetricCardProps, 'label' | 'icon' | 'color'>> = (props) => (
  <MetricCard
    label="Performance"
    icon="bolt"
    color="warning"
    unit="%"
    {...props}
  />
);

// Security Metric
export const SecurityMetric: React.FC<Omit<MetricCardProps, 'label' | 'icon' | 'color'>> = (props) => (
  <MetricCard
    label="Security Score"
    icon="security"
    color="error"
    unit="/100"
    {...props}
  />
);

// Conversion Metric
export const ConversionMetric: React.FC<Omit<MetricCardProps, 'label' | 'icon' | 'color'>> = (props) => (
  <MetricCard
    label="Conversion Rate"
    icon="analytics"
    color="accent"
    unit="%"
    {...props}
  />
);

// Satisfaction Metric
export const SatisfactionMetric: React.FC<Omit<MetricCardProps, 'label' | 'icon' | 'color'>> = (props) => (
  <MetricCard
    label="Customer Satisfaction"
    icon="like"
    color="success"
    unit="/5"
    {...props}
  />
);

// ========================================
// DEFAULT EXPORT
// ========================================

export default MetricCard;
