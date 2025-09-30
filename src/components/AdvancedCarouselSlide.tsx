import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Advanced styles with texture effects and typography
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000000',
    padding: 0,
    color: '#00ff41',
    fontFamily: 'Helvetica-Bold',
    width: 1080,
    height: 1350,
  },
  slide: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0a0a0a',
    // Simulated texture background using gradients
    background: 'linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #0a0a0a 100%)',
  },
  // Texture overlay simulation
  textureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.8,
  },
  // Noise pattern simulation
  noisePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.1,
  },
  // Main content container
  contentContainer: {
    position: 'relative',
    zIndex: 10,
    padding: 80,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Advanced typography styles
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#00ff41',
    textTransform: 'uppercase',
    letterSpacing: 6,
    // Simulated text shadow effect
    textShadow: '0 0 20px #00ff41',
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 40,
    color: '#ff0080',
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontFamily: 'Helvetica-Bold',
  },
  content: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffffff',
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
    maxWidth: '90%',
  },
  // Special effect text with advanced styling
  specialText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#00ffff',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#00ffff',
    color: '#000000',
    padding: '12px 24px',
    borderRadius: 8,
    border: '2px solid #00ffff',
  },
  // Slide number with advanced styling
  slideNumber: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: '#ff0080',
    color: '#000000',
    padding: '12px 20px',
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 6,
    fontFamily: 'Helvetica-Bold',
  },
  // Corner accents with texture
  cornerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderTop: '4px solid #00ff41',
    borderLeft: '4px solid #00ff41',
    borderTopLeftRadius: 8,
  },
  cornerAccentBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottom: '4px solid #ff0080',
    borderRight: '4px solid #ff0080',
    borderBottomRightRadius: 8,
  },
  // Data stream with gradient effect
  dataStream: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00ff41',
    opacity: 0.7,
  },
  // Grid container for data slides
  gridContainer: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'space-around',
    width: '85%',
  },
  gridItem: {
    width: '30%',
    padding: 20,
    backgroundColor: '#00ff41',
    color: '#000000',
    borderRadius: 12,
    textAlign: 'center',
    marginHorizontal: 8,
    border: '2px solid #00ff41',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  gridText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  // Code block with advanced styling
  codeBlock: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1a1a2e',
    padding: 30,
    borderRadius: 12,
    border: '2px solid #00ff41',
    width: '85%',
  },
  codeText: {
    fontSize: 18,
    color: '#00ff41',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  // Floating elements simulation
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: 20,
    height: 20,
    backgroundColor: '#00ff41',
    opacity: 0.6,
    borderRadius: 10,
  },
  floatingElement2: {
    position: 'absolute',
    top: '70%',
    right: '15%',
    width: 15,
    height: 15,
    backgroundColor: '#ff0080',
    opacity: 0.5,
    borderRadius: 7.5,
  },
  floatingElement3: {
    position: 'absolute',
    top: '40%',
    right: '8%',
    width: 12,
    height: 12,
    backgroundColor: '#00ffff',
    opacity: 0.4,
    borderRadius: 6,
  },
});

// Advanced slide data with more sophisticated content
const advancedSlides = [
  {
    id: 1,
    title: "NEURAL",
    subtitle: "ARCHITECTURE",
    content: "Building the future of artificial intelligence\nOne algorithm at a time",
    special: "SYSTEM_INITIALIZED",
    type: "title"
  },
  {
    id: 2,
    title: "QUANTUM",
    subtitle: "COMPUTING",
    content: "Harnessing the power of quantum mechanics\nTo solve impossible problems",
    special: "QUANTUM_STATE_ACTIVE",
    type: "concept"
  },
  {
    id: 3,
    title: "BIOMETRIC",
    subtitle: "AUTHENTICATION",
    content: "Your body becomes your password\nSecurity redefined",
    special: "BIOMETRIC_SCAN_COMPLETE",
    type: "security"
  },
  {
    id: 4,
    title: "EDGE",
    subtitle: "COMPUTING",
    content: "Processing at the edge of possibility\nWhere data meets destiny",
    special: "EDGE_NODES_ONLINE",
    type: "data"
  },
  {
    id: 5,
    title: "BLOCKCHAIN",
    subtitle: "REVOLUTION",
    content: "Decentralized trust in a centralized world\nDemocracy of data",
    special: "BLOCK_VERIFIED",
    type: "crypto"
  },
  {
    id: 6,
    title: "AUGMENTED",
    subtitle: "REALITY",
    content: "Blurring the lines between\nDigital and physical worlds",
    special: "AR_OVERLAY_ACTIVE",
    type: "reality"
  },
  {
    id: 7,
    title: "MACHINE",
    subtitle: "LEARNING",
    content: "Teaching machines to think\nLearning from their mistakes",
    special: "MODEL_TRAINING",
    type: "ai"
  },
  {
    id: 8,
    title: "CYBERSECURITY",
    subtitle: "FRONTLINE",
    content: "Defending against digital threats\nIn an interconnected world",
    special: "THREAT_DETECTED",
    type: "security"
  },
  {
    id: 9,
    title: "CLOUD",
    subtitle: "NATIVE",
    content: "Born in the cloud\nBuilt for scale",
    special: "CLOUD_DEPLOYED",
    type: "infrastructure"
  },
  {
    id: 10,
    title: "IOT",
    subtitle: "ECOSYSTEM",
    content: "Everything connected\nEverywhere intelligent",
    special: "DEVICES_SYNCED",
    type: "connectivity"
  },
  {
    id: 11,
    title: "FUTURE",
    subtitle: "TECHNOLOGY",
    content: "Tomorrow's solutions\nToday's innovations",
    special: "FUTURE_LOADING",
    type: "vision"
  },
  {
    id: 12,
    title: "INNOVATION",
    subtitle: "CONTINUES",
    content: "The journey never ends\nOnly evolves",
    special: "EVOLUTION_COMPLETE",
    type: "end"
  }
];

// Advanced PDF Document optimized for LinkedIn
const AdvancedCarouselSlide = () => (
  <Document>
    {advancedSlides.map((slide) => (
      <Page key={slide.id} size={{ width: 1080, height: 1350 }} style={styles.page}>
        <View style={styles.slide}>
          {/* Texture overlays */}
          <View style={styles.textureOverlay} />
          <View style={styles.noisePattern} />
          
          {/* Floating elements */}
          <View style={styles.floatingElement1} />
          <View style={styles.floatingElement2} />
          <View style={styles.floatingElement3} />
          
          {/* Corner accents */}
          <View style={styles.cornerAccent} />
          <View style={styles.cornerAccentBR} />
          
          {/* Data stream */}
          <View style={styles.dataStream} />
          
          {/* Slide number */}
          <Text style={styles.slideNumber}>{slide.id}/12</Text>
          
          {/* Main content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
            <Text style={styles.content}>{slide.content}</Text>
            <Text style={styles.specialText}>{slide.special}</Text>
          </View>
          
          {/* Grid for data slides */}
          {slide.type === 'data' && (
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.gridTitle}>DATA</Text>
                <Text style={styles.gridText}>Processed</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridTitle}>NODES</Text>
                <Text style={styles.gridText}>Active</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridTitle}>LATENCY</Text>
                <Text style={styles.gridText}>Minimal</Text>
              </View>
            </View>
          )}
          
          {/* Code block for technical slides */}
          {(slide.type === 'ai' || slide.type === 'crypto') && (
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                if (innovation.continues) {'{'}
                {'\n'}  return future.possible;
                {'\n}'}
              </Text>
            </View>
          )}
        </View>
      </Page>
    ))}
  </Document>
);

export default AdvancedCarouselSlide;




