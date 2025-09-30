# Conversation Interface

A smart shop assistant interface that simulates a conversation between a customer and a shopkeeper, powered by Ollama and MCP servers.

## Features

- **3-Panel Layout**: Product catalog, conversation chat, and product details
- **Ollama Integration**: Uses local Ollama models for intelligent responses
- **Dynamic Content**: Updates based on user interactions and product selections
- **Product Catalog**: MCP server integration for catalog functionality
- **Real-time Chat**: Smooth conversation flow with typing indicators

## Architecture

### Components

- `ConversationApp.tsx` - Main application wrapper with Ollama connection management
- `ConversationInterface.tsx` - Core 3-panel interface component
- `ProductCatalog.ts` - Product data schemas and sample data
- `OllamaService.ts` - Ollama API integration service

### Data Flow

1. User selects a product from the catalog
2. Product details are displayed in the right panel
3. User asks questions in the chat interface
4. Ollama service processes the question with context
5. Shopkeeper response is generated and displayed
6. Conversation history is maintained for context

## Usage

### Prerequisites

1. Install Ollama: `curl -fsSL https://ollama.ai/install.sh | sh`
2. Start Ollama: `ollama serve`
3. Pull a model: `ollama pull llama3.1:8b`

### Running the Interface

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:5173/?component=ConversationApp`
3. The interface will check for Ollama connection and display accordingly

### Export

Export the conversation interface as an image:
```bash
npm run export:conversation
```

## Configuration

### Ollama Service

The `OllamaService` can be configured with:

```typescript
const ollamaService = new OllamaService({
  model: 'llama3.1:8b',
  baseUrl: 'http://localhost:11434',
  temperature: 0.7,
  maxTokens: 1000
})
```

### Product Catalog

Products are defined using the `ProductSchema` with fields:
- `id`, `name`, `description`, `price`, `category`
- `image`, `features`, `specifications`
- `inStock`, `tags`, `relatedProducts`

## Customization

### Adding New Products

1. Add products to `sampleProducts` in `ProductCatalog.ts`
2. Update categories as needed
3. The interface will automatically display new products

### Modifying Shopkeeper Behavior

Edit the system prompt in `OllamaService.ts` to change how the shopkeeper responds:

```typescript
private buildSystemPrompt(context: ShopkeeperContext): string {
  // Customize the shopkeeper's personality and behavior here
}
```

### Styling

The interface uses Tailwind CSS classes. Key areas to customize:
- Product cards: `.product-card` classes
- Chat messages: `.message-*` classes  
- Layout panels: `.panel-*` classes

## Integration with MCP Servers

The interface is designed to work with MCP (Model Context Protocol) servers for:
- Product catalog management
- Inventory tracking
- Order processing
- Customer data management

## Future Enhancements

- Voice input/output
- Product comparison tables
- Shopping cart integration
- Multi-language support
- Advanced analytics and insights
- Integration with external e-commerce APIs




