# Cursor API Integration

This project integrates with the Cursor.com API to provide AI-powered chat functionality.

## Features

- ✅ Full Cursor API integration
- ✅ Chat interface with message history
- ✅ React hooks for easy integration
- ✅ TypeScript support
- ✅ Environment variable configuration
- ✅ Error handling

## Setup

### 1. Environment Configuration

Create a `.env` file in the project root with your Cursor API key:

```bash
CURSOR_API_KEY=your_cursor_api_key_here
```

The API key has already been configured in the `.env` file.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## Usage

### Access the Chat Interface

Navigate to `/cursor` in your browser to access the Cursor AI chat interface:
- Development: `http://localhost:5000/cursor`
- The main game is still available at `/`

### API Endpoints

#### POST /api/cursor/chat
Simple chat endpoint for single messages.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "systemPrompt": "You are a helpful assistant" // optional
}
```

**Response:**
```json
{
  "response": "I'm doing well, thank you for asking!"
}
```

#### POST /api/cursor/completion
Advanced completion endpoint with full control over the conversation.

**Request:**
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant" },
    { "role": "user", "content": "Hello!" }
  ],
  "model": "gpt-4", // optional
  "temperature": 0.7, // optional
  "max_tokens": 1000 // optional
}
```

**Response:**
```json
{
  "id": "completion-id",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?"
      }
    }
  ]
}
```

### React Hooks

#### useCursorChat

Simple hook for chat-style interactions:

```typescript
import { useCursorChat } from '@/hooks/use-cursor';

function MyComponent() {
  const { messages, sendMessage, clearMessages, isLoading, error } = useCursorChat({
    systemPrompt: 'You are a helpful assistant'
  });

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello!')}>Send</button>
    </div>
  );
}
```

#### useCursorCompletion

Advanced hook for full API control:

```typescript
import { useCursorCompletion } from '@/hooks/use-cursor';

function MyComponent() {
  const { sendCompletion, data, isLoading, error } = useCursorCompletion();

  const handleSend = () => {
    sendCompletion({
      messages: [
        { role: 'user', content: 'Hello!' }
      ],
      model: 'gpt-4',
      temperature: 0.7
    });
  };

  return <button onClick={handleSend}>Send</button>;
}
```

## Project Structure

```
├── server/
│   ├── cursor.ts          # Cursor API client
│   ├── routes.ts          # API routes including Cursor endpoints
│   └── index.ts           # Express server setup
├── client/src/
│   ├── hooks/
│   │   └── use-cursor.ts  # React hooks for Cursor API
│   ├── pages/
│   │   ├── cursor-chat.tsx # Chat UI demo
│   │   └── game.tsx       # Main game page
│   └── App.tsx            # App routing
└── .env                   # Environment variables
```

## Security

- The API key is stored in environment variables and never exposed to the client
- All API calls go through the backend server
- The `.env` file is gitignored to prevent accidental commits

## Troubleshooting

### API Key Not Found
Make sure your `.env` file exists and contains:
```
CURSOR_API_KEY=your_api_key_here
```

### API Errors
Check the server console for detailed error messages. Common issues:
- Invalid API key
- Network connectivity
- Rate limiting

## Development

To add Cursor AI functionality to other pages:

1. Import the hook:
```typescript
import { useCursorChat } from '@/hooks/use-cursor';
```

2. Use in your component:
```typescript
const { messages, sendMessage, isLoading } = useCursorChat();
```

3. Build your UI using the provided state and methods

## Links

- [Cursor.com Documentation](https://cursor.com/docs)
- [Cursor API Reference](https://cursor.com/api)
