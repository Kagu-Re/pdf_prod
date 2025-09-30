import { AnyCardData } from '../components/infographic/CardFactory';

// Template categories for different use cases
export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: CardTemplate[];
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  data: AnyCardData;
  preview?: string; // URL to preview image
}

// Marketing Templates
export const marketingTemplates: CardTemplate[] = [
  {
    id: 'awareness-campaign',
    name: 'Brand Awareness Campaign',
    description: 'Showcase brand awareness results with key metrics',
    category: 'marketing',
    tags: ['awareness', 'brand', 'campaign', 'metrics'],
    data: {
      type: 'content',
      title: 'Brand Awareness Campaign',
      subtitle: 'Campaign Results',
      content: 'Our comprehensive brand awareness strategy increased market visibility by 65% and generated over 2.5M impressions across multiple channels.',
      description: 'Successfully positioned our brand as an industry leader',
      icon: 'megaphone',
      color: 'primary',
      statistics: [
        { label: 'Reach', value: '2.5M', trend: 'up' },
        { label: 'Engagement', value: '85%', trend: 'up' },
        { label: 'Visibility', value: '65%', trend: 'up' }
      ],
      dataPoints: [
        { text: 'Multi-channel approach', highlight: true },
        { text: 'Targeted messaging' },
        { text: 'Performance tracking' },
        { text: 'ROI optimization' }
      ],
      cta: 'View Full Campaign'
    }
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation Success',
    description: 'Highlight lead generation performance and conversion rates',
    category: 'marketing',
    tags: ['leads', 'conversion', 'sales', 'funnel'],
    data: {
      type: 'metric',
      value: '847',
      label: 'Qualified Leads',
      unit: '',
      description: 'Generated through digital marketing campaigns',
      icon: 'users',
      color: 'success',
      trend: {
        direction: 'up',
        percentage: '+32%',
        description: 'vs last quarter',
        timeframe: 'Q3 2024'
      },
      comparison: {
        label: 'Conversion Rate',
        value: '12.4%',
        difference: '+2.8%'
      }
    }
  }
];

// Business Templates
export const businessTemplates: CardTemplate[] = [
  {
    id: 'revenue-growth',
    name: 'Revenue Growth Metrics',
    description: 'Display revenue growth with trend analysis',
    category: 'business',
    tags: ['revenue', 'growth', 'finance', 'kpi'],
    data: {
      type: 'metric',
      value: '24.5',
      label: 'Revenue Growth',
      unit: '%',
      description: 'Year-over-year revenue increase following strategic initiatives',
      icon: 'money',
      color: 'success',
      trend: {
        direction: 'up',
        percentage: '+12.3%',
        description: 'vs last quarter',
        timeframe: 'Q3 2024'
      },
      comparison: {
        label: 'Industry Average',
        value: '18.2%',
        difference: '+6.3%'
      }
    }
  },
  {
    id: 'digital-transformation',
    name: 'Digital Transformation Journey',
    description: 'Showcase digital transformation process and outcomes',
    category: 'business',
    tags: ['transformation', 'digital', 'process', 'innovation'],
    data: {
      type: 'hero',
      title: 'Digital Transformation Success',
      subtitle: 'Modernize Your Business',
      tagline: 'Achieve operational excellence through strategic digital transformation initiatives',
      cta: '🚀 Start Your Journey',
      icon: 'rocket',
      color: 'primary'
    }
  }
];

// Process Templates
export const processTemplates: CardTemplate[] = [
  {
    id: 'implementation-process',
    name: 'Implementation Workflow',
    description: 'Step-by-step implementation process',
    category: 'process',
    tags: ['implementation', 'workflow', 'steps', 'process'],
    data: {
      type: 'process',
      title: 'Implementation Process',
      subtitle: 'Step-by-step Guide',
      description: 'Follow these proven steps to ensure successful implementation',
      steps: [
        {
          id: 'step-1',
          title: 'Assessment & Planning',
          description: 'Evaluate current state and create implementation roadmap',
          icon: 'search',
          status: 'completed'
        },
        {
          id: 'step-2',
          title: 'System Integration',
          description: 'Integrate new systems with existing infrastructure',
          icon: 'settings',
          status: 'completed'
        },
        {
          id: 'step-3',
          title: 'Training & Support',
          description: 'Train team members and establish support processes',
          icon: 'users',
          status: 'current'
        },
        {
          id: 'step-4',
          title: 'Go-Live & Optimization',
          description: 'Launch system and optimize performance',
          icon: 'rocket',
          status: 'pending'
        },
        {
          id: 'step-5',
          title: 'Monitoring & Maintenance',
          description: 'Ongoing monitoring and continuous improvement',
          icon: 'chart',
          status: 'pending'
        }
      ],
      currentStep: 'step-3',
      color: 'primary'
    }
  }
];

// Comparison Templates
export const comparisonTemplates: CardTemplate[] = [
  {
    id: 'platform-comparison',
    name: 'Platform Comparison',
    description: 'Compare different platform options with features and pricing',
    category: 'comparison',
    tags: ['comparison', 'platform', 'features', 'pricing'],
    data: {
      type: 'comparison',
      title: 'Platform Selection',
      subtitle: 'Choose Your Solution',
      description: 'Compare features and pricing to find the best fit',
      icon: 'chart',
      color: 'secondary',
      options: [
        {
          id: 'enterprise',
          title: 'Enterprise Platform',
          subtitle: 'Recommended',
          description: 'Full-featured solution for large organizations',
          icon: 'business',
          features: [
            'Advanced Analytics',
            '24/7 Priority Support',
            'Custom Integrations',
            'Enterprise Security',
            'Unlimited Users'
          ],
          pricing: '$299/month',
          rating: 4.8,
          tags: ['Popular', 'Best Value']
        },
        {
          id: 'professional',
          title: 'Professional Platform',
          subtitle: 'SMB Solution',
          description: 'Comprehensive features for growing businesses',
          icon: 'desktop',
          features: [
            'Standard Analytics',
            'Business Hours Support',
            'API Access',
            'Standard Security'
          ],
          pricing: '$99/month',
          rating: 4.5,
          tags: ['Budget', 'Scalable']
        },
        {
          id: 'starter',
          title: 'Starter Platform',
          subtitle: 'Basic Solution',
          description: 'Essential features for small teams',
          icon: 'mobile',
          features: [
            'Basic Analytics',
            'Email Support',
            'Limited Integrations',
            'Basic Security'
          ],
          pricing: '$29/month',
          rating: 4.2,
          tags: ['Budget', 'Simple']
        }
      ],
      recommendation: {
        option: 'Enterprise Platform',
        reason: 'Best overall value with comprehensive features and excellent support',
        confidence: 'high',
        icon: 'success'
      }
    }
  }
];

// Content Templates
export const contentTemplates: CardTemplate[] = [
  {
    id: 'problem-solution',
    name: 'Problem & Solution',
    description: 'Present a problem and its solution',
    category: 'content',
    tags: ['problem', 'solution', 'content', 'narrative'],
    data: {
      type: 'content',
      title: 'The Challenge',
      subtitle: 'Current Situation',
      content: 'Many organizations struggle with outdated systems, inefficient processes, and lack of digital integration. These challenges create bottlenecks, reduce productivity, and limit growth potential.',
      description: 'Identifying and addressing these core issues is the first step toward transformation',
      icon: 'alert',
      color: 'error',
      statistics: [
        { label: 'Impact', value: '85%', trend: 'up' },
        { label: 'Frequency', value: 'Daily', trend: 'neutral' }
      ],
      dataPoints: [
        { text: 'Legacy systems causing delays', highlight: true },
        { text: 'Manual processes reducing efficiency' },
        { text: 'Lack of data integration' },
        { text: 'Poor user experience' }
      ],
      cta: 'Learn More'
    }
  },
  {
    id: 'success-story',
    name: 'Customer Success Story',
    description: 'Highlight customer success with key results',
    category: 'content',
    tags: ['success', 'customer', 'case-study', 'results'],
    data: {
      type: 'content',
      title: 'Customer Success Story',
      subtitle: 'Real Results',
      content: 'TechCorp increased their operational efficiency by 58% after implementing our digital transformation solutions. The project delivered ROI within 6 months and reduced manual processes by 80%.',
      description: 'Real results from a real client implementation',
      icon: 'users',
      color: 'success',
      statistics: [
        { label: 'Efficiency Gain', value: '58%', trend: 'up' },
        { label: 'ROI Timeline', value: '6 months', trend: 'up' },
        { label: 'Process Reduction', value: '80%', trend: 'up' }
      ],
      dataPoints: [
        { text: 'Automated workflows', highlight: true },
        { text: 'Integrated systems' },
        { text: 'Real-time analytics' },
        { text: 'Team training program' }
      ],
      cta: 'Read Full Case Study'
    }
  }
];

// All templates organized by category
export const templateCategories: TemplateCategory[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Templates for marketing campaigns, lead generation, and brand awareness',
    templates: marketingTemplates
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Templates for business metrics, growth, and transformation',
    templates: businessTemplates
  },
  {
    id: 'process',
    name: 'Process',
    description: 'Templates for workflows, implementations, and step-by-step processes',
    templates: processTemplates
  },
  {
    id: 'comparison',
    name: 'Comparison',
    description: 'Templates for comparing options, features, and solutions',
    templates: comparisonTemplates
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Templates for content presentation, stories, and narratives',
    templates: contentTemplates
  }
];

// All templates flattened
export const allTemplates: CardTemplate[] = [
  ...marketingTemplates,
  ...businessTemplates,
  ...processTemplates,
  ...comparisonTemplates,
  ...contentTemplates
];

// Template utility functions
export const templateUtils = {
  // Get template by ID
  getTemplate: (id: string): CardTemplate | undefined => {
    return allTemplates.find(template => template.id === id);
  },

  // Get templates by category
  getTemplatesByCategory: (category: string): CardTemplate[] => {
    return allTemplates.filter(template => template.category === category);
  },

  // Search templates by tags
  searchTemplates: (query: string): CardTemplate[] => {
    const lowerQuery = query.toLowerCase();
    return allTemplates.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Get templates by tags
  getTemplatesByTags: (tags: string[]): CardTemplate[] => {
    return allTemplates.filter(template =>
      tags.some(tag => template.tags.includes(tag))
    );
  },

  // Create custom template from existing
  createCustomTemplate: (baseTemplate: CardTemplate, customizations: Partial<AnyCardData>): CardTemplate => {
    return {
      ...baseTemplate,
      id: `${baseTemplate.id}-custom-${Date.now()}`,
      name: `${baseTemplate.name} (Custom)`,
      data: {
        ...baseTemplate.data,
        ...customizations
      }
    };
  },

  // Validate template data
  validateTemplate: (template: CardTemplate): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.category) errors.push('Template category is required');
    if (!template.data) errors.push('Template data is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default {
  templateCategories,
  allTemplates,
  templateUtils
};
