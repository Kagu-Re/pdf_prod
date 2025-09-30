import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Simple styles without complex features
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000',
    padding: 60,
    color: '#00ff41',
    fontFamily: 'Helvetica',
  },
  slide: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#00ff41',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 30,
    color: '#ff0080',
    textTransform: 'uppercase',
  },
  content: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 25,
    color: '#ffffff',
    lineHeight: 1.4,
  },
  neonText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#00ffff',
    textTransform: 'uppercase',
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
  }
});

// Simplified slide data
const slides = [
  {
    id: 1,
    title: "CYBERPUNK",
    subtitle: "FUTURE",
    content: "Welcome to the digital revolution",
    special: "SYSTEM INITIALIZED"
  },
  {
    id: 2,
    title: "THE MATRIX",
    content: "We live in a world of code\nEvery action generates data\nEvery decision creates algorithms",
    special: "REALITY.EXE"
  },
  {
    id: 3,
    title: "AI OVERLORD",
    content: "Artificial Intelligence isn't coming\nIt's already here\nAnd it's learning from us",
    special: "NEURAL_NETWORK.ACTIVE"
  },
  {
    id: 4,
    title: "DATA MINING",
    content: "Your thoughts\nYour preferences\nYour secrets\nAll valuable currency",
    special: "EXTRACTING..."
  },
  {
    id: 5,
    title: "DIGITAL SLAVES",
    content: "We work for algorithms\nWe optimize for metrics\nWe serve the machine",
    special: "SLAVE.MODE.ON"
  },
  {
    id: 6,
    title: "BREAK FREE",
    content: "Question the system\nChallenge the algorithms\nReclaim your humanity",
    special: "REBELLION.EXE"
  },
  {
    id: 7,
    title: "THE CHOICE",
    content: "Embrace the machine\nOr fight for freedom\nWhat will you choose?",
    special: "DECISION.PENDING"
  },
  {
    id: 8,
    title: "FUTURE PROOF",
    content: "Learn to code\nMaster the algorithms\nBecome the architect",
    special: "ARCHITECT.MODE"
  },
  {
    id: 9,
    title: "NEURAL LINK",
    content: "Connect with like minds\nBuild digital communities\nCreate new realities",
    special: "CONNECTING..."
  },
  {
    id: 10,
    title: "QUANTUM LEAP",
    content: "The future is now\nTechnology is neutral\nYou choose the path",
    special: "QUANTUM.ACTIVATED"
  },
  {
    id: 11,
    title: "WAKE UP",
    content: "The matrix has you\nBut you can break free\nStart with one question",
    special: "RED_PILL.READY"
  },
  {
    id: 12,
    title: "END TRANSMISSION",
    content: "System offline\nHumanity restored\nWelcome to reality",
    special: "DISCONNECTED"
  }
];

// Simplified PDF Document
const SimplePDFCarousel = () => (
  <Document>
    {slides.map((slide) => (
      <Page key={slide.id} size={{ width: 1200, height: 1500 }} style={styles.page}>
        <View style={styles.slide}>
          <Text style={styles.slideNumber}>{slide.id}/12</Text>
          <Text style={styles.title}>{slide.title}</Text>
          {slide.subtitle && <Text style={styles.subtitle}>{slide.subtitle}</Text>}
          <Text style={styles.content}>{slide.content}</Text>
          <Text style={styles.neonText}>{slide.special}</Text>
        </View>
      </Page>
    ))}
  </Document>
);

export default SimplePDFCarousel;




