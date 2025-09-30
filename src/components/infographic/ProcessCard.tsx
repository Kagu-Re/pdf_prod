import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { BaseCard, ProcessCardBase, CardColor } from './BaseCard';
import { Icon, IconName, IconWithBackground } from './IconSystem';

// Import design system CSS
import '../../styles/design-system.css';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon?: IconName;
  duration?: string;
  outcome?: string;
  status?: 'completed' | 'current' | 'upcoming';
  details?: string[];
}

export interface ProcessCardProps {
  // Main content
  title: string;
  subtitle?: string;
  description?: string;
  
  // Process steps
  steps: ProcessStep[];
  currentStep?: number;
  
  // Visual elements
  icon?: IconName;
  showConnectors?: boolean;
  showProgress?: boolean;
  
  // Styling
  color?: CardColor;
  background?: 'solid' | 'gradient' | 'pattern';
  backgroundColor?: string;
  
  // Layout
  layout?: 'vertical' | 'horizontal';
  stepSize?: 'small' | 'medium' | 'large';
  
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

const processAnimationVariants = {
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

const stepVariants = {
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

const connectorVariants = {
  hidden: {
    scaleX: 0,
    opacity: 0
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const progressVariants = {
  hidden: {
    scaleX: 0,
    opacity: 0
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
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
  stepBg: string;
  stepBorder: string;
  connector: string;
  progress: string;
  completed: string;
  current: string;
  upcoming: string;
} => {
  const colorMap = {
    primary: {
      text: 'text-blue-900',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      stepBg: 'bg-blue-50',
      stepBorder: 'border-blue-200',
      connector: 'bg-blue-300',
      progress: 'bg-blue-600',
      completed: 'text-green-600',
      current: 'text-blue-600',
      upcoming: 'text-gray-400'
    },
    secondary: {
      text: 'text-purple-900',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100',
      stepBg: 'bg-purple-50',
      stepBorder: 'border-purple-200',
      connector: 'bg-purple-300',
      progress: 'bg-purple-600',
      completed: 'text-green-600',
      current: 'text-purple-600',
      upcoming: 'text-gray-400'
    },
    accent: {
      text: 'text-orange-900',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
      stepBg: 'bg-orange-50',
      stepBorder: 'border-orange-200',
      connector: 'bg-orange-300',
      progress: 'bg-orange-600',
      completed: 'text-green-600',
      current: 'text-orange-600',
      upcoming: 'text-gray-400'
    },
    success: {
      text: 'text-green-900',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
      stepBg: 'bg-green-50',
      stepBorder: 'border-green-200',
      connector: 'bg-green-300',
      progress: 'bg-green-600',
      completed: 'text-green-600',
      current: 'text-green-600',
      upcoming: 'text-gray-400'
    },
    warning: {
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      stepBg: 'bg-yellow-50',
      stepBorder: 'border-yellow-200',
      connector: 'bg-yellow-300',
      progress: 'bg-yellow-600',
      completed: 'text-green-600',
      current: 'text-yellow-600',
      upcoming: 'text-gray-400'
    },
    error: {
      text: 'text-red-900',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      stepBg: 'bg-red-50',
      stepBorder: 'border-red-200',
      connector: 'bg-red-300',
      progress: 'bg-red-600',
      completed: 'text-green-600',
      current: 'text-red-600',
      upcoming: 'text-gray-400'
    },
    neutral: {
      text: 'text-gray-900',
      icon: 'text-gray-600',
      iconBg: 'bg-gray-100',
      stepBg: 'bg-gray-50',
      stepBorder: 'border-gray-200',
      connector: 'bg-gray-300',
      progress: 'bg-gray-600',
      completed: 'text-green-600',
      current: 'text-gray-600',
      upcoming: 'text-gray-400'
    }
  };
  
  return colorMap[color];
};

const getStepSizeClasses = (size: 'small' | 'medium' | 'large'): {
  container: string;
  icon: string;
  number: string;
  title: string;
  description: string;
  padding: string;
} => {
  const sizeMap = {
    small: {
      container: 'p-3',
      icon: 'w-8 h-8',
      number: 'w-6 h-6 text-sm',
      title: 'text-sm font-semibold',
      description: 'text-xs',
      padding: 'p-2'
    },
    medium: {
      container: 'p-4',
      icon: 'w-10 h-10',
      number: 'w-8 h-8 text-base',
      title: 'text-base font-semibold',
      description: 'text-sm',
      padding: 'p-3'
    },
    large: {
      container: 'p-6',
      icon: 'w-12 h-12',
      number: 'w-10 h-10 text-lg',
      title: 'text-lg font-semibold',
      description: 'text-base',
      padding: 'p-4'
    }
  };
  
  return sizeMap[size];
};

const getStepStatusClasses = (status: 'completed' | 'current' | 'upcoming', colors: ReturnType<typeof getColorClasses>): {
  container: string;
  number: string;
  icon: string;
  title: string;
  description: string;
} => {
  switch (status) {
    case 'completed':
      return {
        container: 'bg-green-50 border-green-200',
        number: 'bg-green-600 text-white',
        icon: colors.completed,
        title: colors.completed,
        description: 'text-green-700'
      };
    case 'current':
      return {
        container: `${colors.stepBg} border-2 ${colors.stepBorder}`,
        number: `${colors.iconBg} ${colors.current}`,
        icon: colors.current,
        title: colors.current,
        description: colors.text
      };
    case 'upcoming':
      return {
        container: 'bg-gray-50 border-gray-200',
        number: 'bg-gray-200 text-gray-500',
        icon: colors.upcoming,
        title: colors.upcoming,
        description: 'text-gray-500'
      };
    default:
      return {
        container: 'bg-gray-50 border-gray-200',
        number: 'bg-gray-200 text-gray-500',
        icon: colors.upcoming,
        title: colors.upcoming,
        description: 'text-gray-500'
      };
  }
};

// ========================================
// MAIN COMPONENT
// ========================================

export const ProcessCard: React.FC<ProcessCardProps> = ({
  // Main content
  title,
  subtitle,
  description,
  
  // Process steps
  steps,
  currentStep = 0,
  
  // Visual elements
  icon,
  showConnectors = true,
  showProgress = true,
  
  // Styling
  color = 'primary',
  background = 'solid',
  backgroundColor,
  
  // Layout
  layout = 'vertical',
  stepSize = 'medium',
  
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
  const sizeClasses = getStepSizeClasses(stepSize);

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Combine motion props
  const finalMotionProps: MotionProps = {
    variants: processAnimationVariants,
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
    <ProcessCardBase
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

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            variants={progressVariants}
            className="mb-6"
          >
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${colors.progress}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2" style={{ fontFamily: 'var(--font-family-primary)' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
          </motion.div>
        )}

        {/* Steps Container */}
        <div className={`flex-1 ${layout === 'horizontal' ? 'flex flex-col space-y-4' : 'space-y-4'}`}>
          {steps.map((step, index) => {
            const stepStatus: 'completed' | 'current' | 'upcoming' = 
              index < currentStep ? 'completed' : 
              index === currentStep ? 'current' : 'upcoming';
            
            const statusClasses = getStepStatusClasses(stepStatus, colors);

            return (
              <div key={step.id} className="relative">
                
                {/* Step Content */}
                <motion.div
                  variants={stepVariants}
                  custom={index}
                  className={`
                    ${sizeClasses.container}
                    ${statusClasses.container}
                    rounded-lg border
                    relative z-10
                    transition-all duration-300
                    ${stepStatus === 'current' ? 'shadow-md' : ''}
                  `}
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Step Number */}
                    <div className={`${sizeClasses.number} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${statusClasses.number}`}>
                      {stepStatus === 'completed' ? '✓' : index + 1}
                    </div>

                    {/* Step Icon */}
                    {step.icon && (
                      <div className={`${sizeClasses.icon} ${statusClasses.icon} flex items-center justify-center flex-shrink-0`}>
                        <Icon name={step.icon} size="lg" color={stepStatus === 'completed' ? 'success' : stepStatus === 'current' ? color : 'neutral'} />
                      </div>
                    )}

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`${sizeClasses.title} ${statusClasses.title} mb-1`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                        {step.title}
                      </h3>
                      <p className={`${sizeClasses.description} ${statusClasses.description} mb-2`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                        {step.description}
                      </p>
                      
                      {/* Duration */}
                      {step.duration && (
                        <div className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'var(--font-family-primary)' }}>
                          ⏱️ {step.duration}
                        </div>
                      )}
                      
                      {/* Outcome */}
                      {step.outcome && (
                        <div className={`text-xs ${stepStatus === 'completed' ? 'text-green-600' : 'text-gray-600'}`} style={{ fontFamily: 'var(--font-family-primary)' }}>
                          📊 {step.outcome}
                        </div>
                      )}
                      
                      {/* Details */}
                      {step.details && step.details.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className={`text-xs ${statusClasses.description} flex items-center`}>
                              <span className="w-1 h-1 bg-current rounded-full mr-2 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Connector Line */}
                {showConnectors && index < steps.length - 1 && (
                  <motion.div
                    variants={connectorVariants}
                    className={`
                      absolute left-6 top-full
                      w-0.5 h-4
                      ${colors.connector}
                      origin-top
                    `}
                    style={{ marginTop: '-1px' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProcessCardBase>
  );
};

// ========================================
// PRESET VARIANTS
// ========================================

// Digital Transformation Process
export const DigitalTransformationProcess: React.FC<Omit<ProcessCardProps, 'title' | 'steps'>> = (props) => (
  <ProcessCard
    title="Digital Transformation Process"
    subtitle="A systematic approach to modernization"
    icon="rocket"
    color="primary"
    steps={[
      {
        id: 'problem',
        title: 'The Problem',
        description: 'Identify current challenges and pain points',
        icon: 'alert',
        duration: '1-2 weeks',
        outcome: 'Problem statement documented',
        status: 'completed'
      },
      {
        id: 'discovery',
        title: 'The Discovery',
        description: 'Research and analyze potential solutions',
        icon: 'search',
        duration: '2-3 weeks',
        outcome: 'Solution options evaluated',
        status: 'completed'
      },
      {
        id: 'solution',
        title: 'The Solution',
        description: 'Implement the chosen strategy',
        icon: 'success',
        duration: '4-6 weeks',
        outcome: 'Solution implemented',
        status: 'current'
      },
      {
        id: 'implementation',
        title: 'The Implementation',
        description: 'Execute and monitor progress',
        icon: 'settings',
        duration: '6-8 weeks',
        outcome: 'System operational',
        status: 'upcoming'
      },
      {
        id: 'future',
        title: 'The Future',
        description: 'Plan for continued growth and optimization',
        icon: 'trending-up',
        duration: 'Ongoing',
        outcome: 'Continuous improvement',
        status: 'upcoming'
      }
    ]}
    currentStep={2}
    {...props}
  />
);

// Software Development Process
export const SoftwareDevelopmentProcess: React.FC<Omit<ProcessCardProps, 'title' | 'steps'>> = (props) => (
  <ProcessCard
    title="Software Development Process"
    subtitle="Agile methodology for modern development"
    icon="desktop"
    color="secondary"
    steps={[
      {
        id: 'planning',
        title: 'Planning & Requirements',
        description: 'Define project scope and requirements',
        icon: 'document',
        duration: '1-2 weeks',
        outcome: 'Requirements documented',
        status: 'completed'
      },
      {
        id: 'design',
        title: 'Design & Architecture',
        description: 'Create system design and architecture',
        icon: 'chart',
        duration: '1-2 weeks',
        outcome: 'Architecture defined',
        status: 'completed'
      },
      {
        id: 'development',
        title: 'Development',
        description: 'Build and implement the solution',
        icon: 'settings',
        duration: '4-6 weeks',
        outcome: 'Features implemented',
        status: 'current'
      },
      {
        id: 'testing',
        title: 'Testing & QA',
        description: 'Test and ensure quality',
        icon: 'checklist',
        duration: '1-2 weeks',
        outcome: 'Quality assured',
        status: 'upcoming'
      },
      {
        id: 'deployment',
        title: 'Deployment & Launch',
        description: 'Deploy to production and launch',
        icon: 'rocket',
        duration: '1 week',
        outcome: 'System live',
        status: 'upcoming'
      }
    ]}
    currentStep={2}
    {...props}
  />
);

// Customer Onboarding Process
export const CustomerOnboardingProcess: React.FC<Omit<ProcessCardProps, 'title' | 'steps'>> = (props) => (
  <ProcessCard
    title="Customer Onboarding Process"
    subtitle="Guiding new customers to success"
    icon="user"
    color="success"
    steps={[
      {
        id: 'welcome',
        title: 'Welcome & Setup',
        description: 'Welcome new customer and initial setup',
        icon: 'star',
        duration: '1 day',
        outcome: 'Account created',
        status: 'completed'
      },
      {
        id: 'orientation',
        title: 'Product Orientation',
        description: 'Introduce key features and functionality',
        icon: 'eye',
        duration: '2-3 days',
        outcome: 'Features understood',
        status: 'completed'
      },
      {
        id: 'training',
        title: 'Training & Support',
        description: 'Provide training and ongoing support',
        icon: 'education',
        duration: '1-2 weeks',
        outcome: 'Customer trained',
        status: 'current'
      },
      {
        id: 'optimization',
        title: 'Optimization',
        description: 'Optimize usage and maximize value',
        icon: 'trending-up',
        duration: '2-4 weeks',
        outcome: 'Value maximized',
        status: 'upcoming'
      },
      {
        id: 'success',
        title: 'Success & Growth',
        description: 'Ensure long-term success and growth',
        icon: 'like',
        duration: 'Ongoing',
        outcome: 'Customer success',
        status: 'upcoming'
      }
    ]}
    currentStep={2}
    {...props}
  />
);

// ========================================
// DEFAULT EXPORT
// ========================================

export default ProcessCard;
