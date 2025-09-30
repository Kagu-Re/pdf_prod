import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the carousel slides data
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

async function exportIndividualSlides() {
  console.log('🚀 Starting individual slide export...');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match carousel dimensions
    await page.setViewport({
      width: 1200,
      height: 1500,
      deviceScaleFactor: 2
    });
    
    // Create HTML for each slide
    for (const slide of slides) {
      console.log(`📸 Creating slide ${slide.id}/12: ${slide.title}`);
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cyberpunk Carousel - Slide ${slide.id}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', monospace;
            background: #000;
            color: #00ff41;
            width: 1200px;
            height: 1500px;
            overflow: hidden;
            position: relative;
        }
        
        .slide {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            position: relative;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .corner-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 50px;
            height: 50px;
            border-top: 3px solid #00ff41;
            border-left: 3px solid #00ff41;
        }
        
        .corner-accent-br {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 50px;
            height: 50px;
            border-bottom: 3px solid #ff0080;
            border-right: 3px solid #ff0080;
        }
        
        .data-stream {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background: #00ff41;
            opacity: 0.6;
        }
        
        .slide-number {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ff0080;
            color: #000;
            padding: 8px 16px;
            border-radius: 4px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            font-size: 16px;
        }
        
        .title {
            font-size: 72px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
            color: #00ff41;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow: 0 0 20px #00ff41;
        }
        
        .subtitle {
            font-size: 36px;
            text-align: center;
            margin-bottom: 30px;
            color: #ff0080;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 15px #ff0080;
        }
        
        .content {
            font-size: 28px;
            text-align: center;
            margin-bottom: 25px;
            color: #ffffff;
            line-height: 1.4;
            font-family: 'Rajdhani', monospace;
        }
        
        .special {
            font-size: 32px;
            text-align: center;
            margin-bottom: 20px;
            color: #00ffff;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 0 10px #00ffff;
            background: rgba(0, 255, 255, 0.1);
            padding: 16px 32px;
            border: 2px solid #00ffff;
            border-radius: 8px;
        }
        
        .grid-container {
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: space-around;
            width: 80%;
        }
        
        .grid-item {
            width: 30%;
            padding: 15px;
            background: rgba(0, 255, 65, 0.1);
            border: 2px solid #00ff41;
            border-radius: 8px;
            text-align: center;
            margin: 0 5px;
        }
        
        .grid-title {
            font-size: 14px;
            font-weight: bold;
            color: #00ff41;
            margin-bottom: 8px;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
        }
        
        .grid-text {
            font-size: 12px;
            color: #ffffff;
            font-family: 'Rajdhani', monospace;
        }
        
        .code-block {
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a2e;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #00ff41;
            width: 80%;
        }
        
        .code-text {
            font-size: 16px;
            color: #00ff41;
            text-align: center;
            font-family: 'Orbitron', monospace;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="corner-accent"></div>
        <div class="corner-accent-br"></div>
        <div class="data-stream"></div>
        <div class="slide-number">${slide.id}/12</div>
        
        <div class="title">${slide.title}</div>
        ${slide.subtitle ? `<div class="subtitle">${slide.subtitle}</div>` : ''}
        <div class="content">${slide.content.replace(/\n/g, '<br>')}</div>
        <div class="special">${slide.special}</div>
        
        ${slide.id === 4 ? `
        <div class="grid-container">
            <div class="grid-item">
                <div class="grid-title">THOUGHTS</div>
                <div class="grid-text">Captured</div>
            </div>
            <div class="grid-item">
                <div class="grid-title">PREFERENCES</div>
                <div class="grid-text">Analyzed</div>
            </div>
            <div class="grid-item">
                <div class="grid-title">SECRETS</div>
                <div class="grid-text">Exposed</div>
            </div>
        </div>
        ` : ''}
        
        ${(slide.id === 2 || slide.id === 8) ? `
        <div class="code-block">
            <div class="code-text">
                if (humanity.consciousness) {<br>
                &nbsp;&nbsp;return freedom.possible;<br>
                }
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>`;
      
      // Set the HTML content
      await page.setContent(html);
      
      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      await page.screenshot({
        path: join(__dirname, 'carousel', `cyberpunk-slide-${slide.id.toString().padStart(2, '0')}.png`),
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 1200,
          height: 1500
        }
      });
      
      console.log(`✅ Slide ${slide.id} exported`);
    }
    
    console.log('✅ All slides exported successfully!');
    console.log('📁 Location: carousel/');
    console.log('📐 Dimensions: 1200x1500px each');
    console.log('🎨 Style: Cyberpunk theme');
    
  } catch (error) {
    console.error('❌ Error exporting slides:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the export
exportIndividualSlides();




