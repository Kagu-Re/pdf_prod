// Advanced Texture Library inspired by CSS3patterns and CSSgram
export class TextureLibrary {
  // CSS3patterns inspired patterns
  static getPatterns() {
    return {
      // Noise texture simulation
      noise: {
        background: `
          background: 
            radial-gradient(circle at 20% 20%, rgba(0, 255, 65, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
        `,
        opacity: 0.3
      },
      
      // Circuit board pattern
      circuit: {
        background: `
          background-image: 
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        `,
        opacity: 0.4
      },
      
      // Holographic effect
      holographic: {
        background: `
          background: 
            linear-gradient(45deg, rgba(0, 255, 65, 0.1) 0%, transparent 25%),
            linear-gradient(-45deg, rgba(255, 0, 128, 0.1) 0%, transparent 25%),
            linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, transparent 25%);
        `,
        opacity: 0.5
      },
      
      // Matrix rain effect
      matrix: {
        background: `
          background-image: 
            linear-gradient(90deg, transparent 0%, rgba(0, 255, 65, 0.1) 50%, transparent 100%),
            linear-gradient(0deg, transparent 0%, rgba(0, 255, 65, 0.05) 50%, transparent 100%);
          background-size: 2px 100px, 100px 2px;
        `,
        opacity: 0.6
      },
      
      // Cyberpunk grid
      cyberpunk: {
        background: `
          background-image: 
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        `,
        opacity: 0.4
      }
    };
  }
  
  // CSSgram inspired filters
  static getFilters() {
    return {
      neon: {
        filter: 'brightness(1.2) contrast(1.1) saturate(1.3)',
        textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
      },
      
      cyberpunk: {
        filter: 'hue-rotate(120deg) saturate(1.5) contrast(1.2)',
        textShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41'
      },
      
      hologram: {
        filter: 'hue-rotate(180deg) saturate(2) brightness(1.1)',
        textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff'
      },
      
      matrix: {
        filter: 'hue-rotate(90deg) saturate(1.8) contrast(1.5)',
        textShadow: '0 0 3px #00ff41, 0 0 6px #00ff41, 0 0 9px #00ff41'
      }
    };
  }
  
  // Advanced typography effects
  static getTypography() {
    return {
      cyberpunk: {
        fontFamily: 'Orbitron, monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        textShadow: '0 0 10px currentColor',
        fontWeight: 'bold'
      },
      
      futuristic: {
        fontFamily: 'Rajdhani, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: '600'
      },
      
      neon: {
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        fontWeight: 'bold'
      },
      
      holographic: {
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        background: 'linear-gradient(45deg, #00ff41, #00ffff, #ff0080)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }
    };
  }
  
  // Generate random texture combination
  static getRandomTexture() {
    const patterns = Object.keys(this.getPatterns());
    const filters = Object.keys(this.getFilters());
    const typography = Object.keys(this.getTypography());
    
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const randomFilter = filters[Math.floor(Math.random() * filters.length)];
    const randomTypography = typography[Math.floor(Math.random() * typography.length)];
    
    return {
      pattern: this.getPatterns()[randomPattern],
      filter: this.getFilters()[randomFilter],
      typography: this.getTypography()[randomTypography],
      name: `${randomPattern}-${randomFilter}-${randomTypography}`
    };
  }
  
  // Create CSS string for texture
  static createTextureCSS(textureName: string) {
    const textures = this.getPatterns();
    const filters = this.getFilters();
    const typography = this.getTypography();
    
    if (!textures[textureName]) {
      return '';
    }
    
    return `
      ${textures[textureName].background}
      filter: ${filters.cyberpunk.filter};
      ${Object.entries(typography.cyberpunk).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    `;
  }
}

// Export utility functions
export const createAdvancedSlide = (slideData: any, textureType: string = 'cyberpunk') => {
  const texture = TextureLibrary.getPatterns()[textureType] || TextureLibrary.getPatterns().cyberpunk;
  const filter = TextureLibrary.getFilters().cyberpunk;
  const typography = TextureLibrary.getTypography().cyberpunk;
  
  return {
    ...slideData,
    style: {
      background: texture.background,
      filter: filter.filter,
      ...typography
    }
  };
};

export default TextureLibrary;




