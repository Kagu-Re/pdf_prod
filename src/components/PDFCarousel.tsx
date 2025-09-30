import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Use built-in fonts for better PDF compatibility
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000',
    padding: 40,
    color: '#fff',
    fontFamily: 'Helvetica',
  },
  slide: {
    width: '100%',
    height: '100%',
    position: 'relative',
    border: '3px solid #ff4500',
    padding: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    textTransform: 'uppercase',
  },
  content: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    lineHeight: 1.4,
  },
  listItem: {
    fontSize: 28,
    marginBottom: 15,
    color: '#fff',
    paddingLeft: 20,
  },
  hashtags: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 30,
  },
  slideNumber: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff4500',
    color: '#000',
    padding: '10px 20px',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

// Slide data
const slides = [
  {
    id: 1,
    title: "ЕКСПЛУАТАЦІЯ",
    subtitle: "ДОСВІДУ",
    content: "Коли знання стають зброєю",
    hashtags: "#досвід #експлуатація"
  },
  {
    id: 2,
    title: "ПРОБЛЕМА",
    content: "Накопичуємо досвід\nАле не використовуємо\nАбо використовуємо неправильно",
    hashtags: "#проблема #досвід"
  },
  {
    id: 3,
    title: "ІСТОРІЯ",
    content: "Молодий розробник vs Ветеран\nХто виграє?",
    hashtags: "#історія #розробка"
  },
  {
    id: 4,
    title: "ПАРАДОКС",
    content: "Досвід допомагає\nАле і обмежує",
    hashtags: "#парадокс #обмеження"
  },
  {
    id: 5,
    title: "ТИПИ",
    content: "Раціональне використання\nМаніпулятивне використання\nЗалежність від минулого",
    hashtags: "#типи #використання"
  },
  {
    id: 6,
    title: "БАЛАНС",
    content: "Exploration vs Exploitation\nПошук vs Використання",
    hashtags: "#баланс #інновації"
  },
  {
    id: 7,
    title: "ПОПЕРЕДЖЕННЯ",
    content: "Надто експлуатуєш = стагнація\nТільки досліджуєш = брак прибутку",
    hashtags: "#попередження #стагнація"
  },
  {
    id: 8,
    title: "РІШЕННЯ",
    content: "70% експлуатації\n30% дослідження",
    hashtags: "#рішення #пропорції"
  },
  {
    id: 9,
    title: "ПИТАННЯ",
    content: "Як ви експлуатуєте свій досвід?",
    hashtags: "#питання #рефлексія"
  },
  {
    id: 10,
    title: "ЗАКЛИК",
    content: "Поділіться своїм досвідом\nУ коментарях",
    hashtags: "#заклик #коментарі"
  },
  {
    id: 11,
    title: "МУДРІСТЬ",
    content: "Досвід - це не те, що з тобою сталося, а те, що ти з цим зробив",
    hashtags: "#мудрість #цитата"
  },
  {
    id: 12,
    title: "КІНЕЦЬ",
    content: "Дякую за увагу!\nЛайк, якщо сподобалося",
    hashtags: "#дякую #лайк"
  }
];

// PDF Document Component
const PDFCarousel = () => (
  <Document>
    {slides.map((slide) => (
      <Page key={slide.id} size={{ width: 1200, height: 1500 }} style={styles.page}>
        <View style={styles.slide}>
          <Text style={styles.slideNumber}>{slide.id}/12</Text>
          <Text style={styles.title}>{slide.title}</Text>
          {slide.subtitle && <Text style={styles.subtitle}>{slide.subtitle}</Text>}
          <Text style={styles.content}>{slide.content}</Text>
          <Text style={styles.hashtags}>{slide.hashtags}</Text>
        </View>
      </Page>
    ))}
  </Document>
);

export default PDFCarousel;
