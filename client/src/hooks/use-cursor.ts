import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface CursorChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseCursorChatOptions {
  systemPrompt?: string;
}

interface CursorChatRequest {
  message: string;
  systemPrompt?: string;
}

interface CursorCompletionRequest {
  messages: CursorChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

async function sendCursorMessage(request: CursorChatRequest): Promise<string> {
  const response = await fetch('/api/cursor/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message to Cursor API');
  }

  const data = await response.json();
  return data.response;
}

async function sendCursorCompletion(request: CursorCompletionRequest): Promise<any> {
  const response = await fetch('/api/cursor/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get completion from Cursor API');
  }

  return response.json();
}

/**
 * Hook for simple chat-style interaction with Cursor API
 */
export function useCursorChat(options: UseCursorChatOptions = {}) {
  const [messages, setMessages] = useState<CursorChatMessage[]>([]);

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await sendCursorMessage({
        message,
        systemPrompt: options.systemPrompt,
      });
      return response;
    },
    onSuccess: (response, message) => {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: response },
      ]);
    },
  });

  const sendMessage = (message: string) => {
    mutation.mutate(message);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Hook for advanced completion requests with Cursor API
 */
export function useCursorCompletion() {
  const mutation = useMutation({
    mutationFn: sendCursorCompletion,
  });

  return {
    sendCompletion: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
