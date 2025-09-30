import React from 'react';
import { HeroCard, ContentCard, MetricCard, ProcessCard, ComparisonCard } from './index';

// Test data for the infographic cards
const testData = {
  hero: {
    title: "Digital Transformation Journey",
    subtitle: "From Problem to Future",
    tagline: "A comprehensive approach to modernizing your business operations with cutting-edge solutions",
    cta: "🚀 Start Your Journey",
    icon: "rocket" as const,
    color: "primary" as const
  },
  
  content: {
    title: "The Problem",
    subtitle: "Current Challenges",
    content: "Many organizations struggle with outdated systems, inefficient processes, and lack of digital integration. These challenges create bottlenecks, reduce productivity, and limit growth potential.",
    description: "Identifying and addressing these core issues is the first step toward transformation.",
    icon: "alert" as const,
    color: "error" as const,
    statistics: [
      { label: "Impact", value: "85%", trend: "up" as const },
      { label: "Frequency", value: "Daily", trend: "neutral" as const }
    ],
    dataPoints: [
      { text: "Legacy systems causing delays", highlight: true },
      { text: "Manual processes reducing efficiency" },
      { text: "Lack of data integration" },
      { text: "Poor user experience" }
    ],
    cta: "Learn More"
  },
  
  metric: {
    value: "24.5",
    label: "Revenue Growth",
    unit: "%",
    description: "Year-over-year revenue increase following digital transformation initiatives",
    icon: "money" as const,
    color: "success" as const,
    trend: {
      direction: "up" as const,
      percentage: "+12.3%",
      description: "vs last quarter",
      timeframe: "Q3 2024"
    },
    comparison: {
      label: "Industry Average",
      value: "18.2%",
      type: "percentage" as const,
      description: "Above industry benchmark"
    },
    target: {
      label: "Annual Target",
      value: "30%",
      achieved: false,
      progress: 82
    }
  },
  
  process: {
    title: "Digital Transformation Process",
    subtitle: "A systematic approach to modernization",
    description: "Our proven 5-step methodology ensures successful digital transformation",
    icon: "rocket" as const,
    color: "primary" as const,
    steps: [
      {
        id: 'problem',
        title: 'The Problem',
        description: 'Identify current challenges and pain points',
        icon: 'alert' as const,
        duration: '1-2 weeks',
        outcome: 'Problem statement documented',
        status: 'completed' as const
      },
      {
        id: 'discovery',
        title: 'The Discovery',
        description: 'Research and analyze potential solutions',
        icon: 'search' as const,
        duration: '2-3 weeks',
        outcome: 'Solution options evaluated',
        status: 'completed' as const
      },
      {
        id: 'solution',
        title: 'The Solution',
        description: 'Implement the chosen strategy',
        icon: 'success' as const,
        duration: '4-6 weeks',
        outcome: 'Solution implemented',
        status: 'current' as const
      },
      {
        id: 'implementation',
        title: 'The Implementation',
        description: 'Execute and monitor progress',
        icon: 'settings' as const,
        duration: '6-8 weeks',
        outcome: 'System operational',
        status: 'upcoming' as const
      },
      {
        id: 'future',
        title: 'The Future',
        description: 'Plan for continued growth and optimization',
        icon: 'trending-up' as const,
        duration: 'Ongoing',
        outcome: 'Continuous improvement',
        status: 'upcoming' as const
      }
    ],
    currentStep: 2
  },
  
  comparison: {
    title: "Technology Platform Comparison",
    subtitle: "Choose the right solution for your needs",
    description: "Compare leading platforms to make an informed decision",
    icon: "desktop" as const,
    color: "primary" as const,
    options: [
      {
        id: 'platform-a',
        title: 'Platform A',
        subtitle: 'Enterprise Solution',
        description: 'Comprehensive enterprise platform with advanced features and scalability',
        icon: 'business' as const,
        features: ['Advanced Analytics', 'Enterprise Security', '24/7 Support', 'Custom Integration'],
        pros: ['Highly scalable', 'Enterprise-grade security', 'Comprehensive documentation'],
        cons: ['Higher cost', 'Complex initial setup'],
        score: 85,
        price: '$299/month',
        rating: 4.2,
        tags: ['Enterprise', 'Scalable']
      },
      {
        id: 'platform-b',
        title: 'Platform B',
        subtitle: 'Startup Friendly',
        description: 'Modern platform designed for growing businesses with intuitive interface',
        icon: 'rocket' as const,
        features: ['Easy Setup', 'Modern UI', 'API Access', 'Community Support'],
        pros: ['Affordable pricing', 'User-friendly', 'Quick deployment'],
        cons: ['Limited enterprise features', 'Basic support options'],
        score: 72,
        price: '$99/month',
        rating: 4.5,
        tags: ['Startup', 'Modern']
      }
    ],
    recommendation: {
      option: 'Platform A',
      reason: 'Best overall value for enterprise needs with excellent scalability and security features. The higher initial cost is justified by long-term benefits.',
      confidence: 'high' as const,
      icon: 'success' as const
    }
  }
};

export default function InfographicTest() {
  const [currentCard, setCurrentCard] = React.useState<'hero' | 'content' | 'metric' | 'process' | 'comparison'>('hero');
  
  const cardComponents = {
    hero: <HeroCard {...testData.hero} />,
    content: <ContentCard {...testData.content} />,
    metric: <MetricCard {...testData.metric} />,
    process: <ProcessCard {...testData.process} />,
    comparison: <ComparisonCard {...testData.comparison} />
  };

  return (
    <div className="w-[1080px] h-[1350px] bg-gray-50 relative overflow-hidden">
      {/* Card Navigation */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {(['hero', 'content', 'metric', 'process', 'comparison'] as const).map((cardType) => (
          <button
            key={cardType}
            onClick={() => setCurrentCard(cardType)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              currentCard === cardType
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Card Type Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium">
          {currentCard.charAt(0).toUpperCase() + currentCard.slice(1)} Card
        </div>
      </div>
      
      {/* Current Card Display */}
      <div className="w-full h-full">
        {cardComponents[currentCard]}
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 text-center">
          <strong>Test Navigation:</strong> Click buttons above to switch between card types. 
          <br />
          Each card demonstrates the new infographic design system capabilities.
        </div>
      </div>
    </div>
  );
}
