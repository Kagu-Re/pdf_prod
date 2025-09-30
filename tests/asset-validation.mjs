#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Test counters
let tests = 0
let passed = 0
let failed = 0

function test(name, fn) {
  tests++
  try {
    fn()
    console.log(`✅ ${name}`)
    passed++
  } catch (error) {
    console.log(`❌ ${name}`)
    console.log(`   Error: ${error.message}`)
    failed++
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`)
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected array to contain ${expected}`)
      }
    },
    toHaveProperty: (prop) => {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property ${prop}`)
      }
    },
    toBeLessThanOrEqual: (expected) => {
      if (actual > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`)
      }
    },
    toBeGreaterThanOrEqual: (expected) => {
      if (actual < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`)
      }
    }
  }
}

// Simple schema validation functions
function validateMetricPreset(data) {
  const required = ['metricName', 'value', 'delta', 'timeframe']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`)
    }
    if (typeof data[field] !== 'string') {
      throw new Error(`Field ${field} must be a string`)
    }
  }
  if (data.note && typeof data.note !== 'string') {
    throw new Error('Field note must be a string if provided')
  }
}

function validateEMDPreset(data) {
  const required = ['title', 'subtitle', 'painStats', 'diagram', 'cta']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`)
    }
  }
  
  if (!Array.isArray(data.painStats)) {
    throw new Error('painStats must be an array')
  }
  
  for (const stat of data.painStats) {
    if (!stat.label || !stat.value) {
      throw new Error('Each painStat must have label and value')
    }
  }
  
  if (!data.diagram.nodes || !Array.isArray(data.diagram.nodes)) {
    throw new Error('diagram.nodes must be an array')
  }
  
  for (const node of data.diagram.nodes) {
    if (!node.id || !node.label) {
      throw new Error('Each node must have id and label')
    }
  }
}

function validateCopy(data) {
  const required = ['headline', 'subheading', 'body', 'cta', 'tone', 'target_kpi']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`)
    }
    if (typeof data[field] !== 'string') {
      throw new Error(`Field ${field} must be a string`)
    }
  }
  
  // Length validations
  if (data.headline.length > 60) {
    throw new Error('Headline must be 60 characters or less')
  }
  if (data.subheading.length > 90) {
    throw new Error('Subheading must be 90 characters or less')
  }
  if (data.body.length < 30) {
    throw new Error('Body must be at least 30 characters')
  }
  if (data.cta.length > 32) {
    throw new Error('CTA must be 32 characters or less')
  }
}

console.log('🚀 Running Asset Validation Tests...\n')

// Discover files
const presetDir = join(rootDir, 'src/brand/presets/awareness')
const copyDir = join(rootDir, 'src/data/copy/awareness')

let presetFiles = []
let copyFiles = []

try {
  presetFiles = readdirSync(presetDir).filter(f => f.endsWith('.json'))
  copyFiles = readdirSync(copyDir).filter(f => f.endsWith('.json'))
} catch (error) {
  console.log(`❌ Could not read directories: ${error.message}`)
  process.exit(1)
}

console.log(`Found ${presetFiles.length} preset files and ${copyFiles.length} copy files\n`)

// Test preset file validation
test('All metric preset files should be valid', () => {
  const metricPresets = presetFiles.filter(f => f.includes('metric') || f.includes('cinematic-1'))
  
  for (const file of metricPresets) {
    const filePath = join(presetDir, file)
    const content = JSON.parse(readFileSync(filePath, 'utf-8'))
    try {
      validateMetricPreset(content)
    } catch (error) {
      throw new Error(`${file}: ${error.message}`)
    }
  }
})

test('All EMD preset files should be valid', () => {
  const emdPresets = presetFiles.filter(f => f.includes('emd'))
  
  for (const file of emdPresets) {
    const filePath = join(presetDir, file)
    const content = JSON.parse(readFileSync(filePath, 'utf-8'))
    try {
      validateEMDPreset(content)
    } catch (error) {
      throw new Error(`${file}: ${error.message}`)
    }
  }
})

test('All copy files should be valid', () => {
  for (const file of copyFiles) {
    const filePath = join(copyDir, file)
    const content = JSON.parse(readFileSync(filePath, 'utf-8'))
    try {
      validateCopy(content)
    } catch (error) {
      throw new Error(`${file}: ${error.message}`)
    }
  }
})

test('Each preset should have a corresponding copy file', () => {
  const presetNames = presetFiles.map(f => f.replace('.json', ''))
  const copyNames = copyFiles.map(f => f.replace('.json', ''))
  
  for (const presetName of presetNames) {
    expect(copyNames).toContain(presetName)
  }
})

test('No orphaned copy files should exist', () => {
  const presetNames = presetFiles.map(f => f.replace('.json', ''))
  const copyNames = copyFiles.map(f => f.replace('.json', ''))
  
  for (const copyName of copyNames) {
    expect(presetNames).toContain(copyName)
  }
})

// Test specific scenarios that caused the bug
test('cinematic-1 preset should be valid for AssetMetricSnapshot', () => {
  const filePath = join(presetDir, 'cinematic-1.json')
  expect(existsSync(filePath)).toBe(true)
  
  const content = JSON.parse(readFileSync(filePath, 'utf-8'))
  validateMetricPreset(content)
})

test('cinematic-emd preset should be valid for AssetEMDExplainer', () => {
  const filePath = join(presetDir, 'cinematic-emd.json')
  expect(existsSync(filePath)).toBe(true)
  
  const content = JSON.parse(readFileSync(filePath, 'utf-8'))
  validateEMDPreset(content)
})

test('cinematic copy files should exist and be valid', () => {
  const cinematicCopyFiles = ['cinematic-1.json', 'cinematic-emd.json']
  
  for (const file of cinematicCopyFiles) {
    const filePath = join(copyDir, file)
    expect(existsSync(filePath)).toBe(true)
    
    const content = JSON.parse(readFileSync(filePath, 'utf-8'))
    validateCopy(content)
  }
})

// URL validation tests
test('URL component mapping should work', () => {
  const validComponents = ['AssetMetricSnapshot', 'AssetEMDExplainer']
  const testCases = [
    { component: 'AssetMetricSnapshot', expectedPresets: ['metric-1', 'cinematic-1'] },
    { component: 'AssetEMDExplainer', expectedPresets: ['emd-1', 'cinematic-emd'] }
  ]
  
  for (const testCase of testCases) {
    expect(validComponents).toContain(testCase.component)
    
    for (const preset of testCase.expectedPresets) {
      const presetFile = `${preset}.json`
      expect(presetFiles).toContain(presetFile)
      expect(copyFiles).toContain(presetFile)
    }
  }
})

console.log(`\n📊 Test Results: ${passed}/${tests} passed, ${failed} failed`)

if (failed > 0) {
  console.log('\n💡 To fix issues:')
  console.log('   1. Check that all preset files match their expected schema')
  console.log('   2. Ensure copy files have all required fields with correct lengths')
  console.log('   3. Verify that every preset has a matching copy file')
  console.log('   4. Run `npm run dev` and test URLs manually')
  process.exit(1)
} else {
  console.log('\n🎉 All tests passed! Assets should load correctly.')
  process.exit(0)
}
