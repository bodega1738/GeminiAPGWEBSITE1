import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  Plus, 
  Calendar, 
  FileText, 
  Settings,
  Anchor,
  Navigation,
  Phone,
  Mail,
  Calculator,
  Users
} from 'lucide-react';

export default function QuickActions() {
  const actionsRef = useRef<HTMLDivElement>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const compassActions = [
    { 
      id: 'new-lead', 
      label: 'New Lead', 
      icon: Plus, 
      color: 'blue',
      position: 'north',
      description: 'Add new prospect'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar, 
      color: 'green',
      position: 'east',
      description: 'Manage bookings'
    },
    { 
      id: 'quote', 
      label: 'Quick Quote', 
      icon: Calculator, 
      color: 'purple',
      position: 'south',
      description: 'Generate pricing'
    },
    { 
      id: 'fleet', 
      label: 'Fleet Status', 
      icon: Anchor, 
      color: 'cyan',
      position: 'west',
      description: 'Vessel availability'
    },
  ];

  const quickTools = [
    { label: 'Email Campaign', icon: Mail, color: 'orange' },
    { label: 'Call Schedule', icon: Phone, color: 'green' },
    { label: 'Team Chat', icon: Users, color: 'purple' },
    { label: 'Reports', icon: FileText, color: 'blue' },
  ];

  useEffect(() => {
    // Compass entrance animation
    gsap.fromTo('.compass-center',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
    );

    // Compass actions animation
    gsap.fromTo('.compass-action',
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "back.out(1.7)",
        delay: 0.3
      }
    );

    // Floating animation for compass
    gsap.to('.compass-center', {
      y: -5,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Rotating ring animation
    gsap.to('.compass-ring', {
      rotation: 360,
      duration: 60,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const handleActionClick = (actionId: string) => {
    if (actionId === 'quote') {
      setShowQuoteForm(true);
    }
    // Add other action handlers here
  };

  const getColorStyles = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-500/20',
        border: 'border-blue-400/30',
        text: 'text-blue-300',
        shadow: 'hover:shadow-blue-500/20'
      },
      green: {
        bg: 'bg-green-500/20',
        border: 'border-green-400/30',
        text: 'text-green-300',
        shadow: 'hover:shadow-green-500/20'
      },
      purple: {
        bg: 'bg-purple-500/20',
        border: 'border-purple-400/30',
        text: 'text-purple-300',
        shadow: 'hover:shadow-purple-500/20'
      },
      cyan: {
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-400/30',
        text: 'text-cyan-300',
        shadow: 'hover:shadow-cyan-500/20'
      },
      orange: {
        bg: 'bg-orange-500/20',
        border: 'border-orange-400/30',
        text: 'text-orange-300',
        shadow: 'hover:shadow-orange-500/20'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div ref={actionsRef} className="space-y-8">
      <h3 className="text-xl font-light text-blue-100 tracking-wide">
        Command Center
      </h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Navigation Compass */}
        <div className="flex justify-center">
          <div className="relative w-80 h-80">
            {/* Compass ring */}
            <div className="compass-ring absolute inset-0 border-2 border-blue-400/30 rounded-full">
              <div className="absolute inset-4 border border-blue-500/20 rounded-full">
                <div className="absolute inset-4 border border-blue-600/10 rounded-full" />
              </div>
            </div>

            {/* Compass center */}
            <div className="compass-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-xl border border-blue-400/50 rounded-full flex items-center justify-center">
              <Navigation className="w-8 h-8 text-blue-300" />
            </div>

            {/* Compass actions */}
            {compassActions.map((action, index) => {
              const Icon = action.icon;
              const angle = (index * 90) - 90; // Start from north (top)
              const radius = 120;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const styles = getColorStyles(action.color);

              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="compass-action absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  <div className={`
                    w-16 h-16 rounded-full border backdrop-blur-xl
                    flex items-center justify-center
                    transition-all duration-300 hover:scale-110
                    ${styles.bg} ${styles.border} ${styles.text}
                    hover:shadow-xl ${styles.shadow}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/20 rounded-lg px-3 py-1 whitespace-nowrap">
                      <p className="text-sm font-medium text-blue-100">{action.label}</p>
                      <p className="text-xs text-blue-300/60">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Compass directions */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-400/60 font-light">N</div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-400/60 font-light">S</div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-400/60 font-light">E</div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-400/60 font-light">W</div>
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div className="space-y-6">
          <h4 className="text-lg font-light text-blue-100">Quick Tools</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon;
              const styles = getColorStyles(tool.color);
              return (
                <button
                  key={tool.label}
                  className={`
                    group p-6 rounded-xl border backdrop-blur-xl
                    ${styles.bg} ${styles.border}
                    hover:border-opacity-60
                    transition-all duration-300 hover:scale-105
                    hover:shadow-xl ${styles.shadow}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`
                      p-3 rounded-lg border
                      ${styles.bg} ${styles.border}
                      group-hover:scale-110 transition-transform
                    `}>
                      <Icon className={`w-6 h-6 ${styles.text}`} />
                    </div>
                    <span className="text-sm font-medium text-blue-100 text-center">
                      {tool.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Fleet availability preview */}
          <div className="bg-slate-800/30 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6">
            <h5 className="text-lg font-light text-blue-100 mb-4">Fleet Status</h5>
            
            <div className="space-y-3">
              {[
                { name: 'Ocean Breeze', type: 'Yacht', status: 'available', bookings: 3 },
                { name: 'Sea Runner', type: 'Catamaran', status: 'booked', bookings: 5 },
                { name: 'Wave Rider', type: 'Speedboat', status: 'maintenance', bookings: 0 },
                { name: 'Blue Pearl', type: 'Sailboat', status: 'available', bookings: 2 },
              ].map((vessel, index) => (
                <div key={vessel.name} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      vessel.status === 'available' ? 'bg-green-400' :
                      vessel.status === 'booked' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-blue-100">{vessel.name}</p>
                      <p className="text-xs text-blue-300/60">{vessel.type}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-blue-300/60">Bookings</p>
                    <p className="text-sm font-medium text-blue-100">{vessel.bookings}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Quote Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/20 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-light text-blue-100 mb-6">Quick Quote Generator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-blue-300/70 mb-2">Vessel Type</label>
                <select className="w-full p-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-blue-100 focus:outline-none focus:border-blue-400/50">
                  <option>Select vessel...</option>
                  <option>Yacht</option>
                  <option>Catamaran</option>
                  <option>Speedboat</option>
                  <option>Sailboat</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-blue-300/70 mb-2">Party Size</label>
                <input 
                  type="number" 
                  placeholder="Number of guests"
                  className="w-full p-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-300/50 focus:outline-none focus:border-blue-400/50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-blue-300/70 mb-2">Duration (hours)</label>
                <input 
                  type="number" 
                  placeholder="Duration"
                  className="w-full p-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-blue-100 placeholder-blue-300/50 focus:outline-none focus:border-blue-400/50"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setShowQuoteForm(false)}
                className="flex-1 py-3 px-4 bg-slate-800/50 border border-blue-500/20 rounded-lg text-blue-300 hover:text-blue-100 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                Generate Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
