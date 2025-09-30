import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000',
    padding: 40,
    color: '#fff',
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#00ff41',
  },
  content: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff',
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

// Simple test document
const TestDocument = () => (
  <Document>
    <Page size={{ width: 1200, height: 1500 }} style={styles.page}>
      <View>
        <Text style={styles.slideNumber}>1/3</Text>
        <Text style={styles.title}>TEST PDF</Text>
        <Text style={styles.content}>This is a test PDF to verify export functionality</Text>
      </View>
    </Page>
    <Page size={{ width: 1200, height: 1500 }} style={styles.page}>
      <View>
        <Text style={styles.slideNumber}>2/3</Text>
        <Text style={styles.title}>CYBERPUNK</Text>
        <Text style={styles.content}>Neon colors and futuristic design</Text>
      </View>
    </Page>
    <Page size={{ width: 1200, height: 1500 }} style={styles.page}>
      <View>
        <Text style={styles.slideNumber}>3/3</Text>
        <Text style={styles.title}>SUCCESS</Text>
        <Text style={styles.content}>PDF export is working!</Text>
      </View>
    </Page>
  </Document>
);

const TestPDF: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 font-mono">
          PDF EXPORT TEST
        </h1>
        
        <div className="bg-gray-900 border-2 border-green-400 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Test PDF Generation</h2>
          <p className="text-lg mb-6">
            This is a simple test to verify PDF export functionality
          </p>
          
          <PDFDownloadLink
            document={<TestDocument />}
            fileName="test-cyberpunk.pdf"
            className="inline-block bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-8 rounded-lg transition-colors font-mono text-lg"
          >
            [DOWNLOAD] TEST PDF
          </PDFDownloadLink>
        </div>
        
        <div className="text-sm text-gray-400 space-y-2">
          <p>If this works, the issue is with the main carousel components</p>
          <p>If this doesn't work, there's a React-PDF configuration issue</p>
        </div>
        
        <div className="mt-8">
          <a
            href="?component=Home"
            className="bg-gray-800 hover:bg-gray-700 text-green-400 px-6 py-3 rounded-lg font-mono border border-green-400 transition-colors"
          >
            [BACK] TO HOME
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPDF;




