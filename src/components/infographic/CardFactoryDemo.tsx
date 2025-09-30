import React, { useState } from 'react';
import { CardFactory, CardTemplates, AnyCardData } from './CardFactory';

// Sample JSON data for different card types
const sampleData: AnyCardData[] = [
  // Hero Card
  {
    type: 'hero',
    title: "Digital Transformation Success",
    subtitle: "Achieve 40% Growth",
    tagline: "Transform your business with our proven digital solutions",
    cta: "🚀 Get Started",
    icon: "rocket",
    color: "primary"
  },

  // Content Card - using template
  CardTemplates.awareness(
    "Brand Awareness Campaign",
    "Our comprehensive brand awareness strategy increased market visibility by 65% and generated over 2.5M impressions across multiple channels. The campaign successfully positioned our brand as an industry leader."
  ),

  // Metric Card - using template
  CardTemplates.performance("42.8", "Revenue Growth", "+24.3%"),

  // Process Card - using template
  CardTemplates.workflow(
    "Implementation Process",
    [
      "Assessment & Planning",
      "System Integration", 
      "Training & Support",
      "Go-Live & Optimization",
      "Monitoring & Maintenance"
    ]
  ),

  // Comparison Card - using template
  CardTemplates.serviceComparison(
    "Platform Selection",
    [
      {
        name: "Enterprise Platform",
        features: ["Advanced Analytics", "24/7 Support", "Custom Integrations", "Enterprise Security"],
        pricing: "$299/month"
      },
      {
        name: "Professional Platform", 
        features: ["Standard Analytics", "Business Hours Support", "API Access", "Standard Security"],
        pricing: "$99/month"
      },
      {
        name: "Starter Platform",
        features: ["Basic Analytics", "Email Support", "Limited Integrations", "Basic Security"],
        pricing: "$29/month"
      }
    ]
  ),

  // Custom Content Card
  {
    type: 'content',
    title: "Customer Success Story",
    subtitle: "Case Study Results",
    content: "TechCorp increased their operational efficiency by 58% after implementing our digital transformation solutions. The project delivered ROI within 6 months and reduced manual processes by 80%.",
    description: "Real results from a real client implementation",
    icon: "users",
    color: "success",
    statistics: [
      { label: "Efficiency Gain", value: "58%", trend: "up" },
      { label: "ROI Timeline", value: "6 months", trend: "up" },
      { label: "Process Reduction", value: "80%", trend: "up" }
    ],
    dataPoints: [
      { text: "Automated workflows", highlight: true },
      { text: "Integrated systems" },
      { text: "Real-time analytics" },
      { text: "Team training program" }
    ],
    cta: "Read Full Case Study"
  }
];

export default function CardFactoryDemo() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showJson, setShowJson] = useState(false);

  const currentCard = sampleData[currentCardIndex];

  return (
    <div className="w-[1080px] h-[1350px] bg-gray-50 relative overflow-hidden">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {sampleData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentCardIndex(index)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              currentCardIndex === index
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Card Type Indicator */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium">
          {currentCard.type.charAt(0).toUpperCase() + currentCard.type.slice(1)} Card
        </div>
        <button
          onClick={() => setShowJson(!showJson)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
            showJson
              ? 'bg-green-600 text-white'
              : 'bg-gray-600 text-white hover:bg-gray-500'
          }`}
        >
          {showJson ? 'Hide' : 'Show'} JSON
        </button>
      </div>

      {/* JSON Data Panel */}
      {showJson && (
        <div className="absolute top-16 right-4 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto">
          <h3 className="text-sm font-bold mb-2 text-gray-800">Card Data (JSON)</h3>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(currentCard, null, 2)}
          </pre>
        </div>
      )}

      {/* Card Display */}
      <div className="w-full h-full flex items-center justify-center">
        <CardFactory data={currentCard} />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-xs">
          <div className="font-bold mb-1">Card Factory Demo</div>
          <div>Click numbered buttons to switch between different card types. Each card is generated from JSON data using the CardFactory system.</div>
        </div>
      </div>
    </div>
  );
}
