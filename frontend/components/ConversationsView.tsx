import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';

export default function ConversationsView() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: threads } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const result = await backend.conversations.listThreads();
      return result.threads;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', selectedThread],
    queryFn: async () => {
      if (!selectedThread) return null;
      const result = await backend.conversations.getThreadMessages({ threadId: selectedThread });
      return result.messages;
    },
    enabled: !!selectedThread,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (msg: string) => {
      if (!selectedThread) return;
      return await backend.conversations.sendMessage({
        threadId: selectedThread,
        message: msg,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedThread] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessage('');
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  return (
    <div className="h-full flex gap-4">
      <Card className="w-80 bg-slate-800/50 border-slate-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Conversations</h2>
        <div className="space-y-2">
          {threads?.map((thread: any) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`p-3 rounded cursor-pointer transition ${
                selectedThread === thread.id
                  ? 'bg-blue-600'
                  : 'bg-slate-900 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-white" />
                <div>
                  <p className="text-white font-medium">{thread.sourcePlatform}</p>
                  <p className="text-slate-400 text-xs">{thread.chatId}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex-1 bg-slate-800/50 border-slate-700 p-4 flex flex-col">
        {selectedThread ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded ${
                      msg.senderType === 'agent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a conversation to view messages
          </div>
        )}
      </Card>
    </div>
  );
}
