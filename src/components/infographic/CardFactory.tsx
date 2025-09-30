import React from 'react';
import { HeroCard } from './HeroCard';
import { ContentCard } from './ContentCard';
import { MetricCard } from './MetricCard';
import { ProcessCard } from './ProcessCard';
import { ComparisonCard } from './ComparisonCard';

// Type definitions for card data
export interface CardData {
  type: 'hero' | 'content' | 'metric' | 'process' | 'comparison';
  id?: string;
  [key: string]: any;
}

export interface HeroCardData extends CardData {
  type: 'hero';
  title: string;
  subtitle: string;
  tagline?: string;
  cta?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export interface ContentCardData extends CardData {
  type: 'content';
  title: string;
  subtitle?: string;
  content: string;
  description?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  statistics?: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  dataPoints?: Array<{
    text: string;
    highlight?: boolean;
  }>;
  cta?: string;
}

export interface MetricCardData extends CardData {
  type: 'metric';
  value: string;
  label: string;
  unit?: string;
  description?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: string;
    description: string;
    timeframe?: string;
  };
  comparison?: {
    label: string;
    value: string;
    difference?: string;
  };
}

export interface ProcessCardData extends CardData {
  type: 'process';
  title: string;
  subtitle?: string;
  description?: string;
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    status?: 'completed' | 'current' | 'pending';
  }>;
  currentStep?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export interface ComparisonCardData extends CardData {
  type: 'comparison';
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  options: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    features: string[];
    pricing?: string;
    rating?: number;
    tags?: string[];
  }>;
  recommendation?: {
    option: string;
    reason: string;
    confidence?: 'low' | 'medium' | 'high';
    icon?: string;
  };
}

// Union type for all card data
export type AnyCardData = HeroCardData | ContentCardData | MetricCardData | ProcessCardData | ComparisonCardData;

// Card factory function
export function createCard(data: AnyCardData): React.ReactElement | null {
  switch (data.type) {
    case 'hero':
      return <HeroCard {...(data as HeroCardData)} />;
    
    case 'content':
      return <ContentCard {...(data as ContentCardData)} />;
    
    case 'metric':
      return <MetricCard {...(data as MetricCardData)} />;
    
    case 'process':
      return <ProcessCard {...(data as ProcessCardData)} />;
    
    case 'comparison':
      return <ComparisonCard {...(data as ComparisonCardData)} />;
    
    default:
      console.error(`Unknown card type: ${(data as any).type}`);
      return null;
  }
}

// Batch card creation
export function createCards(cardsData: AnyCardData[]): React.ReactElement[] {
  return cardsData
    .map(createCard)
    .filter((card): card is React.ReactElement => card !== null);
}

// Card factory component for easy use in JSX
interface CardFactoryProps {
  data: AnyCardData;
  className?: string;
}

export const CardFactory: React.FC<CardFactoryProps> = ({ data, className = '' }) => {
  const card = createCard(data);
  
  if (!card) {
    return (
      <div className={`w-[1080px] h-[1350px] bg-red-100 flex items-center justify-center ${className}`}>
        <div className="text-red-600 text-center">
          <div className="text-2xl font-bold mb-2">❌ Invalid Card</div>
          <div className="text-sm">Unknown card type: {data.type}</div>
        </div>
      </div>
    );
  }
  
  return <div className={className}>{card}</div>;
};

// Utility function to validate card data
export function validateCardData(data: any): data is AnyCardData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const validTypes = ['hero', 'content', 'metric', 'process', 'comparison'];
  if (!validTypes.includes(data.type)) {
    return false;
  }
  
  // Basic validation - each card type should have required fields
  switch (data.type) {
    case 'hero':
      return typeof data.title === 'string' && typeof data.subtitle === 'string';
    case 'content':
      return typeof data.title === 'string' && typeof data.content === 'string';
    case 'metric':
      return typeof data.value === 'string' && typeof data.label === 'string';
    case 'process':
      return typeof data.title === 'string' && Array.isArray(data.steps);
    case 'comparison':
      return typeof data.title === 'string' && Array.isArray(data.options);
    default:
      return false;
  }
}

// Template generator for common card patterns
export const CardTemplates = {
  // Marketing awareness card
  awareness: (title: string, content: string): ContentCardData => ({
    type: 'content',
    title,
    content,
    subtitle: 'Awareness Campaign',
    icon: 'megaphone',
    color: 'primary',
    statistics: [
      { label: 'Reach', value: '10K+', trend: 'up' },
      { label: 'Engagement', value: '85%', trend: 'up' }
    ],
    dataPoints: [
      { text: 'Multi-channel approach', highlight: true },
      { text: 'Targeted messaging' },
      { text: 'Performance tracking' }
    ],
    cta: 'Learn More'
  }),

  // Performance metrics card
  performance: (value: string, label: string, trend: string): MetricCardData => ({
    type: 'metric',
    value,
    label,
    unit: '%',
    description: 'Performance improvement over previous period',
    icon: 'chart',
    color: 'success',
    trend: {
      direction: 'up',
      percentage: trend,
      description: 'vs last quarter',
      timeframe: 'Q3 2024'
    },
    comparison: {
      label: 'Industry Average',
      value: '15.2%',
      difference: '+9.3%'
    }
  }),

  // Process workflow card
  workflow: (title: string, steps: string[]): ProcessCardData => ({
    type: 'process',
    title,
    subtitle: 'Step-by-step Process',
    description: 'Follow these steps to achieve optimal results',
    steps: steps.map((step, index) => ({
      id: `step-${index + 1}`,
      title: step,
      description: `Detailed instructions for ${step.toLowerCase()}`,
      icon: 'check',
      status: index === 0 ? 'current' : 'pending'
    })),
    currentStep: 'step-1',
    color: 'primary'
  }),

  // Service comparison card
  serviceComparison: (title: string, services: Array<{name: string, features: string[], pricing: string}>): ComparisonCardData => ({
    type: 'comparison',
    title,
    subtitle: 'Compare Service Options',
    description: 'Choose the best option for your needs',
    icon: 'chart',
    color: 'secondary',
    options: services.map((service, index) => ({
      id: `service-${index + 1}`,
      title: service.name,
      subtitle: index === 0 ? 'Recommended' : 'Alternative',
      features: service.features,
      pricing: service.pricing,
      rating: 4.5 - (index * 0.2),
      tags: index === 0 ? ['Popular', 'Best Value'] : ['Budget', 'Basic']
    })),
    recommendation: {
      option: services[0].name,
      reason: 'Best overall value with comprehensive features and excellent support',
      confidence: 'high',
      icon: 'success'
    }
  })
};

export default CardFactory;
