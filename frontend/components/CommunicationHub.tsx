import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Phone,
  Mail,
  Bot,
  User,
  Clock,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import backend from '~backend/client';

export default function CommunicationHub() {
  const hubRef = useRef<HTMLDivElement>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  
  const { data: leadsData } = useQuery({
    queryKey: ['leads'],
    queryFn: () => backend.crm.getLeads(),
    refetchInterval: 10000,
  });

  const leads = leadsData?.leads || [];

  // Dummy conversation data with Taglish
  const dummyConversations = [
    {
      id: 1,
      lead: { name: 'Maria Santos', source: 'facebook' },
      lastMessage: 'Hello po, interested ako sa yacht rental for anniversary namin',
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
      unread: true,
      priority: 'high',
      messages: [
        { sender: 'lead', content: 'Hello po, interested ako sa yacht rental for anniversary namin', time: '2:30 PM' },
        { sender: 'agent', content: 'Hi Ms. Santos! Congratulations sa anniversary niyo! Kailan po ang preferred date?', time: '2:35 PM' },
        { sender: 'lead', content: 'Thank you! Next month po, around March 15. Mga 20 pax po kami', time: '2:40 PM' }
      ]
    },
    {
      id: 2,
      lead: { name: 'John Reyes', source: 'whatsapp' },
      lastMessage: 'Kuya available ba yung catamaran sa weekend?',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      unread: false,
      priority: 'medium',
      messages: [
        { sender: 'lead', content: 'Kuya available ba yung catamaran sa weekend?', time: '1:15 PM' },
        { sender: 'agent', content: 'Yes sir available pa! Saturday or Sunday po?', time: '1:20 PM' },
        { sender: 'lead', content: 'Saturday nalang. Magkano rate for 6 hours?', time: '1:25 PM' },
        { sender: 'agent', content: 'For catamaran 6 hours is ₱45,000. Kasama na crew and basic refreshments', time: '1:30 PM' }
      ]
    },
    {
      id: 3,
      lead: { name: 'Sarah Chen', source: 'instagram' },
      lastMessage: 'Hi! Saw your post. May available ba kayo for team building?',
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      unread: true,
      priority: 'urgent',
      messages: [
        { sender: 'lead', content: 'Hi! Saw your post. May available ba kayo for team building?', time: '12:45 PM' },
        { sender: 'ai', content: 'Hello Sarah! Yes we have availability. How many participants po and preferred date?', time: '12:50 PM' }
      ]
    },
    {
      id: 4,
      lead: { name: 'Mike Torres', source: 'website' },
      lastMessage: 'Good evening! For birthday celebration, anong recommended niyo?',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      unread: false,
      priority: 'medium',
      messages: [
        { sender: 'lead', content: 'Good evening! For birthday celebration, anong recommended niyo?', time: '12:15 PM' },
        { sender: 'agent', content: 'Good evening sir! Depends sa size ng group. Ilang pax po kayo?', time: '12:20 PM' },
        { sender: 'lead', content: 'Around 15 people lang. Adults lahat', time: '12:25 PM' },
        { sender: 'agent', content: 'Perfect for our speedboat sir! Very nice for sunset cruise', time: '12:30 PM' }
      ]
    }
  ];

  const channels = [
    { id: 'all', label: 'All Channels', icon: MessageCircle, color: 'emerald', count: dummyConversations.length },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'blue', count: dummyConversations.filter(c => c.lead.source === 'facebook').length },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'pink', count: dummyConversations.filter(c => c.lead.source === 'instagram').length },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, color: 'green', count: dummyConversations.filter(c => c.lead.source === 'whatsapp').length },
    { id: 'website', label: 'Website', icon: Mail, color: 'gray', count: dummyConversations.filter(c => c.lead.source === 'website').length },
  ];

  useEffect(() => {
    // Hub entrance animation
    gsap.fromTo('.communication-item',
      { x: 30, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out" 
      }
    );

    // Floating message bubbles
    gsap.to('.message-bubble', {
      y: -3,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });
  }, []);

  const getChannelIcon = (source: string) => {
    switch (source) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'whatsapp': return Phone;
      case 'website': return Mail;
      default: return MessageCircle;
    }
  };

  const getChannelColor = (source: string) => {
    const colors = {
      facebook: 'text-blue-400 border-blue-400/30',
      instagram: 'text-pink-400 border-pink-400/30',
      whatsapp: 'text-green-400 border-green-400/30',
      website: 'text-gray-400 border-gray-400/30',
      referral: 'text-purple-400 border-purple-400/30',
    };
    return colors[source as keyof typeof colors] || 'text-emerald-400 border-emerald-400/30';
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const filteredConversations = selectedChannel === 'all' 
    ? dummyConversations 
    : dummyConversations.filter(c => c.lead.source === selectedChannel);

  return (
    <div ref={hubRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-light text-emerald-100 tracking-wide">
          Communication Hub
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-300">Live • {dummyConversations.filter(c => c.unread).length} unread</span>
        </div>
      </div>

      {/* Channel filters */}
      <div className="flex flex-wrap gap-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg border backdrop-blur-xl
                transition-all duration-200 hover:scale-105
                ${selectedChannel === channel.id 
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100' 
                  : 'bg-slate-800/50 border-emerald-500/20 text-emerald-300/70 hover:text-emerald-100'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{channel.label}</span>
              <span className="px-2 py-1 bg-emerald-500/20 rounded-full text-xs">
                {channel.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live conversations */}
      <div className="bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-light text-emerald-100">Active Conversations</h4>
          <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {filteredConversations.map((conversation) => {
            const ChannelIcon = getChannelIcon(conversation.lead.source);
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            
            return (
              <div
                key={conversation.id}
                className="communication-item group flex items-center space-x-4 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-900">
                      {conversation.lead.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Channel indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center ${getChannelColor(conversation.lead.source)}`}>
                    <ChannelIcon className="w-3 h-3" />
                  </div>

                  {/* Unread indicator */}
                  {conversation.unread && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </div>

                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-emerald-100 truncate">
                      {conversation.lead.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-emerald-300/60" />
                      <span className="text-xs text-emerald-300/60">
                        {getTimeAgo(conversation.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    {lastMessage.sender === 'ai' && <Bot className="w-3 h-3 text-blue-400" />}
                    {lastMessage.sender === 'agent' && <User className="w-3 h-3 text-emerald-400" />}
                    <p className="text-sm text-emerald-300/70 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Priority and status */}
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      conversation.priority === 'urgent' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
                      conversation.priority === 'high' ? 'bg-orange-500/20 border-orange-400/30 text-orange-300' :
                      'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                    }`}>
                      {conversation.priority}
                    </span>
                    
                    {conversation.unread ? (
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:text-emerald-100 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick response templates in Taglish */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20">
          <h5 className="text-sm font-medium text-emerald-100 mb-3">Quick Responses</h5>
          <div className="flex flex-wrap gap-2">
            {[
              "Salamat sa inquiry! 🚤",
              "Available po kami on that date",
              "Magse-send ako ng quotation",
              "Kailan po preferred sailing time?",
              "Included na po ang crew and safety gear"
            ].map((template, index) => (
              <button
                key={index}
                className="message-bubble px-3 py-2 text-xs bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/30 transition-all"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
