/**
 * Cursor API client for interacting with cursor.com API
 */

const CURSOR_API_BASE_URL = 'https://api.cursor.com/v1';

interface CursorAPIOptions {
  apiKey: string;
}

interface CursorChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CursorChatRequest {
  model?: string;
  messages: CursorChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface CursorChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: CursorChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class CursorAPI {
  private apiKey: string;

  constructor(options: CursorAPIOptions) {
    this.apiKey = options.apiKey;
  }

  /**
   * Send a chat completion request to Cursor API
   */
  async chatCompletion(request: CursorChatRequest): Promise<CursorChatResponse> {
    const response = await fetch(`${CURSOR_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || 'gpt-4',
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cursor API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Simple helper to send a single message and get a response
   */
  async sendMessage(message: string, systemPrompt?: string): Promise<string> {
    const messages: CursorChatMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: message,
    });

    const response = await this.chatCompletion({ messages });
    return response.choices[0]?.message?.content || '';
  }
}

/**
 * Get a configured Cursor API instance
 */
export function getCursorAPI(): CursorAPI {
  const apiKey = process.env.CURSOR_API_KEY;

  if (!apiKey) {
    throw new Error('CURSOR_API_KEY environment variable is not set');
  }

  return new CursorAPI({ apiKey });
}
