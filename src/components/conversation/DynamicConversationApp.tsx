import React, { useState, useEffect } from 'react'
import DynamicConversationInterface from './DynamicConversationInterface'
import { sampleCatalog } from '../../data/ProductCatalog'
import { ollamaService } from '../../services/OllamaService'

export default function DynamicConversationApp() {
  const [products] = useState(sampleCatalog.products)
  const [ollamaConnected, setOllamaConnected] = useState<boolean>(false)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('llama3.1:8b')

  useEffect(() => {
    checkOllamaConnection()
  }, [])

  const checkOllamaConnection = async () => {
    const connected = await ollamaService.checkOllamaConnection()
    setOllamaConnected(connected)
    
    if (connected) {
      const models = await ollamaService.getAvailableModels()
      setAvailableModels(models)
    }
  }

  const handleProductSelect = (product: any) => {
    console.log('Product selected:', product)
  }

  const handleConversationUpdate = (messages: any[]) => {
    console.log('Conversation updated:', messages.length, 'messages')
  }

  if (!ollamaConnected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ollama Not Connected</h1>
          <p className="text-gray-600 mb-6">
            Please make sure Ollama is running on your system. The conversation interface requires Ollama to provide intelligent responses.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>1. Install Ollama: <code className="bg-gray-100 px-2 py-1 rounded">curl -fsSL https://ollama.ai/install.sh | sh</code></p>
            <p>2. Start Ollama: <code className="bg-gray-100 px-2 py-1 rounded">ollama serve</code></p>
            <p>3. Pull a model: <code className="bg-gray-100 px-2 py-1 rounded">ollama pull llama3.1:8b</code></p>
          </div>
          <button
            onClick={checkOllamaConnection}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Check Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Shop Assistant</h1>
            <p className="text-gray-600">Dynamic Interface • Powered by Ollama • {selectedModel}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Ollama Connected</span>
            </div>
            {availableModels.length > 0 && (
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1">
        <DynamicConversationInterface
          products={products}
          onProductSelect={handleProductSelect}
          onConversationUpdate={handleConversationUpdate}
        />
      </div>
    </div>
  )
}




