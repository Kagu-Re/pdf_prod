import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const baseUrl = 'http://localhost:5173'
const component = 'ConversationApp'

async function exportConversation() {
  console.log('Starting conversation interface export...')
  
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  
  try {
    // Set viewport for conversation interface
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Navigate to the conversation interface
    const url = `${baseUrl}/?component=${component}`
    console.log(`Navigating to: ${url}`)
    
    await page.goto(url, { waitUntil: 'networkidle' })
    
    // Wait for the interface to load
    await page.waitForSelector('[data-testid="conversation-interface"]', { timeout: 10000 })
      .catch(() => {
        console.log('Conversation interface loaded (no specific selector found)')
      })
    
    // Wait a bit more for any animations to complete
    await page.waitForTimeout(2000)
    
    // Take screenshot
    const screenshotPath = join(__dirname, '../../out/conversation-interface.png')
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    })
    
    console.log(`Conversation interface exported to: ${screenshotPath}`)
    
  } catch (error) {
    console.error('Error exporting conversation interface:', error)
  } finally {
    await browser.close()
  }
}

exportConversation().catch(console.error)




