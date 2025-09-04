import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Bot, Send, X, Lightbulb, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Welcome aboard, Captain! I\'m your maritime intelligence assistant. How can I help optimize your operations today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const assistantRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const insights = [
    {
      icon: TrendingUp,
      title: 'Conversion Opportunity',
      content: 'You have 3 qualified leads ready for follow-up. Best conversion window is now.',
      action: 'Review Leads'
    },
    {
      icon: Users,
      title: 'Peak Season Alert',
      content: 'Booking volume increased 40% this week. Consider dynamic pricing strategy.',
      action: 'Adjust Pricing'
    },
    {
      icon: DollarSign,
      title: 'Revenue Insight',
      content: 'Yacht bookings generate 3x higher revenue than speedboats this month.',
      action: 'View Analytics'
    }
  ];

  useEffect(() => {
    // Floating animation for assistant bubble
    gsap.to(bubbleRef.current, {
      y: -10,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Gentle glow pulse
    gsap.to('.ai-glow', {
      scale: 1.1,
      opacity: 0.6,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I understand your request. Let me analyze the current data and provide you with actionable insights...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div ref={assistantRef} className="fixed bottom-6 right-6 z-50">
      {/* Chat Interface */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="absolute bottom-20 right-0 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="ai-glow absolute inset-0 bg-blue-400/30 rounded-full blur-lg scale-150" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-100">Maritime AI</h3>
                <p className="text-xs text-blue-300/60">Intelligent Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-blue-300 hover:text-blue-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Insights */}
          <div className="p-4 border-b border-blue-500/20">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-blue-100">Smart Insights</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-blue-500/10">
                    <div className="flex items-start space-x-3">
                      <Icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-blue-100">{insight.title}</p>
                        <p className="text-xs text-blue-300/70 mt-1">{insight.content}</p>
                        <button className="text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors">
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-800/50 border border-blue-500/20 text-blue-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-blue-300/60'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-blue-500/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about leads, analytics, optimization..."
                className="flex-1 p-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-300/50 text-sm focus:outline-none focus:border-blue-400/50"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Assistant Bubble */}
      <button
        ref={bubbleRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-110 flex items-center justify-center group"
      >
        <Bot className="w-8 h-8 text-white" />
        
        {/* Glow effect */}
        <div className="ai-glow absolute inset-0 bg-blue-400/30 rounded-full blur-xl scale-150" />
        
        {/* Notification indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">{insights.length}</span>
        </div>

        {/* Hover tooltip */}
        <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/20 rounded-lg px-3 py-2 whitespace-nowrap">
            <p className="text-sm text-blue-100">Maritime AI Assistant</p>
            <p className="text-xs text-blue-300/60">Click for insights & analytics</p>
          </div>
        </div>
      </button>
    </div>
  );
}
