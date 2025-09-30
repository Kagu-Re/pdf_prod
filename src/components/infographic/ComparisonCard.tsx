import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { BaseCard, ComparisonCardBase, CardColor } from './BaseCard';
import { Icon, IconName, IconWithBackground } from './IconSystem';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ComparisonCriteria {
  label: string;
  weight?: 'low' | 'medium' | 'high';
  description?: string;
}

export interface ComparisonOption {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: IconName;
  features?: string[];
  pros?: string[];
  cons?: string[];
  score?: number; // 0-100
  price?: string;
  rating?: number; // 0-5
  tags?: string[];
}

export interface ComparisonRecommendation {
  option: string;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
  icon?: IconName;
}

export interface ComparisonCardProps {
  // Main content
  title: string;
  subtitle?: string;
  description?: string;
  
  // Comparison options
  options: ComparisonOption[];
  
  // Comparison criteria
  criteria?: ComparisonCriteria[];
  
  // Recommendation
  recommendation?: ComparisonRecommendation;
  
  // Visual elements
  icon?: IconName;
  showScores?: boolean;
  showRatings?: boolean;
  showPrices?: boolean;
  
  // Styling
  color?: CardColor;
  background?: 'solid' | 'gradient' | 'pattern';
  backgroundColor?: string;
  
  // Layout
  layout?: 'side-by-side' | 'stacked' | 'grid';
  
  // Animation
  animate?: boolean;
  animationDelay?: number;
  animationDuration?: number;
  
  // Layout props
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

const comparisonAnimationVariants = {
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
    y: -20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const optionVariants = {
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
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const recommendationVariants = {
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
  optionBg: string;
  optionBorder: string;
  divider: string;
  recommendation: string;
  recommendationBg: string;
  recommendationBorder: string;
  scoreBg: string;
  scoreBorder: string;
} => {
  const colorMap = {
    primary: {
      text: 'text-blue-900',
      icon: 'business',
      iconBg: 'bg-blue-100',
      optionBg: 'bg-blue-50',
      optionBorder: 'border-blue-200',
      divider: 'border-blue-300',
      recommendation: 'text-blue-600',
      recommendationBg: 'bg-blue-50',
      recommendationBorder: 'border-blue-200',
      scoreBg: 'bg-blue-100',
      scoreBorder: 'border-blue-300'
    },
    secondary: {
      text: 'text-purple-900',
      icon: 'rocket',
      iconBg: 'bg-purple-100',
      optionBg: 'bg-purple-50',
      optionBorder: 'border-purple-200',
      divider: 'border-purple-300',
      recommendation: 'text-purple-600',
      recommendationBg: 'bg-purple-50',
      recommendationBorder: 'border-purple-200',
      scoreBg: 'bg-purple-100',
      scoreBorder: 'border-purple-300'
    },
    accent: {
      text: 'text-orange-900',
      icon: 'warning',
      iconBg: 'bg-orange-100',
      optionBg: 'bg-orange-50',
      optionBorder: 'border-orange-200',
      divider: 'border-orange-300',
      recommendation: 'text-orange-600',
      recommendationBg: 'bg-orange-50',
      recommendationBorder: 'border-orange-200',
      scoreBg: 'bg-orange-100',
      scoreBorder: 'border-orange-300'
    },
    success: {
      text: 'text-green-900',
      icon: 'success',
      iconBg: 'bg-green-100',
      optionBg: 'bg-green-50',
      optionBorder: 'border-green-200',
      divider: 'border-green-300',
      recommendation: 'text-green-600',
      recommendationBg: 'bg-green-50',
      recommendationBorder: 'border-green-200',
      scoreBg: 'bg-green-100',
      scoreBorder: 'border-green-300'
    },
    warning: {
      text: 'text-yellow-900',
      icon: 'star',
      iconBg: 'bg-yellow-100',
      optionBg: 'bg-yellow-50',
      optionBorder: 'border-yellow-200',
      divider: 'border-yellow-300',
      recommendation: 'text-yellow-600',
      recommendationBg: 'bg-yellow-50',
      recommendationBorder: 'border-yellow-200',
      scoreBg: 'bg-yellow-100',
      scoreBorder: 'border-yellow-300'
    },
    error: {
      text: 'text-red-900',
      icon: 'error',
      iconBg: 'bg-red-100',
      optionBg: 'bg-red-50',
      optionBorder: 'border-red-200',
      divider: 'border-red-300',
      recommendation: 'text-red-600',
      recommendationBg: 'bg-red-50',
      recommendationBorder: 'border-red-200',
      scoreBg: 'bg-red-100',
      scoreBorder: 'border-red-300'
    },
    neutral: {
      text: 'text-gray-900',
      icon: 'neutral',
      iconBg: 'bg-gray-100',
      optionBg: 'bg-gray-50',
      optionBorder: 'border-gray-200',
      divider: 'border-gray-300',
      recommendation: 'text-gray-600',
      recommendationBg: 'bg-gray-50',
      recommendationBorder: 'border-gray-200',
      scoreBg: 'bg-gray-100',
      scoreBorder: 'border-gray-300'
    }
  };
  
  return colorMap[color];
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100';
  if (score >= 40) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

const getConfidenceColor = (confidence: 'low' | 'medium' | 'high'): string => {
  const colorMap = {
    low: 'text-red-600 bg-red-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-green-600 bg-green-100'
  };
  return colorMap[confidence];
};

// ========================================
// MAIN COMPONENT
// ========================================

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  // Main content
  title,
  subtitle,
  description,
  
  // Comparison options
  options,
  
  // Comparison criteria
  criteria,
  
  // Recommendation
  recommendation,
  
  // Visual elements
  icon,
  showScores = true,
  showRatings = true,
  showPrices = true,
  
  // Styling
  color = 'primary',
  background = 'solid',
  backgroundColor,
  
  // Layout
  layout = 'side-by-side',
  
  // Animation
  animate = true,
  animationDelay = 0,
  animationDuration = 0.6,
  
  // Layout props
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
    variants: comparisonAnimationVariants,
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
    <ComparisonCardBase
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
          className="mb-6"
        >
          {/* Main Icon */}
          {icon && (
            <div className="flex justify-center mb-4">
              <IconWithBackground
                name={icon}
                size="2xl"
                color={color}
                background="subtle"
                backgroundSize="2xl"
              />
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${colors.text} mb-2`} style={{ fontFamily: 'var(--font-family-primary)' }}>
              {title}
            </h2>
            {subtitle && (
              <h3 className={`text-lg font-medium text-gray-600 mb-3`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                {subtitle}
              </h3>
            )}
            {description && (
              <p className={`text-gray-600 leading-relaxed max-w-2xl mx-auto`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                {description}
              </p>
            )}
          </div>
        </motion.div>

        {/* Options Container */}
        <div className={`flex-1 ${layout === 'side-by-side' ? 'flex gap-6' : layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              variants={optionVariants}
              custom={index}
              className={`
                ${colors.optionBg}
                rounded-lg border ${colors.optionBorder}
                p-4 flex-1
                transition-all duration-300
                hover:shadow-md
              `}
            >
              {/* Option Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {/* Option Icon */}
                  {option.icon && (
                    <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon name={option.icon} size="lg" color={color} />
                    </div>
                  )}
                  
                  {/* Option Title */}
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${colors.text} mb-1`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                      {option.title}
                    </h3>
                    {option.subtitle && (
                      <p className={`text-sm text-gray-600`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                        {option.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score Badge */}
                {showScores && option.score !== undefined && (
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(option.score)}`}>
                    {option.score}/100
                  </div>
                )}
              </div>

              {/* Description */}
              {option.description && (
                <p className={`text-gray-700 mb-4 leading-relaxed`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                  {option.description}
                </p>
              )}

              {/* Features */}
              {option.features && option.features.length > 0 && (
                <div className="mb-4">
                  <h4 className={`text-sm font-semibold ${colors.text} mb-2`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`text-sm text-gray-600 flex items-center`}>
                        <span className="w-1.5 h-1.5 bg-current rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pros and Cons */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Pros */}
                {option.pros && option.pros.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2" style={{ fontFamily: 'var(--font-family-primary)' }}>
                      ✓ Pros
                    </h4>
                    <ul className="space-y-1">
                      {option.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="text-sm text-green-700 flex items-start">
                          <span className="w-1 h-1 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {option.cons && option.cons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-2" style={{ fontFamily: 'var(--font-family-primary)' }}>
                      ✗ Cons
                    </h4>
                    <ul className="space-y-1">
                      {option.cons.map((con, conIndex) => (
                        <li key={conIndex} className="text-sm text-red-700 flex items-start">
                          <span className="w-1 h-1 bg-red-600 rounded-full mr-2 mt-2 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between">
                {/* Price */}
                {showPrices && option.price && (
                  <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-family-primary)' }}>
                    {option.price}
                  </div>
                )}

                {/* Rating */}
                {showRatings && option.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">
                      {getRatingStars(option.rating)}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({option.rating.toFixed(1)})
                    </span>
                  </div>
                )}

                {/* Tags */}
                {option.tags && option.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {option.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        {options.length > 1 && (
          <div className={`my-6 border-t ${colors.divider}`} />
        )}

        {/* Recommendation */}
        {recommendation && (
          <motion.div
            variants={recommendationVariants}
            className={`${colors.recommendationBg} rounded-lg border ${colors.recommendationBorder} p-4`}
          >
            <div className="flex items-start gap-3">
              {/* Recommendation Icon */}
              {recommendation.icon && (
                <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon name={recommendation.icon} size="base" color={color} />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className={`font-bold ${colors.recommendation}`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                    Recommended: {recommendation.option}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                    {recommendation.confidence} confidence
                  </span>
                </div>
                <p className={`text-gray-700`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </ComparisonCardBase>
  );
};

// ========================================
// PRESET VARIANTS
// ========================================

// Technology Comparison
export const TechnologyComparison: React.FC<Omit<ComparisonCardProps, 'title' | 'options'>> = (props) => (
  <ComparisonCard
    title="Technology Platform Comparison"
    subtitle="Choose the right solution for your needs"
    icon="desktop"
    color="primary"
    options={[
      {
        id: 'option-a',
        title: 'Platform A',
        subtitle: 'Enterprise Solution',
        description: 'Comprehensive enterprise platform with advanced features',
        icon: 'business',
        features: ['Advanced Analytics', 'Enterprise Security', '24/7 Support', 'Custom Integration'],
        pros: ['Scalable', 'Secure', 'Well-documented'],
        cons: ['Higher cost', 'Complex setup'],
        score: 85,
        price: '$299/month',
        rating: 4.2,
        tags: ['Enterprise', 'Scalable']
      },
      {
        id: 'option-b',
        title: 'Platform B',
        subtitle: 'Startup Friendly',
        description: 'Modern platform designed for growing businesses',
        icon: 'rocket',
        features: ['Easy Setup', 'Modern UI', 'API Access', 'Community Support'],
        pros: ['Affordable', 'Easy to use', 'Fast setup'],
        cons: ['Limited scalability', 'Basic support'],
        score: 72,
        price: '$99/month',
        rating: 4.5,
        tags: ['Startup', 'Modern']
      }
    ]}
    recommendation={{
      option: 'Platform A',
      reason: 'Best overall value for enterprise needs with excellent scalability and security features.',
      confidence: 'high',
      icon: 'success'
    }}
    {...props}
  />
);

// Service Comparison
export const ServiceComparison: React.FC<Omit<ComparisonCardProps, 'title' | 'options'>> = (props) => (
  <ComparisonCard
    title="Service Provider Comparison"
    subtitle="Compare top service providers"
    icon="chart"
    color="secondary"
    options={[
      {
        id: 'provider-a',
        title: 'Provider A',
        subtitle: 'Premium Service',
        description: 'Full-service provider with comprehensive solutions',
        icon: 'star',
        features: ['Full Service', 'Dedicated Support', 'Custom Solutions', 'SLA Guarantee'],
        pros: ['Complete solution', 'Expert team', 'Reliable'],
        cons: ['Higher cost', 'Longer timeline'],
        score: 90,
        price: 'Custom Pricing',
        rating: 4.8,
        tags: ['Premium', 'Full Service']
      },
      {
        id: 'provider-b',
        title: 'Provider B',
        subtitle: 'Budget Option',
        description: 'Cost-effective service with essential features',
        icon: 'money',
        features: ['Basic Service', 'Email Support', 'Standard Solutions', 'Standard SLA'],
        pros: ['Affordable', 'Quick delivery', 'Simple process'],
        cons: ['Limited features', 'Basic support'],
        score: 65,
        price: '$5,000',
        rating: 3.9,
        tags: ['Budget', 'Basic']
      }
    ]}
    recommendation={{
      option: 'Provider A',
      reason: 'Premium service provides the best long-term value despite higher initial cost.',
      confidence: 'medium',
      icon: 'trending-up'
    }}
    {...props}
  />
);

// Product Comparison
export const ProductComparison: React.FC<Omit<ComparisonCardProps, 'title' | 'options'>> = (props) => (
  <ComparisonCard
    title="Product Feature Comparison"
    subtitle="Compare key features and capabilities"
    icon="chart"
    color="accent"
    options={[
      {
        id: 'product-a',
        title: 'Product A',
        subtitle: 'Advanced Edition',
        description: 'Feature-rich product with advanced capabilities',
        icon: 'bolt',
        features: ['Advanced Features', 'Customization', 'Integration', 'Analytics'],
        pros: ['Powerful', 'Flexible', 'Comprehensive'],
        cons: ['Complex', 'Learning curve'],
        score: 88,
        price: '$199',
        rating: 4.3,
        tags: ['Advanced', 'Powerful']
      },
      {
        id: 'product-b',
        title: 'Product B',
        subtitle: 'Standard Edition',
        description: 'Solid product with essential features',
        icon: 'success',
        features: ['Core Features', 'Easy Setup', 'Good Support', 'Reliable'],
        pros: ['Simple', 'Reliable', 'Well-supported'],
        cons: ['Limited features', 'Less flexible'],
        score: 75,
        price: '$99',
        rating: 4.1,
        tags: ['Standard', 'Reliable']
      }
    ]}
    recommendation={{
      option: 'Product A',
      reason: 'Advanced features provide better long-term value and growth potential.',
      confidence: 'high',
      icon: 'trending-up'
    }}
    {...props}
  />
);

// ========================================
// DEFAULT EXPORT
// ========================================

export default ComparisonCard;
