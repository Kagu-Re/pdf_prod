// ========================================
// INFORGRAPHIC COMPONENTS EXPORT
// ========================================

// Design System
// CSS files are imported directly, not exported as modules

// Base Components
export { default as BaseCard, HeroCardBase, ContentCardBase, MetricCardBase, ProcessCardBase, ComparisonCardBase } from './BaseCard';
export type { BaseCardProps, CardPadding, CardShadow, CardBorderRadius, CardBackground, CardColor } from './BaseCard';

// Icon System
export { 
  default as Icon, 
  IconWithBackground,
  AlertIcon,
  SearchIcon,
  SuccessIcon,
  SettingsIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WarningIcon,
  InfoIcon,
  ErrorIcon,
  UserIcon,
  BusinessIcon,
  MoneyIcon,
  TimeIcon,
  AnalyticsIcon,
  ChartIcon,
  IdeaIcon,
  RocketIcon,
  SecurityIcon,
  GlobeIcon,
  MobileIcon,
  DesktopIcon,
  CloudIcon,
  getIconForCardType,
  getIconForContent
} from './IconSystem';
export type { IconProps, IconName, IconSize, IconColor, IconBackground, IconVariant, IconWithBackgroundProps } from './IconSystem';

// Hero Card
export { 
  default as HeroCard,
  DigitalTransformationHero,
  InnovationHero,
  SuccessHero,
  SecurityHero
} from './HeroCard';
export type { HeroCardProps } from './HeroCard';

// Content Card
export { 
  default as ContentCard,
  ProblemCard,
  DiscoveryCard,
  SolutionCard,
  ImplementationCard,
  FutureCard,
  BusinessCard,
  TechnologyCard
} from './ContentCard';
export type { ContentCardProps, Statistic, DataPoint } from './ContentCard';

// Metric Card
export { 
  default as MetricCard,
  RevenueMetric,
  UserGrowthMetric,
  PerformanceMetric,
  SecurityMetric,
  ConversionMetric,
  SatisfactionMetric
} from './MetricCard';
export type { MetricCardProps, MetricTrend, MetricComparison, MetricTarget } from './MetricCard';

// Process Card
export { 
  default as ProcessCard,
  DigitalTransformationProcess,
  SoftwareDevelopmentProcess,
  CustomerOnboardingProcess
} from './ProcessCard';
export type { ProcessCardProps, ProcessStep } from './ProcessCard';

// Comparison Card
export { 
  default as ComparisonCard,
  TechnologyComparison,
  ServiceComparison,
  ProductComparison
} from './ComparisonCard';
export type { 
  ComparisonCardProps, 
  ComparisonCriteria, 
  ComparisonOption, 
  ComparisonRecommendation 
} from './ComparisonCard';

// Card Factory
export { 
  default as CardFactory,
  createCard,
  createCards,
  validateCardData,
  CardTemplates
} from './CardFactory';
export type { 
  CardData, 
  HeroCardData, 
  ContentCardData, 
  MetricCardData, 
  ProcessCardData, 
  ComparisonCardData, 
  AnyCardData 
} from './CardFactory';

// Template System
export { default as TemplateManager } from './TemplateManager';
export { 
  templateCategories, 
  allTemplates, 
  templateUtils,
  marketingTemplates,
  businessTemplates,
  processTemplates,
  comparisonTemplates,
  contentTemplates
} from '../../data/CardTemplates';
export type { TemplateCategory, CardTemplate } from '../../data/CardTemplates';

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get the appropriate card type based on content
 */
export const getCardTypeFromContent = (content: string): string => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('hero') || lowerContent.includes('title') || lowerContent.includes('main')) {
    return 'hero';
  }
  
  if (lowerContent.includes('metric') || lowerContent.includes('data') || lowerContent.includes('kpi') || lowerContent.includes('number')) {
    return 'metric';
  }
  
  if (lowerContent.includes('process') || lowerContent.includes('step') || lowerContent.includes('workflow')) {
    return 'process';
  }
  
  if (lowerContent.includes('compare') || lowerContent.includes('vs') || lowerContent.includes('option')) {
    return 'comparison';
  }
  
  return 'content';
};

/**
 * Get the appropriate color based on content type
 */
export const getColorFromContent = (content: string): CardColor => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('problem') || lowerContent.includes('error') || lowerContent.includes('issue')) {
    return 'error';
  }
  
  if (lowerContent.includes('success') || lowerContent.includes('growth') || lowerContent.includes('positive')) {
    return 'success';
  }
  
  if (lowerContent.includes('warning') || lowerContent.includes('caution') || lowerContent.includes('attention')) {
    return 'warning';
  }
  
  if (lowerContent.includes('innovation') || lowerContent.includes('future') || lowerContent.includes('advanced')) {
    return 'secondary';
  }
  
  if (lowerContent.includes('business') || lowerContent.includes('enterprise') || lowerContent.includes('corporate')) {
    return 'primary';
  }
  
  if (lowerContent.includes('technology') || lowerContent.includes('digital') || lowerContent.includes('tech')) {
    return 'accent';
  }
  
  return 'neutral';
};

/**
 * Get the appropriate icon based on content
 */
export const getIconFromContent = (content: string): IconName => {
  const lowerContent = content.toLowerCase();
  
  // Problem-related
  if (lowerContent.includes('problem') || lowerContent.includes('issue') || lowerContent.includes('challenge')) {
    return 'alert';
  }
  
  // Discovery-related
  if (lowerContent.includes('discovery') || lowerContent.includes('research') || lowerContent.includes('analysis')) {
    return 'search';
  }
  
  // Solution-related
  if (lowerContent.includes('solution') || lowerContent.includes('resolve') || lowerContent.includes('fix')) {
    return 'success';
  }
  
  // Implementation-related
  if (lowerContent.includes('implementation') || lowerContent.includes('deploy') || lowerContent.includes('execute')) {
    return 'settings';
  }
  
  // Future-related
  if (lowerContent.includes('future') || lowerContent.includes('growth') || lowerContent.includes('trend')) {
    return 'trending-up';
  }
  
  // Business-related
  if (lowerContent.includes('business') || lowerContent.includes('enterprise') || lowerContent.includes('corporate')) {
    return 'business';
  }
  
  // Technology-related
  if (lowerContent.includes('technology') || lowerContent.includes('digital') || lowerContent.includes('tech')) {
    return 'desktop';
  }
  
  // Security-related
  if (lowerContent.includes('security') || lowerContent.includes('safe') || lowerContent.includes('protect')) {
    return 'security';
  }
  
  // Innovation-related
  if (lowerContent.includes('innovation') || lowerContent.includes('idea') || lowerContent.includes('creative')) {
    return 'idea';
  }
  
  // Performance-related
  if (lowerContent.includes('performance') || lowerContent.includes('speed') || lowerContent.includes('fast')) {
    return 'bolt';
  }
  
  return 'document';
};

/**
 * Validate card props based on type
 */
export const validateCardProps = (cardType: string, props: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  switch (cardType) {
    case 'hero':
      if (!props.title) errors.push('Hero card requires a title');
      if (props.title && props.title.length > 60) errors.push('Hero title should be under 60 characters');
      break;
      
    case 'content':
      if (!props.title) errors.push('Content card requires a title');
      if (!props.content) errors.push('Content card requires content');
      if (props.content && props.content.length > 300) errors.push('Content should be under 300 characters');
      break;
      
    case 'metric':
      if (!props.value) errors.push('Metric card requires a value');
      if (!props.label) errors.push('Metric card requires a label');
      break;
      
    case 'process':
      if (!props.title) errors.push('Process card requires a title');
      if (!props.steps || props.steps.length === 0) errors.push('Process card requires steps');
      break;
      
    case 'comparison':
      if (!props.title) errors.push('Comparison card requires a title');
      if (!props.options || props.options.length < 2) errors.push('Comparison card requires at least 2 options');
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get default props for a card type
 */
export const getDefaultCardProps = (cardType: string): any => {
  const baseProps = {
    animate: true,
    animationDelay: 0,
    animationDuration: 0.6,
    width: '100%',
    height: '100%'
  };
  
  switch (cardType) {
    case 'hero':
      return {
        ...baseProps,
        color: 'primary',
        background: 'gradient',
        decoration: true,
        backgroundPattern: true
      };
      
    case 'content':
      return {
        ...baseProps,
        color: 'neutral',
        background: 'solid'
      };
      
    case 'metric':
      return {
        ...baseProps,
        color: 'primary',
        background: 'solid'
      };
      
    case 'process':
      return {
        ...baseProps,
        color: 'primary',
        background: 'solid',
        showConnectors: true,
        showProgress: true,
        layout: 'vertical',
        stepSize: 'medium'
      };
      
    case 'comparison':
      return {
        ...baseProps,
        color: 'primary',
        background: 'solid',
        layout: 'side-by-side',
        showScores: true,
        showRatings: true,
        showPrices: true
      };
      
    default:
      return baseProps;
  }
};

/**
 * Create a complete card configuration
 */
export const createCardConfig = (cardType: string, content: any): any => {
  const defaultProps = getDefaultCardProps(cardType);
  const color = getColorFromContent(content.title || content.content || '');
  const icon = getIconFromContent(content.title || content.content || '');
  
  return {
    ...defaultProps,
    ...content,
    color: content.color || color,
    icon: content.icon || icon
  };
};

// ========================================
// PRESET CONFIGURATIONS
// ========================================

export const CARD_PRESETS = {
  // Digital Transformation Series
  digitalTransformation: {
    hero: {
      title: "Digital Transformation Journey",
      subtitle: "From Problem to Future",
      tagline: "A comprehensive approach to modernizing your business operations",
      cta: "🚀 Start Your Journey",
      icon: "rocket",
      color: "primary"
    },
    problem: {
      title: "The Problem",
      content: "Identify current challenges and pain points in your business operations",
      icon: "alert",
      color: "error",
      cta: "Learn More"
    },
    discovery: {
      title: "The Discovery",
      content: "Research and analyze potential solutions and opportunities",
      icon: "search",
      color: "success",
      cta: "Explore"
    },
    solution: {
      title: "The Solution",
      content: "Implement the chosen strategy with proven methodologies",
      icon: "success",
      color: "primary",
      cta: "Get Started"
    },
    implementation: {
      title: "The Implementation",
      content: "Execute and monitor progress with real-time tracking",
      icon: "settings",
      color: "warning",
      cta: "View Details"
    },
    future: {
      title: "The Future",
      content: "Plan for continued growth and optimization opportunities",
      icon: "trending-up",
      color: "secondary",
      cta: "Plan Ahead"
    }
  },
  
  // Business Metrics Series
  businessMetrics: {
    revenue: {
      label: "Revenue Growth",
      value: "24.5",
      unit: "%",
      icon: "money",
      color: "success",
      trend: {
        direction: "up",
        percentage: "+12.3%",
        description: "vs last quarter"
      }
    },
    users: {
      label: "Active Users",
      value: "12,847",
      icon: "user",
      color: "primary",
      trend: {
        direction: "up",
        percentage: "+8.7%",
        description: "vs last month"
      }
    },
    performance: {
      label: "Performance Score",
      value: "94",
      unit: "/100",
      icon: "bolt",
      color: "warning",
      trend: {
        direction: "up",
        percentage: "+2.1%",
        description: "vs last week"
      }
    },
    satisfaction: {
      label: "Customer Satisfaction",
      value: "4.8",
      unit: "/5",
      icon: "like",
      color: "success",
      trend: {
        direction: "neutral",
        percentage: "0.0%",
        description: "maintained"
      }
    }
  }
};

// ========================================
// DEFAULT EXPORT
// ========================================

export default {
  // Components
  BaseCard,
  Icon,
  HeroCard,
  ContentCard,
  MetricCard,
  ProcessCard,
  ComparisonCard,
  
  // Utilities
  getCardTypeFromContent,
  getColorFromContent,
  getIconFromContent,
  validateCardProps,
  getDefaultCardProps,
  createCardConfig,
  
  // Presets
  CARD_PRESETS
};
