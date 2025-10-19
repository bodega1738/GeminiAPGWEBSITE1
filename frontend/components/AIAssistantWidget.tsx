import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, X, Send } from 'lucide-react';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      return await backend.settings.getSettings();
    },
  });

  const { data: usage } = useQuery({
    queryKey: ['ai-usage'],
    queryFn: async () => {
      return await backend.ai.getUsageStats();
    },
    enabled: isOpen,
  });

  const queryMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      return await backend.ai.queryAssistant({
        prompt: userPrompt,
      });
    },
    onSuccess: (data) => {
      setConversation([
        ...conversation,
        { type: 'user', message: prompt },
        {
          type: 'assistant',
          message: data.answer,
          sources: data.sources,
          confidence: data.confidence,
        },
      ]);
      setPrompt('');
    },
  });

  const handleSend = () => {
    if (prompt.trim()) {
      queryMutation.mutate(prompt);
    }
  };

  if (!settings?.toggles?.aiAssistant) {
    return null;
  }

  return (
    <>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border-slate-700 flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">AI Assistant</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 ? (
              <div className="text-center text-slate-400 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Ask me anything about your CRM data</p>
                {usage && (
                  <p className="text-xs mt-2">
                    {usage.queriesRemaining} queries remaining this month
                  </p>
                )}
              </div>
            ) : (
              conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded ${
                      msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                    }`}
                  >
                    <p>{msg.message}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-700">
                        <p className="text-xs opacity-70">Data sources: {msg.sources.join(', ')}</p>
                        <p className="text-xs opacity-70">Confidence: {(msg.confidence * 100).toFixed(0)}%</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
