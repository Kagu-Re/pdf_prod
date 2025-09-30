import React from 'react'
import AssetMetricSnapshot from './components/assets/AssetMetricSnapshot'
import AssetEMDExplainer from './components/assets/AssetEMDExplainer'
import AssetMarketingSimple from './components/assets/AssetMarketingSimple'
import CarouselSlide from './components/assets/CarouselSlide'
import LinkedInCarousel from './components/assets/LinkedInCarousel'
import LinkedInCarouselSimple from './components/assets/LinkedInCarouselSimple'
import ConversationApp from './components/conversation/ConversationApp'
import DynamicConversationApp from './components/conversation/DynamicConversationApp'
import SingleWindowApp from './components/conversation/SingleWindowApp'
import PersonalizedConversationApp from './components/conversation/PersonalizedConversationApp'
import FoodDeliveryApp from './components/food-delivery/FoodDeliveryApp'
import { ToolTester } from './components/food-delivery/ToolTester'
import PDFGenerator from './pages/PDFGenerator'
import UITools from './pages/UITools'
import UIDashboard from './components/UIDashboard'
import Home from './pages/Home'
import SurpriseGenerator from './pages/SurpriseGenerator'
import SimpleSurpriseCarousel from './components/SimpleSurpriseCarousel'
import TestPDF from './components/TestPDF'
import SimplePDFCarousel from './components/SimplePDFCarousel'
import SimplePDFTest from './pages/SimplePDFTest'
import EnhancedPDFCarousel from './components/EnhancedPDFCarousel'
import EnhancedCarousel from './pages/EnhancedCarousel'
import AdvancedCarouselSlide from './components/AdvancedCarouselSlide'
import AdvancedCarousel from './pages/AdvancedCarousel'
import DirectCarouselViewer from './components/DirectCarouselViewer'
import CarouselLanding from './pages/CarouselLanding'
import CryptoAILanding from './pages/CryptoAILanding'
import CryptoAILandingLong from './pages/CryptoAILandingLong'
import FreelanceQuestLanding from './pages/FreelanceQuestLanding'
import WaterRippleCarousel from './pages/WaterRippleCarousel'
import WaterRippleTriptych from './pages/WaterRippleTriptych'
import InfographicTest from './components/infographic/InfographicTest'
import { CopySchema } from './data/CopySchema'
import { MetricPresetSchema, EMDPresetSchema } from './brand/PresetSchema'

type ComponentMap = Record<string, React.ComponentType<any>>

const components: ComponentMap = {
  AssetMetricSnapshot,
  AssetEMDExplainer,
  AssetMarketingSimple,
  CarouselSlide,
  LinkedInCarousel,
  LinkedInCarouselSimple,
  ConversationApp,
  DynamicConversationApp,
  SingleWindowApp,
  PersonalizedConversationApp,
  FoodDeliveryApp,
  ToolTester,
  PDFGenerator,
  UITools,
  UIDashboard,
  Home,
  SurpriseGenerator,
  SimpleSurpriseCarousel,
  TestPDF,
  SimplePDFCarousel,
  SimplePDFTest,
  EnhancedPDFCarousel,
  EnhancedCarousel,
  AdvancedCarouselSlide,
         AdvancedCarousel,
         DirectCarouselViewer,
         CarouselLanding,
         CryptoAILanding,
         CryptoAILandingLong,
         FreelanceQuestLanding,
         WaterRippleCarousel,
         WaterRippleTriptych,
         InfographicTest
}

async function loadJSON(path: string) {
  const mod = await import(/* @vite-ignore */ path)
  return mod.default ?? mod
}

function useQuery() {
  const params = new URLSearchParams(window.location.search)
  return Object.fromEntries(params.entries())
}

export default function Render() {
  const [Comp, setComp] = React.useState<React.ComponentType<any> | null>(null)
  const [props, setProps] = React.useState<any>({})
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const query = useQuery()

  React.useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      
      const compName = query.component || 'Home'
      
      console.log('Loading component:', compName)
      
      const C = components[compName]
      if (!C) {
        setError(`Component "${compName}" not found. Available: ${Object.keys(components).join(', ')}`)
        setLoading(false)
        return
      }
      setComp(() => C)

      // LinkedInCarousel and InfographicTest don't need preset or copy data
      if (compName === 'LinkedInCarousel' || compName === 'InfographicTest') {
        console.log(`${compName} - no preset needed`)
        setProps({})
        setLoading(false)
        return
      }

      // For other components, load preset and copy data
      const preset = query.preset || 'awareness/metric-1'
      const copyPath = `/src/data/copy/${preset}.json`
      const presetPath = `/src/brand/presets/${preset}.json`
      
      console.log('Loading preset:', preset)

      try {
        console.log('Loading copy from:', copyPath)
        const copy = await loadJSON(copyPath)
        CopySchema.parse(copy) // validate
        console.log('Copy validation passed')
      } catch (e) {
        console.error('Copy validation failed', e)
        setError(`Copy validation failed for ${copyPath}: ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
      
      try {
        console.log('Loading preset from:', presetPath)
        const presetData = await loadJSON(presetPath)
        // validate by type
        if (compName === 'AssetMetricSnapshot') {
          MetricPresetSchema.parse(presetData)
          console.log('Metric preset validation passed')
        }
        if (compName === 'AssetEMDExplainer') {
          EMDPresetSchema.parse(presetData)
          console.log('EMD preset validation passed')
        }
        if (compName === 'CarouselSlide') {
          // Carousel slides use a simple schema
          console.log('Carousel preset validation passed')
        }
        setProps(presetData)
      } catch (e) {
        console.error('Preset validation failed', e)
        setError(`Preset validation failed for ${presetPath}: ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
      
      setLoading(false)
    }
    run()
  }, [query.component, query.preset]) // Fixed dependency array

  if (loading) return (
    <div className="w-[1080px] h-[1350px] bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-display text-gray-600 mb-2">Loading...</div>
        <div className="text-sm text-gray-400">Component: {query.component || 'AssetMetricSnapshot'}</div>
        <div className="text-sm text-gray-400">Preset: {query.preset || 'awareness/metric-1'}</div>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="w-[1080px] h-[1350px] bg-red-50 border-4 border-red-200 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="text-3xl font-display text-red-600 mb-4">Error Loading Asset</div>
        <div className="text-red-700 mb-4 font-mono text-sm bg-red-100 p-4 rounded">{error}</div>
        <div className="text-sm text-red-500">
          Check console for more details
        </div>
      </div>
    </div>
  )
  
  if (!Comp) return (
    <div className="w-[1080px] h-[1350px] bg-yellow-50 border-4 border-yellow-200 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-display text-yellow-700">Component Not Found</div>
        <div className="text-yellow-600">Available components: {Object.keys(components).join(', ')}</div>
      </div>
    </div>
  )
  
  return <Comp {...props} />
}
