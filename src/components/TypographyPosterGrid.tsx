import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';

interface TypographyCard {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  width: 'small' | 'medium' | 'large' | 'xlarge';
  height: 'short' | 'medium' | 'tall' | 'xtall';
  style: 'minimal' | 'bold' | 'elegant' | 'modern' | 'vintage' | 'futuristic';
}

const TypographyPosterGrid: React.FC = () => {
  const [cards, setCards] = useState<TypographyCard[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load custom fonts
  useEffect(() => {
    const customFonts = [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
      'https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
      'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap'
    ];

    customFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });

    setIsLoaded(true);
  }, []);

  // Generate typography cards
  useEffect(() => {
    if (!isLoaded) return;

    const typographyData = [
      {
        title: "Minimal Design",
        subtitle: "Less is More",
        content: "Clean lines, ample whitespace, and purposeful typography create powerful visual impact.",
        fontFamily: "Inter",
        fontSize: "clamp(1.2rem, 4vw, 2rem)",
        fontWeight: "300",
        color: "#1a1a1a",
        backgroundColor: "#ffffff",
        borderColor: "#e5e5e5",
        style: "minimal"
      },
      {
        title: "BOLD STATEMENTS",
        subtitle: "Make an Impact",
        content: "Heavy weights and strong contrasts demand attention and convey authority.",
        fontFamily: "Oswald",
        fontSize: "clamp(1.5rem, 5vw, 3rem)",
        fontWeight: "700",
        color: "#ffffff",
        backgroundColor: "#000000",
        borderColor: "#ff0000",
        style: "bold"
      },
      {
        title: "Elegant Serif",
        subtitle: "Timeless Beauty",
        content: "Classic serif typography brings sophistication and readability to any design.",
        fontFamily: "Playfair Display",
        fontSize: "clamp(1.4rem, 4.5vw, 2.5rem)",
        fontWeight: "400",
        color: "#2c3e50",
        backgroundColor: "#f8f9fa",
        borderColor: "#6c757d",
        style: "elegant"
      },
      {
        title: "Modern Sans",
        subtitle: "Contemporary Feel",
        content: "Geometric shapes and clean forms create a fresh, contemporary aesthetic.",
        fontFamily: "Space Grotesk",
        fontSize: "clamp(1.3rem, 4.2vw, 2.2rem)",
        fontWeight: "500",
        color: "#2563eb",
        backgroundColor: "#f1f5f9",
        borderColor: "#3b82f6",
        style: "modern"
      },
      {
        title: "Vintage Charm",
        subtitle: "Nostalgic Appeal",
        content: "Retro typography evokes memories and creates emotional connections.",
        fontFamily: "Roboto Slab",
        fontSize: "clamp(1.6rem, 5.2vw, 2.8rem)",
        fontWeight: "400",
        color: "#8b4513",
        backgroundColor: "#fdf6e3",
        borderColor: "#d4af37",
        style: "vintage"
      },
      {
        title: "FUTURISTIC",
        subtitle: "Next Generation",
        content: "Monospace fonts and geometric layouts suggest innovation and technology.",
        fontFamily: "JetBrains Mono",
        fontSize: "clamp(1.1rem, 3.8vw, 1.8rem)",
        fontWeight: "600",
        color: "#00ff88",
        backgroundColor: "#0a0a0a",
        borderColor: "#00ff88",
        style: "futuristic"
      },
      {
        title: "Typography Scale",
        subtitle: "Hierarchy Matters",
        content: "Consistent sizing creates visual rhythm and improves readability across all content.",
        fontFamily: "Source Serif Pro",
        fontSize: "clamp(1.4rem, 4.3vw, 2.3rem)",
        fontWeight: "300",
        color: "#374151",
        backgroundColor: "#fefefe",
        borderColor: "#9ca3af",
        style: "elegant"
      },
      {
        title: "Color Psychology",
        subtitle: "Emotional Impact",
        content: "Colors evoke emotions and influence how users perceive and interact with content.",
        fontFamily: "Montserrat",
        fontSize: "clamp(1.3rem, 4.1vw, 2.1rem)",
        fontWeight: "400",
        color: "#7c3aed",
        backgroundColor: "#faf5ff",
        borderColor: "#a855f7",
        style: "modern"
      },
      {
        title: "WHITE SPACE",
        subtitle: "Breathing Room",
        content: "Strategic use of whitespace improves readability and creates visual balance.",
        fontFamily: "Inter",
        fontSize: "clamp(1.5rem, 4.4vw, 2.4rem)",
        fontWeight: "200",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        borderColor: "#d1d5db",
        style: "minimal"
      },
      {
        title: "Responsive Design",
        subtitle: "Adapt & Thrive",
        content: "Typography that scales beautifully across all devices and screen sizes.",
        fontFamily: "Space Grotesk",
        fontSize: "clamp(1.2rem, 4vw, 2rem)",
        fontWeight: "600",
        color: "#059669",
        backgroundColor: "#ecfdf5",
        borderColor: "#10b981",
        style: "modern"
      },
      {
        title: "Accessibility First",
        subtitle: "Inclusive Design",
        content: "Typography choices that ensure content is readable by everyone, everywhere.",
        fontFamily: "Inter",
        fontSize: "clamp(1.1rem, 3.9vw, 1.9rem)",
        fontWeight: "400",
        color: "#dc2626",
        backgroundColor: "#fef2f2",
        borderColor: "#ef4444",
        style: "minimal"
      },
      {
        title: "BRAND VOICE",
        subtitle: "Personality Through Type",
        content: "Typography choices that reflect and reinforce your brand's unique personality.",
        fontFamily: "Oswald",
        fontSize: "clamp(1.5rem, 4.6vw, 2.6rem)",
        fontWeight: "500",
        color: "#ffffff",
        backgroundColor: "#1e40af",
        borderColor: "#3b82f6",
        style: "bold"
      }
    ];

    const generatedCards = typographyData.map((item, index) => ({
      ...item,
      id: `card-${index}`,
      width: ['small', 'medium', 'large', 'xlarge'][index % 4] as 'small' | 'medium' | 'large' | 'xlarge',
      height: ['short', 'medium', 'tall', 'xtall'][index % 4] as 'short' | 'medium' | 'tall' | 'xtall'
    }));

    setCards(generatedCards);
  }, [isLoaded]);

  const filteredCards = selectedStyle === 'all' 
    ? cards 
    : cards.filter(card => card.style === selectedStyle);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 2,
    400: 1
  };

  const getCardSize = (width: string, height: string) => {
    // Mobile-first responsive sizing
    const widthMap = {
      small: 'w-32 sm:w-40 md:w-48 lg:w-52',
      medium: 'w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72',
      large: 'w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80',
      xlarge: 'w-56 sm:w-64 md:w-72 lg:w-80 xl:w-96'
    };
    
    const heightMap = {
      short: 'h-24 sm:h-28 md:h-32 lg:h-36',
      medium: 'h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48',
      tall: 'h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56',
      xtall: 'h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64'
    };

    return `${widthMap[width as keyof typeof widthMap]} ${heightMap[height as keyof typeof heightMap]}`;
  };

  const styles = [
    { value: 'all', label: 'All Styles', color: '#6b7280' },
    { value: 'minimal', label: 'Minimal', color: '#1f2937' },
    { value: 'bold', label: 'Bold', color: '#dc2626' },
    { value: 'elegant', label: 'Elegant', color: '#7c3aed' },
    { value: 'modern', label: 'Modern', color: '#2563eb' },
    { value: 'vintage', label: 'Vintage', color: '#d97706' },
    { value: 'futuristic', label: 'Futuristic', color: '#059669' }
  ];

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading typography...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 lg:p-12 rounded-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600">
          <span className="text-3xl font-bold text-white">T</span>
        </div>
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            color: '#1e293b',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Typography Showcase
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Explore different typography styles and layouts
        </p>

        {/* Style Filter */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-6">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedStyle === style.value
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          <AnimatePresence>
            {filteredCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`${getCardSize(card.width, card.height)} mb-4 p-3 sm:p-4 md:p-6 rounded-lg border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
                style={{
                  fontFamily: card.fontFamily,
                  backgroundColor: card.backgroundColor,
                  borderColor: card.borderColor,
                  color: card.color
                }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 
                      className="font-bold mb-2 leading-tight"
                      style={{ 
                        fontSize: card.fontSize,
                        fontWeight: card.fontWeight,
                        color: card.color
                      }}
                    >
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p 
                        className="text-sm opacity-80 mb-3"
                        style={{ color: card.color }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                  <p 
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ 
                      color: card.color,
                      opacity: 0.8
                    }}
                  >
                    {card.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </Masonry>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-8">
        <p 
          className="text-sm text-slate-500"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {filteredCards.length} typography styles • Click cards to explore
        </p>
      </div>
    </div>
  );
};

export default TypographyPosterGrid;
