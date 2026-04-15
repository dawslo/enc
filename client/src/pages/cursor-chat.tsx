import { useState } from 'react';
import { useCursorChat } from '@/hooks/use-cursor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

export default function CursorChat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, clearMessages, isLoading, error } = useCursorChat({
    systemPrompt: 'You are a helpful AI assistant integrated with Cursor API.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Cursor AI Chat</CardTitle>
            <CardDescription>
              Powered by Cursor API - Ask me anything!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages Area */}
              <ScrollArea className="h-[400px] w-full border rounded-lg p-4 bg-white">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Start a conversation with Cursor AI...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">
                            {msg.role === 'user' ? 'You' : 'Cursor AI'}
                          </p>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">Error: {error.message}</p>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearMessages}
                    disabled={messages.length === 0 || isLoading}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
