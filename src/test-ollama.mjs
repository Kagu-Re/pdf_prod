// Using built-in fetch (Node.js 18+)

async function testOllamaConnection() {
  console.log('Testing Ollama connection...')
  
  try {
    // Test basic connection
    const response = await fetch('http://localhost:11434/api/tags')
    
    if (!response.ok) {
      console.log('❌ Ollama is not running or not accessible')
      console.log('Please make sure Ollama is running: ollama serve')
      return
    }
    
    const data = await response.json()
    console.log('✅ Ollama is running!')
    console.log('Available models:', data.models?.map(m => m.name) || 'None')
    
    // Test chat endpoint
    const chatResponse = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        messages: [
          { role: 'user', content: 'Hello, can you help me?' }
        ],
        stream: false
      })
    })
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json()
      console.log('✅ Chat endpoint working!')
      console.log('Test response:', chatData.message?.content?.substring(0, 100) + '...')
    } else {
      console.log('❌ Chat endpoint not working')
      console.log('Status:', chatResponse.status)
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message)
    console.log('Make sure Ollama is installed and running:')
    console.log('1. Install: curl -fsSL https://ollama.ai/install.sh | sh')
    console.log('2. Start: ollama serve')
    console.log('3. Pull model: ollama pull llama3.1:8b')
  }
}

testOllamaConnection()
