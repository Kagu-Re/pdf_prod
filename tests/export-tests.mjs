#!/usr/bin/env node
import fs from 'node:fs'
import { spawn } from 'node:child_process'

console.log('🧪 Export System Tests')
console.log('=====================')
console.log('')

// Component-preset compatibility mapping
const compatibilityMap = {
  'AssetMetricSnapshot': ['awareness/metric-1', 'awareness/cinematic-1'],
  'AssetEMDExplainer': ['awareness/emd-1', 'awareness/cinematic-emd'],
  'AssetMarketingSimple': ['marketing/performance-1']
}

const components = Object.keys(compatibilityMap)

console.log(`📋 Found ${components.length} components:`, components)
console.log('📋 Compatible combinations:')
for (const [component, presets] of Object.entries(compatibilityMap)) {
    console.log(`   ${component}: ${presets.join(', ')}`)
}
console.log('')

// Export formats to test
const formats = [
    { name: 'PNG', command: 'export', args: [] },
    { name: 'JPG', command: 'export', args: ['jpg'] },
    { name: 'PDF', command: 'export', args: ['pdf'] },
    { name: 'WebM', command: 'webm', args: [] },
    { name: 'GIF-Ready', command: 'gif', args: [] }
]

let totalTests = 0
let passedTests = 0
let failedTests = []

// Test function
async function runTest(component, preset, format) {
    totalTests++
    const testName = `${component} + ${preset} → ${format.name}`
    
    try {
        console.log(`🧪 Testing: ${testName}`)
        
        await new Promise((resolve, reject) => {
            const args = ['run', format.command, component, preset, ...format.args]
            const child = spawn('npm', args, {
                cwd: process.cwd(),
                stdio: ['ignore', 'pipe', 'pipe'],
                shell: true
            })
            
            let stdout = ''
            let stderr = ''
            
            child.stdout.on('data', (data) => {
                stdout += data.toString()
            })
            
            child.stderr.on('data', (data) => {
                stderr += data.toString()
            })
            
            child.on('close', (code) => {
                if (code === 0) {
                    console.log(`✅ PASS: ${testName}`)
                    passedTests++
                    resolve()
                } else {
                    console.log(`❌ FAIL: ${testName}`)
                    console.log(`   Error: ${stderr.split('\n')[0]}`)
                    failedTests.push({ test: testName, error: stderr, code })
                    reject(new Error(`Exit code ${code}`))
                }
            })
            
            // Timeout after 2 minutes
            setTimeout(() => {
                child.kill()
                reject(new Error('Timeout'))
            }, 120000)
        })
        
    } catch (error) {
        // Already logged above
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting export tests...')
    console.log('💡 Make sure dev server is running with: npm run dev')
    console.log('')
    
    // Test each compatible combination
    for (const component of components) {
        const compatiblePresets = compatibilityMap[component] || []
        
        for (const preset of compatiblePresets) {
            // Check if preset files exist
            const brandPath = `src/brand/presets/${preset}.json`
            const copyPath = `src/data/copy/${preset}.json`
            
            if (fs.existsSync(brandPath) && fs.existsSync(copyPath)) {
                console.log(`📂 Testing ${component} with ${preset}`)
                
                for (const format of formats) {
                    await runTest(component, preset, format)
                }
                console.log('')
            } else {
                console.log(`⚠️  Skipping ${component} + ${preset} - preset files missing`)
                console.log(`     Brand: ${fs.existsSync(brandPath) ? '✅' : '❌'} ${brandPath}`)
                console.log(`     Copy:  ${fs.existsSync(copyPath) ? '✅' : '❌'} ${copyPath}`)
                console.log('')
            }
        }
    }
    
    // Generate results
    console.log('')
    console.log('📊 Test Results')
    console.log('===============')
    console.log(`Total tests: ${totalTests}`)
    console.log(`Passed: ${passedTests}`)
    console.log(`Failed: ${failedTests.length}`)
    console.log('')
    
    if (failedTests.length > 0) {
        console.log('❌ Failed Tests:')
        for (const failure of failedTests) {
            console.log(`   • ${failure.test}`)
            if (failure.error) {
                console.log(`     ${failure.error.split('\n')[0]}`)
            }
            console.log('')
        }
    }
    
    // Save detailed report
    const report = {
        timestamp: new Date().toISOString(),
        total: totalTests,
        passed: passedTests,
        failed: failedTests.length,
        failures: failedTests
    }
    
    fs.mkdirSync('out', { recursive: true })
    fs.writeFileSync('out/test-report.json', JSON.stringify(report, null, 2))
    console.log('📄 Test report saved: out/test-report.json')
    
    if (failedTests.length > 0) {
        console.log(`⚠️  ${failedTests.length} tests failed. Check the issues above.`)
        process.exit(1)
    } else {
        console.log('🎉 All tests passed!')
    }
}

runAllTests().catch(console.error)
