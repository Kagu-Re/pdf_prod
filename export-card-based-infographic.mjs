import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const exportCardBasedInfographic = async () => {
  console.log('🚀 Starting Card-Based Infographic PDF export...');
  
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

    console.log('📊 Capturing card-based infographic...');
    
    // Capture the single page infographic
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
    
    // Save the PDF
    const pdfPath = path.join(outputDir, 'digital-transformation-cards.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log(`✅ Card-Based Infographic PDF saved: ${pdfPath}`);

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'card-based-infographic-summary.md');
    const summaryContent = `# Digital Transformation Card-Based Infographic PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Card-Based Infographic)
- **Format**: Single PDF page with individual cards
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **File Size**: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB

## Card-Based Design Features
- **Individual Cards**: Each step is a separate card element
- **Clean Layout**: Horizontal card layout with icon and content
- **New Icon Pack**: Updated icons for better visual representation
- **Consistent Spacing**: Uniform gaps between cards
- **Hover Effects**: Cards have subtle hover animations
- **Professional Design**: Clean, modern card aesthetic

## Card Structure
Each card contains:
- **Large Icon**: 20x20 rounded icon with gradient background
- **Step Number**: Small circular badge with step number
- **Title & Subtitle**: Clear typography hierarchy
- **Content**: Descriptive text about the step
- **Statistics**: Success rate and timeline in bordered boxes

## Updated Icons
1. **The Problem** - alert-circle (Red #EF4444)
2. **The Discovery** - search (Green #10B981)
3. **The Solution** - check-circle (Blue #3B82F6)
4. **The Implementation** - settings (Orange #F59E0B)
5. **The Future** - trending-up (Purple #8B5CF6)

## Design Improvements
- **Better Icon Pack**: More appropriate icons for each step
- **Card Layout**: Clean horizontal layout for each step
- **Visual Hierarchy**: Clear separation between elements
- **Color Consistency**: Updated color palette for better contrast
- **Responsive Design**: Cards adapt to different screen sizes
- **Professional Spacing**: Consistent padding and margins

## Card Features
- **Icon Section**: Large, prominent icon with gradient background
- **Content Section**: Title, subtitle, description, and statistics
- **Step Number**: Small circular badge for easy identification
- **Statistics Boxes**: Success rate and timeline in bordered containers
- **Hover Effects**: Subtle shadow and scale effects

## Visual Elements
- **Gradient Backgrounds**: Each icon has a gradient background
- **Shadow Effects**: Cards have subtle shadows for depth
- **Border Accents**: Statistics boxes have colored borders
- **Typography**: Professional font hierarchy
- **Color Coding**: Each step has its own accent color

## Recommended Usage
- **Business Presentations**: Clean, professional card format
- **Client Proposals**: Easy-to-read individual steps
- **Social Media**: 4:5 aspect ratio perfect for Instagram
- **Print Materials**: High-quality card-based output
- **Reports & Documentation**: Clear step-by-step visualization
- **Email Attachments**: Single file, easy to share

## Technical Specifications
- **Resolution**: 2160 x 2700 pixels (2x DPI)
- **Color Space**: RGB
- **Background**: Dynamic gradients with subtle patterns
- **Typography**: Professional font hierarchy
- **Card Effects**: Shadows, gradients, and hover states
- **PDF Version**: 1.4 (compatible with all viewers)

## Mobile Optimization
- Responsive card layout for all screen sizes
- Touch-friendly card interactions
- Optimized typography for mobile reading
- Clear visual hierarchy on all devices

## Advantages of Card-Based Design
- **Individual Focus**: Each step gets its own dedicated space
- **Easy Scanning**: Clear visual separation between steps
- **Professional Look**: Clean, modern card aesthetic
- **Better Readability**: Improved content organization
- **Visual Appeal**: More engaging than list format
- **Consistent Design**: Uniform card structure

## Color Scheme
- **Step 1 (Problem)**: Red (#EF4444) - Alert/Problem indication
- **Step 2 (Discovery)**: Green (#10B981) - Growth/Discovery
- **Step 3 (Solution)**: Blue (#3B82F6) - Trust/Solution
- **Step 4 (Implementation)**: Orange (#F59E0B) - Action/Implementation
- **Step 5 (Future)**: Purple (#8B5CF6) - Innovation/Future

## Notes
- Clean, professional card-based design
- Updated icon pack for better visual representation
- Individual cards for each transformation step
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Card-Based Infographic PDF export completed successfully!');
    console.log(`📁 Main file: ${pdfPath}`);
    console.log(`📐 Dimensions: 1080 x 1350 pixels (4:5 portrait)`);
    console.log(`💾 File size: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

// Run the export
exportCardBasedInfographic().catch(console.error);

