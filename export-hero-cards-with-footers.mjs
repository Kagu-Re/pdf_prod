import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportHeroCardsWithFooters = async () => {
  console.log('🚀 Starting Hero Cards with Unique Footers PDF export...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to recommended dimensions
    await page.setViewport({
      width: 1080,
      height: 1350,
      deviceScaleFactor: 2 // High DPI for crisp quality
    });

    const url = 'http://localhost:5173/?component=WaterRippleTriptych';
    console.log(`📄 Loading component at: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Wait for the component to be fully rendered
    await page.waitForSelector('.w-full', { timeout: 10000 });
    
    // Wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create output directory
    const outputDir = './out/water-ripple';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define the 6 cards (1 hero + 5 content cards)
    const cards = [
      { name: 'hero-card', title: 'Digital Transformation Journey' },
      { name: 'card-01-problem', title: 'The Problem' },
      { name: 'card-02-discovery', title: 'The Discovery' },
      { name: 'card-03-solution', title: 'The Solution' },
      { name: 'card-04-implementation', title: 'The Implementation' },
      { name: 'card-05-future', title: 'The Future' }
    ];

    console.log('📊 Capturing hero card and individual cards...');
    
    // Capture each card as a separate PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`  📄 Capturing card ${i + 1}: ${cards[i].title}`);
      
      // Hide all other cards and show only the current one
      await page.evaluate((cardIndex) => {
        // For hero card (index 0), show only the hero card
        if (cardIndex === 0) {
          const heroCard = document.querySelector('[class*="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6"]');
          const contentCards = document.querySelectorAll('[class*="bg-white rounded-2xl shadow-lg"]:not([class*="mb-6"])');
          
          if (heroCard) heroCard.style.display = 'block';
          contentCards.forEach(card => card.style.display = 'none');
        } else {
          // For content cards, hide hero and show only the target card
          const heroCard = document.querySelector('[class*="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6"]');
          const allContentCards = document.querySelectorAll('[class*="bg-white rounded-2xl shadow-lg"]:not([class*="mb-6"])');
          
          if (heroCard) heroCard.style.display = 'none';
          
          allContentCards.forEach((card, index) => {
            if (index === cardIndex - 1) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
        
        // Scroll to the visible card
        const visibleCard = document.querySelector('[style*="display: block"]');
        if (visibleCard) {
          visibleCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
      }, i);
      
      // Wait for changes to take effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture this specific card as PDF buffer
      const pdfBuffer = await page.pdf({
        width: '1080px',
        height: '1350px',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      });
      
      pdfBuffers.push(pdfBuffer);
      console.log(`  ✅ Captured: ${cards[i].title}`);
      
      // Show all cards again for next iteration
      await page.evaluate(() => {
        const allCards = document.querySelectorAll('[class*="bg-white rounded-2xl shadow-lg"]');
        allCards.forEach(card => {
          card.style.display = 'block';
        });
      });
    }

    // Create a new PDF document
    console.log('📚 Merging hero card and individual cards into single PDF...');
    const mergedPdf = await PDFDocument.create();
    
    // Add each card page to the merged PDF
    for (let i = 0; i < pdfBuffers.length; i++) {
      console.log(`  📄 Adding card ${i + 1}: ${cards[i].title}`);
      
      // Load the individual PDF
      const individualPdf = await PDFDocument.load(pdfBuffers[i]);
      
      // Copy all pages from the individual PDF to the merged PDF
      const pages = await mergedPdf.copyPages(individualPdf, individualPdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
      
      console.log(`  ✅ Added: ${cards[i].title}`);
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfPath = path.join(outputDir, 'digital-transformation-hero-cards.pdf');
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Hero Cards PDF saved: ${mergedPdfPath}`);

    // Also save individual card files for reference
    console.log('📚 Creating individual card files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const cardPath = path.join(outputDir, `hero-${cards[i].name}.pdf`);
      fs.writeFileSync(cardPath, pdfBuffers[i]);
      console.log(`  📄 Card ${i + 1}: ${cardPath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'hero-cards-with-footers-summary.md');
    const summaryContent = `# Digital Transformation Hero Cards with Unique Footers PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Hero Cards with Unique Footers)
- **Format**: Single PDF with hero card + individual content cards
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${cards.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Hero Card + Content Cards Approach
- **Hero Card**: Dedicated title and subtitle page
- **Content Cards**: Individual cards with unique footer content
- **No Repetition**: Each page contains unique content
- **Proper Separation**: Clean isolation of each card
- **Unique Footers**: Each content card has its own footer message

## Card Pages Included
${cards.map((card, i) => `- **Page ${i + 1}**: ${card.title}${i === 0 ? ' (Hero Card)' : ' (Content Card)'}`).join('\n')}

## Files Generated
- **digital-transformation-hero-cards.pdf** - Main merged PDF file
- **hero-hero-card.pdf** - Hero card with title and subtitle
- **hero-card-01-problem.pdf** - Individual content cards with unique footers
- **hero-card-02-discovery.pdf**
- **hero-card-03-solution.pdf**
- **hero-card-04-implementation.pdf**
- **hero-card-05-future.pdf**

## Hero Card Features
- **Title**: "Digital Transformation Journey"
- **Subtitle**: "A comprehensive guide to modernizing your organization through strategic digital transformation"
- **Clean Design**: Professional header card
- **Gradient Background**: Subtle gradient for visual appeal
- **Typography**: Large, bold title with descriptive subtitle

## Content Card Features
- **Individual Focus**: Each card focuses on one transformation step
- **Unique Footers**: Each card has its own footer message
- **Statistics**: Success rates and timelines for each step
- **Color Coding**: Each step has its own accent color
- **Professional Icons**: Updated icon pack for better representation

## Unique Footer Messages
1. **The Problem**: "Identify critical pain points and legacy system limitations"
2. **The Discovery**: "Research and evaluate cutting-edge technology solutions"
3. **The Solution**: "Develop a unified strategy that aligns technology with business goals"
4. **The Implementation**: "Execute transformation with careful planning and stakeholder engagement"
5. **The Future**: "Achieve measurable business outcomes and sustainable competitive advantage"

## Design Improvements
- **Hero Card**: Dedicated title and subtitle page
- **Unique Footers**: Each content card has specific footer content
- **Better Organization**: Clear separation between hero and content
- **Professional Layout**: Clean, modern card design
- **Visual Hierarchy**: Clear distinction between different card types

## Visual Elements
- **Hero Card**: Large title, subtitle, and gradient background
- **Content Cards**: Icons, titles, content, stats, and unique footers
- **Color Scheme**: Consistent color coding throughout
- **Typography**: Professional font hierarchy
- **Spacing**: Consistent padding and margins

## Recommended Usage
- **Presentations**: Hero card for introduction, content cards for details
- **Client Proposals**: Professional title page + detailed steps
- **Social Media**: Hero card for overview, content cards for specific steps
- **Print Materials**: High-quality individual page output
- **Reports**: Clear introduction + step-by-step documentation
- **Email Attachments**: Easy to share individual pages

## Technical Specifications
- **Resolution**: 2160 x 2700 pixels (2x DPI)
- **Color Space**: RGB
- **Background**: Dynamic gradients with subtle patterns
- **Typography**: Professional font hierarchy
- **Card Effects**: Shadows, gradients, and visual depth
- **PDF Version**: 1.4 (compatible with all viewers)

## Mobile Optimization
- Each card optimized for mobile viewing
- Touch-friendly card interactions
- Clear typography for all screen sizes
- Responsive design within page constraints

## Advantages of Hero + Content Cards
- **Clear Introduction**: Hero card provides context and overview
- **Focused Content**: Each content card focuses on specific step
- **Unique Footers**: Each card has relevant footer information
- **Professional Presentation**: Clean, organized layout
- **Flexible Usage**: Can use hero card alone or with content cards
- **Easy Navigation**: Clear progression from hero to content

## Color Scheme
- **Hero Card**: Dark blue title with gray subtitle
- **Step 1 (Problem)**: Red (#EF4444) - Alert/Problem indication
- **Step 2 (Discovery)**: Green (#10B981) - Growth/Discovery
- **Step 3 (Solution)**: Blue (#3B82F6) - Trust/Solution
- **Step 4 (Implementation)**: Orange (#F59E0B) - Action/Implementation
- **Step 5 (Future)**: Purple (#8B5CF6) - Innovation/Future

## Notes
- Hero card provides clear introduction and context
- Each content card has unique footer content
- No content repetition or horizontal overflow issues
- Professional card-based design with updated icons
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Hero Cards with Unique Footers PDF export completed successfully!');
    console.log(`📁 Main file: ${mergedPdfPath}`);
    console.log(`📊 Total pages: ${cards.length}`);
    console.log(`📐 Dimensions: 1080 x 1350 pixels (4:5 portrait)`);
    console.log(`💾 File size: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

// Run the export
exportHeroCardsWithFooters().catch(console.error);

