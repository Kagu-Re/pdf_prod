import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const exportSinglePageInfographic = async () => {
  console.log('🚀 Starting Single Page Infographic PDF export...');
  
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

    console.log('📊 Capturing single page infographic...');
    
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
    const pdfPath = path.join(outputDir, 'digital-transformation-infographic.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log(`✅ Single Page Infographic PDF saved: ${pdfPath}`);

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'single-page-infographic-summary.md');
    const summaryContent = `# Digital Transformation Single Page Infographic PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Single Page Infographic)
- **Format**: Single PDF page (no sliders, no typography showcase)
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **File Size**: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB

## Single Page Infographic Features
- **No Sliders**: Clean, static infographic design
- **No Typography Showcase**: Focused on transformation journey
- **Alternating Layout**: Content alternates left/right for visual flow
- **Complete Journey**: All 5 steps in one comprehensive view
- **Data Visualization**: Success rates and timelines for each step
- **Professional Design**: Clean, modern infographic aesthetic

## Infographic Steps Included
1. **The Problem** - Digital Transformation Challenges (75% success, 3-6mo)
2. **The Discovery** - Emerging Solutions (40% success, 1-2mo)
3. **The Solution** - Integrated Approach (90% success, 6-12mo)
4. **The Implementation** - Strategic Execution (60% success, 2-4mo)
5. **The Future** - Sustainable Growth (85% success, 12+mo)

## Design Elements
- **Header Section**: "Digital Transformation Journey" title with description
- **Step Badges**: Color-coded circular badges with step numbers
- **Alternating Layout**: Content and visuals alternate sides
- **Statistics Cards**: Success rates and timelines for each step
- **Visual Icons**: Large, prominent icons for each step
- **Decorative Elements**: Floating circles and visual accents
- **Footer Branding**: "Complete Digital Transformation Journey"

## Visual Hierarchy
- **Main Title**: Large, bold typography for impact
- **Step Titles**: Clear, readable step names
- **Step Subtitles**: Color-coded descriptive text
- **Content**: Readable body text with proper spacing
- **Statistics**: Highlighted data points in cards
- **Visual Elements**: Icons and decorative elements

## Recommended Usage
- **Business Presentations**: Complete journey overview
- **Client Proposals**: Comprehensive transformation guide
- **Social Media**: 4:5 aspect ratio perfect for Instagram
- **Print Materials**: High-quality infographic output
- **Reports & Documentation**: Visual journey representation
- **Email Attachments**: Single file easy to share

## Technical Specifications
- **Resolution**: 2160 x 2700 pixels (2x DPI)
- **Color Space**: RGB
- **Background**: Dynamic gradients with subtle patterns
- **Typography**: Professional font hierarchy
- **Visual Effects**: Shadows, gradients, and depth
- **PDF Version**: 1.4 (compatible with all viewers)

## Mobile Optimization
- Responsive typography within infographic constraints
- Clean, readable text at all zoom levels
- Optimized for both mobile and desktop viewing
- Clear visual hierarchy on all screen sizes

## Advantages of Single Page Design
- **Complete Overview**: All information in one view
- **No Navigation**: No need for sliders or interactions
- **Print Friendly**: Perfect for printing and sharing
- **Social Media Ready**: Ideal for Instagram and other platforms
- **Professional**: Clean, business-ready presentation
- **Easy to Share**: Single file, no complex interactions

## Color Scheme
- **Step 1 (Problem)**: Red (#D44F4F)
- **Step 2 (Discovery)**: Green (#6A9B6A)
- **Step 3 (Solution)**: Blue (#6A7B9B)
- **Step 4 (Implementation)**: Orange (#FF6B35)
- **Step 5 (Future)**: Purple (#8B5CF6)

## Notes
- Clean, professional infographic design
- No interactive elements or sliders
- Focused on the digital transformation journey
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Single Page Infographic PDF export completed successfully!');
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
exportSinglePageInfographic().catch(console.error);

