import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  DollarSign,
  Star,
  Clock,
  MessageCircle
} from 'lucide-react';
import backend from '~backend/client';

export default function LeadsView() {
  const viewRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddLead, setShowAddLead] = useState(false);

  // Dummy leads data with Filipino names and Taglish context
  const dummyLeads = [
    {
      id: 1,
      name: 'Maria Elena Santos',
      email: 'maria.santos@gmail.com',
      phone: '+63 917 123 4567',
      source: 'facebook',
      status: 'new',
      priority: 'high',
      vessel_type: 'Luxury Yacht',
      booking_date: '2024-03-15',
      party_size: 20,
      budget: 85000,
      notes: 'Anniversary celebration, want sunset cruise with catering',
      created_at: new Date(Date.now() - 1800000),
      last_contact: 'Never contacted',
      location: 'Makati City'
    },
    {
      id: 2,
      name: 'John Miguel Reyes',
      email: 'jmreyes@yahoo.com',
      phone: '+63 918 987 6543',
      source: 'whatsapp',
      status: 'contacted',
      priority: 'medium',
      vessel_type: 'Catamaran',
      booking_date: '2024-03-08',
      party_size: 15,
      budget: 45000,
      notes: 'Team building event, flexible on dates',
      created_at: new Date(Date.now() - 3600000),
      last_contact: '2 hours ago',
      location: 'BGC, Taguig'
    },
    {
      id: 3,
      name: 'Sarah Chen-Rodriguez',
      email: 'sarah.chen.r@outlook.com',
      phone: '+63 919 555 7890',
      source: 'instagram',
      status: 'qualified',
      priority: 'urgent',
      vessel_type: 'Speedboat',
      booking_date: '2024-02-28',
      party_size: 8,
      budget: 25000,
      notes: 'Birthday surprise, wants jet ski package included',
      created_at: new Date(Date.now() - 5400000),
      last_contact: '30 minutes ago',
      location: 'Quezon City'
    },
    {
      id: 4,
      name: 'Miguel Torres',
      email: 'mtorres.business@gmail.com',
      phone: '+63 920 111 2233',
      source: 'website',
      status: 'proposal',
      priority: 'high',
      vessel_type: 'Private Yacht',
      booking_date: '2024-03-22',
      party_size: 50,
      budget: 150000,
      notes: 'Corporate event, needs AV equipment and formal dining',
      created_at: new Date(Date.now() - 7200000),
      last_contact: '1 day ago',
      location: 'Ortigas, Pasig'
    },
    {
      id: 5,
      name: 'Anna Beatriz Lim',
      email: 'anna.lim@company.ph',
      phone: '+63 921 444 5566',
      source: 'referral',
      status: 'booked',
      priority: 'medium',
      vessel_type: 'Catamaran',
      booking_date: '2024-03-05',
      party_size: 25,
      budget: 65000,
      notes: 'Wedding pre-event, confirmed booking with full payment',
      created_at: new Date(Date.now() - 10800000),
      last_contact: 'Booked',
      location: 'Alabang, Muntinlupa'
    },
    {
      id: 6,
      name: 'Robert Kim',
      email: 'robertkim.ph@gmail.com',
      phone: '+63 922 777 8899',
      source: 'facebook',
      status: 'lost',
      priority: 'low',
      vessel_type: 'Speedboat',
      booking_date: '2024-02-20',
      party_size: 6,
      budget: 18000,
      notes: 'Went with competitor, budget too low',
      created_at: new Date(Date.now() - 14400000),
      last_contact: '3 days ago',
      location: 'Mandaluyong'
    }
  ];

  useEffect(() => {
    gsap.fromTo(viewRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo('.lead-card',
      { x: 30, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-500/20 border-blue-400/30 text-blue-300',
      contacted: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300',
      qualified: 'bg-amber-500/20 border-amber-400/30 text-amber-300',
      proposal: 'bg-purple-500/20 border-purple-400/30 text-purple-300',
      booked: 'bg-green-500/20 border-green-400/30 text-green-300',
      lost: 'bg-red-500/20 border-red-400/30 text-red-300'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500/20 border-red-400/30 text-red-300',
      high: 'bg-orange-500/20 border-orange-400/30 text-orange-300',
      medium: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300',
      low: 'bg-gray-500/20 border-gray-400/30 text-gray-300'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'facebook': return '📘';
      case 'instagram': return '📷';
      case 'whatsapp': return '💬';
      case 'website': return '🌐';
      case 'referral': return '👥';
      default: return '📧';
    }
  };

  const filteredLeads = dummyLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.vessel_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div ref={viewRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-light text-amber-100 tracking-wide">
            Leads Management
          </h2>
        </div>
        <button 
          onClick={() => setShowAddLead(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-300 hover:text-amber-100 hover:bg-amber-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/60" />
          <input
            type="text"
            placeholder="Search leads by name, email, or vessel type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-400/50"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-amber-300/60" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="booked">Booked</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="lead-card bg-slate-900/30 backdrop-blur-xl border border-amber-500/20 rounded-xl p-6 hover:bg-slate-900/50 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-black">
                    {lead.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-amber-100">{lead.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-amber-300/60">
                    <span>{getSourceIcon(lead.source)}</span>
                    <span>{lead.source}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-amber-300/70">
                <Mail className="w-4 h-4" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-amber-300/70">
                <Phone className="w-4 h-4" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-amber-300/70">
                <MapPin className="w-4 h-4" />
                <span>{lead.location}</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-black/30 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-amber-300/60">Vessel:</span>
                  <p className="text-amber-100">{lead.vessel_type}</p>
                </div>
                <div>
                  <span className="text-amber-300/60">Guests:</span>
                  <p className="text-amber-100">{lead.party_size} pax</p>
                </div>
                <div>
                  <span className="text-amber-300/60">Date:</span>
                  <p className="text-amber-100">{new Date(lead.booking_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-amber-300/60">Budget:</span>
                  <p className="text-amber-100">₱{lead.budget.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <span className="text-xs text-amber-300/60">Notes:</span>
              <p className="text-sm text-amber-300/80 mt-1">{lead.notes}</p>
            </div>

            {/* Last Contact */}
            <div className="flex items-center justify-between text-xs text-amber-300/60 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Last contact: {lead.last_contact}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-300 hover:text-amber-100 hover:bg-amber-500/30 transition-all">
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:text-blue-100 hover:bg-blue-500/30 transition-all">
                <DollarSign className="w-4 h-4" />
                <span>Quote</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
