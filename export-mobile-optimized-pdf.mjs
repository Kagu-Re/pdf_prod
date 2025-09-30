import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const exportMobileOptimizedPDF = async () => {
  console.log('🚀 Starting Mobile-Optimized WaterRippleTriptych PDF export...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Export for different device sizes
    const deviceConfigs = [
      { name: 'mobile', width: 375, height: 812, scale: 2 },
      { name: 'tablet', width: 768, height: 1024, scale: 2 },
      { name: 'desktop', width: 1080, height: 1350, scale: 2 }
    ];

    for (const config of deviceConfigs) {
      console.log(`📱 Exporting for ${config.name} (${config.width}x${config.height})...`);
      
      const page = await browser.newPage();
      
      await page.setViewport({
        width: config.width,
        height: config.height,
        deviceScaleFactor: config.scale
      });

      const url = 'http://localhost:5173/?component=WaterRippleTriptych';
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      await page.evaluateHandle('document.fonts.ready');
      await page.waitForSelector('.w-full', { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      const outputDir = `./out/water-ripple/${config.name}`;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Export each slide for this device size
      const slides = [
        { name: 'slide-01-problem', title: 'The Problem' },
        { name: 'slide-02-discovery', title: 'The Discovery' },
        { name: 'slide-03-solution', title: 'The Solution' },
        { name: 'slide-04-implementation', title: 'The Implementation' },
        { name: 'slide-05-future', title: 'The Future' },
        { name: 'slide-06-typography', title: 'Typography Showcase' }
      ];

      for (let i = 0; i < slides.length; i++) {
        console.log(`  📄 Exporting slide ${i + 1}: ${slides[i].title}`);
        
        await page.evaluate((slideIndex) => {
          const indicators = document.querySelectorAll('button[class*="w-3 h-3 rounded-full"]');
          if (indicators[slideIndex]) {
            indicators[slideIndex].click();
          }
        }, i);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (i === 5) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        const pdfPath = path.join(outputDir, `${slides[i].name}.pdf`);
        
        await page.pdf({
          path: pdfPath,
          width: `${config.width}px`,
          height: `${config.height}px`,
          printBackground: true,
          margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });
        
        console.log(`  ✅ Exported: ${pdfPath}`);
      }

      await page.close();
    }

    // Create a comprehensive summary
    const summaryPath = './out/water-ripple/mobile-optimization-summary.md';
    const summaryContent = `# Mobile-Optimized WaterRippleTriptych PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Mobile-Optimized)
- **Total Slides**: 6 per device size
- **Device Sizes**: Mobile (375x812), Tablet (768x1024), Desktop (1080x1350)
- **Quality**: 2x DPI for all devices

## Mobile Optimizations Applied

### Typography
- **Responsive Font Sizes**: Using \`clamp()\` for fluid typography scaling
- **Mobile-First Approach**: Smaller base sizes that scale up
- **Readable Text**: Optimized for mobile reading distances

### Layout
- **Responsive Grid**: Masonry layout adapts from 1 column (mobile) to 4 columns (desktop)
- **Flexible Card Sizes**: Cards scale appropriately for each device
- **Touch-Friendly**: Larger touch targets on mobile devices

### Spacing & Padding
- **Adaptive Padding**: Reduces on mobile, increases on larger screens
- **Responsive Margins**: Optimized spacing for each device size
- **Content Density**: Balanced information density for each screen size

## Device-Specific Exports

### Mobile (375x812px)
- **Location**: \`./out/water-ripple/mobile/\`
- **Use Case**: Smartphone presentations, mobile-first designs
- **Features**: Single column layout, larger touch targets, optimized typography

### Tablet (768x1024px)
- **Location**: \`./out/water-ripple/tablet/\`
- **Use Case**: Tablet presentations, medium screen designs
- **Features**: 2-column layout, balanced typography, touch-friendly interface

### Desktop (1080x1350px)
- **Location**: \`./out/water-ripple/desktop/\`
- **Use Case**: Desktop presentations, large screen displays
- **Features**: 4-column layout, full typography showcase, detailed content

## Typography Showcase Features
- **12 Typography Styles**: Minimal, Bold, Elegant, Modern, Vintage, Futuristic
- **Interactive Filtering**: Filter by typography style
- **Responsive Cards**: Cards adapt to screen size
- **Educational Content**: Typography principles and best practices

## Usage Recommendations
- **Mobile**: Use for social media, mobile presentations, quick reference
- **Tablet**: Use for client meetings, medium-screen presentations
- **Desktop**: Use for detailed presentations, print materials, comprehensive showcases

## Technical Notes
- All exports maintain the water ripple aesthetic
- Typography scales fluidly across all device sizes
- High-quality 2x DPI for crisp rendering on all devices
- Optimized for both portrait and landscape orientations
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Mobile-optimized WaterRippleTriptych PDF export completed!');
    console.log('📁 Check ./out/water-ripple/ for device-specific exports');

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

exportMobileOptimizedPDF().catch(console.error);

