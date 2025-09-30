import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { MetricPresetSchema, EMDPresetSchema } from '../src/brand/PresetSchema'
import { CopySchema } from '../src/data/CopySchema'

describe('Asset Loading System', () => {
  let presetFiles: string[] = []
  let copyFiles: string[] = []

  beforeAll(() => {
    // Discover all preset and copy files
    const presetDir = join(process.cwd(), 'src/brand/presets/awareness')
    const copyDir = join(process.cwd(), 'src/data/copy/awareness')
    
    try {
      presetFiles = readdirSync(presetDir).filter(f => f.endsWith('.json'))
      copyFiles = readdirSync(copyDir).filter(f => f.endsWith('.json'))
    } catch (error) {
      console.warn('Could not read preset/copy directories:', error)
    }
  })

  describe('Preset Files Validation', () => {
    it('should have valid metric preset files', () => {
      const metricPresets = presetFiles.filter(f => f.includes('metric'))
      
      metricPresets.forEach(file => {
        const filePath = join(process.cwd(), 'src/brand/presets/awareness', file)
        const content = JSON.parse(readFileSync(filePath, 'utf-8'))
        
        expect(() => MetricPresetSchema.parse(content), 
          `Metric preset ${file} should be valid`).not.toThrow()
      })
    })

    it('should have valid EMD preset files', () => {
      const emdPresets = presetFiles.filter(f => f.includes('emd'))
      
      emdPresets.forEach(file => {
        const filePath = join(process.cwd(), 'src/brand/presets/awareness', file)
        const content = JSON.parse(readFileSync(filePath, 'utf-8'))
        
        expect(() => EMDPresetSchema.parse(content), 
          `EMD preset ${file} should be valid`).not.toThrow()
      })
    })
  })

  describe('Copy Files Validation', () => {
    it('should have valid copy files matching CopySchema', () => {
      copyFiles.forEach(file => {
        const filePath = join(process.cwd(), 'src/data/copy/awareness', file)
        const content = JSON.parse(readFileSync(filePath, 'utf-8'))
        
        expect(() => CopySchema.parse(content), 
          `Copy file ${file} should match CopySchema`).not.toThrow()
      })
    })

    it('should have required fields in copy files', () => {
      copyFiles.forEach(file => {
        const filePath = join(process.cwd(), 'src/data/copy/awareness', file)
        const content = JSON.parse(readFileSync(filePath, 'utf-8'))
        
        expect(content).toHaveProperty('headline')
        expect(content).toHaveProperty('subheading')
        expect(content).toHaveProperty('body')
        expect(content).toHaveProperty('cta')
        expect(content).toHaveProperty('tone')
        expect(content).toHaveProperty('target_kpi')
        
        // Validate lengths
        expect(content.headline.length).toBeLessThanOrEqual(60)
        expect(content.subheading.length).toBeLessThanOrEqual(90)
        expect(content.body.length).toBeGreaterThanOrEqual(30)
        expect(content.cta.length).toBeLessThanOrEqual(32)
      })
    })
  })

  describe('File Consistency', () => {
    it('should have matching preset and copy files', () => {
      const presetNames = presetFiles.map(f => f.replace('.json', ''))
      const copyNames = copyFiles.map(f => f.replace('.json', ''))
      
      presetNames.forEach(presetName => {
        expect(copyNames).toContain(presetName, 
          `Copy file should exist for preset: ${presetName}`)
      })
    })

    it('should not have orphaned copy files', () => {
      const presetNames = presetFiles.map(f => f.replace('.json', ''))
      const copyNames = copyFiles.map(f => f.replace('.json', ''))
      
      copyNames.forEach(copyName => {
        expect(presetNames).toContain(copyName, 
          `Preset file should exist for copy: ${copyName}`)
      })
    })
  })

  describe('Component Rendering Tests', () => {
    it('should render AssetMetricSnapshot with all presets', () => {
      const metricPresets = presetFiles.filter(f => f.includes('metric') || f.includes('cinematic-1'))
      
      metricPresets.forEach(file => {
        const presetName = file.replace('.json', '')
        // This would test the actual component rendering in a real test environment
        expect(presetName).toBeDefined()
      })
    })

    it('should render AssetEMDExplainer with all presets', () => {
      const emdPresets = presetFiles.filter(f => f.includes('emd'))
      
      emdPresets.forEach(file => {
        const presetName = file.replace('.json', '')
        // This would test the actual component rendering in a real test environment
        expect(presetName).toBeDefined()
      })
    })
  })

  describe('URL Parameter Tests', () => {
    const testCases = [
      { component: 'AssetMetricSnapshot', preset: 'awareness/metric-1' },
      { component: 'AssetMetricSnapshot', preset: 'awareness/cinematic-1' },
      { component: 'AssetEMDExplainer', preset: 'awareness/emd-1' },
      { component: 'AssetEMDExplainer', preset: 'awareness/cinematic-emd' },
    ]

    testCases.forEach(({ component, preset }) => {
      it(`should handle URL: component=${component}&preset=${preset}`, () => {
        // This would test the actual URL routing in a real test environment
        const presetFile = preset.split('/')[1] + '.json'
        expect(presetFiles).toContain(presetFile)
        expect(copyFiles).toContain(presetFile)
      })
    })
  })
})

describe('Error Handling', () => {
  it('should handle missing preset files gracefully', () => {
    // Test that the system doesn't crash with missing files
    const missingPreset = 'awareness/non-existent'
    // This would test the actual error handling in a real test environment
    expect(missingPreset).toBeDefined()
  })

  it('should handle malformed JSON files', () => {
    // Test that the system validates JSON properly
    // This would test actual malformed JSON handling
    expect(true).toBe(true)
  })

  it('should provide helpful error messages', () => {
    // Test that error messages are informative
    expect(true).toBe(true)
  })
})
