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
  Send
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

  const channels = [
    { id: 'all', label: 'All Channels', icon: MessageCircle, color: 'blue', count: leads.length },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'blue', count: leads.filter(l => l.source === 'facebook').length },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'pink', count: leads.filter(l => l.source === 'instagram').length },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, color: 'green', count: leads.filter(l => l.source === 'whatsapp').length },
    { id: 'email', label: 'Email', icon: Mail, color: 'gray', count: leads.filter(l => l.source === 'website').length },
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
  }, [leads]);

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
    return colors[source as keyof typeof colors] || 'text-blue-400 border-blue-400/30';
  };

  const recentLeads = leads
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div ref={hubRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-light text-blue-100 tracking-wide">
          Communication Hub
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-300">Live Monitoring</span>
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
                  ? 'bg-blue-500/20 border-blue-400/50 text-blue-100' 
                  : 'bg-slate-800/50 border-blue-500/20 text-blue-300/70 hover:text-blue-100'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{channel.label}</span>
              <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">
                {channel.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live conversations */}
      <div className="bg-slate-800/30 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-light text-blue-100">Recent Conversations</h4>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {recentLeads.map((lead, index) => {
            const ChannelIcon = getChannelIcon(lead.source);
            return (
              <div
                key={lead.id}
                className="communication-item group flex items-center space-x-4 p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-900">
                      {lead.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Channel indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center ${getChannelColor(lead.source)}`}>
                    <ChannelIcon className="w-3 h-3" />
                  </div>
                </div>

                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-100 truncate">
                      {lead.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-blue-300/60" />
                      <span className="text-xs text-blue-300/60">
                        {new Date(lead.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-blue-300/70 truncate">
                      Interested in {lead.vessel_type} for {lead.party_size} guests
                    </p>
                  </div>

                  {/* Status indicators */}
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      lead.status === 'new' ? 'bg-blue-500/20 border-blue-400/30 text-blue-300' :
                      lead.status === 'contacted' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                      lead.status === 'qualified' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                      'bg-gray-500/20 border-gray-400/30 text-gray-300'
                    }`}>
                      {lead.status}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      lead.priority === 'urgent' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
                      lead.priority === 'high' ? 'bg-orange-500/20 border-orange-400/30 text-orange-300' :
                      lead.priority === 'medium' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                      'bg-gray-500/20 border-gray-400/30 text-gray-300'
                    }`}>
                      {lead.priority}
                    </span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:text-blue-100 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick response templates */}
        <div className="mt-6 pt-4 border-t border-blue-500/20">
          <h5 className="text-sm font-medium text-blue-100 mb-3">Quick Responses</h5>
          <div className="flex flex-wrap gap-2">
            {[
              "Thanks for your interest!",
              "Let me check availability",
              "I'll send you a quote",
              "When would you like to book?"
            ].map((template, index) => (
              <button
                key={index}
                className="message-bubble px-3 py-2 text-xs bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:text-blue-100 hover:bg-blue-500/30 transition-all"
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
