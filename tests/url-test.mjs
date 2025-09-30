#!/usr/bin/env node
import http from 'http'

const BASE_URL = 'http://localhost:5174'

const testCases = [
  { component: 'AssetMetricSnapshot', preset: 'awareness/metric-1' },
  { component: 'AssetMetricSnapshot', preset: 'awareness/cinematic-1' },
  { component: 'AssetEMDExplainer', preset: 'awareness/emd-1' },
  { component: 'AssetEMDExplainer', preset: 'awareness/cinematic-emd' },
]

function testUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          success: res.statusCode === 200,
          hasError: data.includes('Error Loading Asset'),
          hasLoading: data.includes('Loading...'),
          contentLength: data.length
        })
      })
    })
    
    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        success: false,
        error: err.message,
        contentLength: 0
      })
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({
        url,
        status: 0,
        success: false,
        error: 'Timeout',
        contentLength: 0
      })
    })
  })
}

console.log('🌐 Testing Asset URLs...\n')

let allPassed = true

for (const testCase of testCases) {
  const url = `${BASE_URL}/render?component=${testCase.component}&preset=${testCase.preset}`
  const result = await testUrl(url)
  
  if (result.success && !result.hasError && result.contentLength > 1000) {
    console.log(`✅ ${testCase.component} with ${testCase.preset}`)
  } else {
    console.log(`❌ ${testCase.component} with ${testCase.preset}`)
    console.log(`   Status: ${result.status}`)
    if (result.error) console.log(`   Error: ${result.error}`)
    if (result.hasError) console.log(`   Page shows error message`)
    if (result.hasLoading) console.log(`   Page shows loading message`)
    console.log(`   Content length: ${result.contentLength} bytes`)
    allPassed = false
  }
}

console.log(`\n📊 URL Test Results: ${allPassed ? 'All passed' : 'Some failed'}`)

if (!allPassed) {
  console.log('\n💡 Troubleshooting:')
  console.log('   1. Make sure dev server is running: npm run dev')
  console.log('   2. Check browser console for JavaScript errors')
  console.log('   3. Verify preset and copy files exist and are valid')
  console.log('   4. Run: npm test')
  process.exit(1)
} else {
  console.log('\n🎉 All URLs are working correctly!')
  process.exit(0)
}
