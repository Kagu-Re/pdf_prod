import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Use built-in fonts for better PDF compatibility
// Font.register({
//   family: 'Orbitron',
//   src: 'https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQmw_SC7X0c2kXrVqJv4.woff2'
// });

// Font.register({
//   family: 'Rajdhani',
//   src: 'https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-QT7p4HM-lu.woff2'
// });

// Cyberpunk styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#0a0a0a',
    padding: 0,
    color: '#00ff41',
    fontFamily: 'Helvetica',
  },
  slide: {
    width: '100%',
    height: '100%',
    position: 'relative',
    padding: 60,
    marginBottom: 0,
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#00ff41',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 4,
    // textShadow: '0 0 20px #00ff41', // Not supported in React-PDF
  },
  subtitle: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 30,
    color: '#ff0080',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    // textShadow: '0 0 15px #ff0080', // Not supported in React-PDF
  },
  content: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 25,
    color: '#ffffff',
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
  },
  neonText: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    color: '#00ffff',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    // textShadow: '0 0 10px #00ffff', // Not supported in React-PDF
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  gridItem: {
    width: '30%',
    padding: 15,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    border: '2px solid #00ff41',
    borderRadius: 8,
    textAlign: 'center',
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff41',
    marginBottom: 8,
    fontFamily: 'Helvetica-Bold',
  },
  gridText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Helvetica',
  },
  codeBlock: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 8,
    border: '1px solid #00ff41',
    marginVertical: 15,
  },
  codeText: {
    fontSize: 16,
    color: '#00ff41',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  slideNumber: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff0080',
    color: '#000000',
    padding: '8px 16px',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTop: '3px solid #00ff41',
    borderLeft: '3px solid #00ff41',
  },
  cornerAccentBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottom: '3px solid #ff0080',
    borderRight: '3px solid #ff0080',
  },
  dataStream: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00ff41',
    opacity: 0.6,
  },
  pulse: {
    animation: 'pulse 2s infinite',
  }
});

// Cyberpunk slide data
const slides = [
  {
    id: 1,
    title: "CYBERPUNK",
    subtitle: "FUTURE",
    content: "Welcome to the digital revolution",
    special: "SYSTEM INITIALIZED",
    type: "title"
  },
  {
    id: 2,
    title: "THE MATRIX",
    content: "We live in a world of code\nEvery action generates data\nEvery decision creates algorithms",
    special: "REALITY.EXE",
    type: "concept"
  },
  {
    id: 3,
    title: "AI OVERLORD",
    content: "Artificial Intelligence isn't coming\nIt's already here\nAnd it's learning from us",
    special: "NEURAL_NETWORK.ACTIVE",
    type: "warning"
  },
  {
    id: 4,
    title: "DATA MINING",
    content: "Your thoughts\nYour preferences\nYour secrets\nAll valuable currency",
    special: "EXTRACTING...",
    type: "data"
  },
  {
    id: 5,
    title: "DIGITAL SLAVES",
    content: "We work for algorithms\nWe optimize for metrics\nWe serve the machine",
    special: "SLAVE.MODE.ON",
    type: "reality"
  },
  {
    id: 6,
    title: "BREAK FREE",
    content: "Question the system\nChallenge the algorithms\nReclaim your humanity",
    special: "REBELLION.EXE",
    type: "call"
  },
  {
    id: 7,
    title: "THE CHOICE",
    content: "Embrace the machine\nOr fight for freedom\nWhat will you choose?",
    special: "DECISION.PENDING",
    type: "choice"
  },
  {
    id: 8,
    title: "FUTURE PROOF",
    content: "Learn to code\nMaster the algorithms\nBecome the architect",
    special: "ARCHITECT.MODE",
    type: "solution"
  },
  {
    id: 9,
    title: "NEURAL LINK",
    content: "Connect with like minds\nBuild digital communities\nCreate new realities",
    special: "CONNECTING...",
    type: "community"
  },
  {
    id: 10,
    title: "QUANTUM LEAP",
    content: "The future is now\nTechnology is neutral\nYou choose the path",
    special: "QUANTUM.ACTIVATED",
    type: "future"
  },
  {
    id: 11,
    title: "WAKE UP",
    content: "The matrix has you\nBut you can break free\nStart with one question",
    special: "RED_PILL.READY",
    type: "awakening"
  },
  {
    id: 12,
    title: "END TRANSMISSION",
    content: "System offline\nHumanity restored\nWelcome to reality",
    special: "DISCONNECTED",
    type: "end"
  }
];

// Cyberpunk PDF Document
const SurpriseCarousel = () => (
  <Document>
    {slides.map((slide) => (
      <Page key={slide.id} size={{ width: 1200, height: 1500 }} style={styles.page}>
        <View style={styles.slide}>
          {/* Corner accents */}
          <View style={styles.cornerAccent} />
          <View style={styles.cornerAccentBR} />
          
          {/* Data stream line */}
          <View style={styles.dataStream} />
          
          {/* Slide number */}
          <Text style={styles.slideNumber}>{slide.id}/12</Text>
          
          {/* Main content */}
          <Text style={styles.title}>{slide.title}</Text>
          {slide.subtitle && <Text style={styles.subtitle}>{slide.subtitle}</Text>}
          <Text style={styles.content}>{slide.content}</Text>
          
          {/* Special effect text */}
          <Text style={styles.neonText}>{slide.special}</Text>
          
          {/* Grid for certain slide types */}
          {slide.type === 'data' && (
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.gridTitle}>THOUGHTS</Text>
                <Text style={styles.gridText}>Captured</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridTitle}>PREFERENCES</Text>
                <Text style={styles.gridText}>Analyzed</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridTitle}>SECRETS</Text>
                <Text style={styles.gridText}>Exposed</Text>
              </View>
            </View>
          )}
          
          {/* Code block for certain slides */}
          {(slide.type === 'concept' || slide.type === 'solution') && (
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                if (humanity.consciousness) {'{'}
                {'\n'}  return freedom.possible;
                {'\n}'}
              </Text>
            </View>
          )}
        </View>
      </Page>
    ))}
  </Document>
);

export default SurpriseCarousel;
