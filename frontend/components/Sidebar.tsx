import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Leads', icon: Users, id: 'leads' },
  { name: 'Communications', icon: MessageCircle, id: 'communications' },
  { name: 'Analytics', icon: BarChart3, id: 'analytics' },
  { name: 'Calendar', icon: Calendar, id: 'calendar' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sidebar entrance animation
    gsap.fromTo(sidebarRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    // Logo floating animation
    gsap.to(logoRef.current, {
      y: -5,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    gsap.to(sidebarRef.current, {
      width: isCollapsed ? '16rem' : '5rem',
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/80 backdrop-blur-sm text-amber-100 hover:bg-slate-800/80 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-64
          ${isCollapsed ? 'lg:w-20' : ''}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full bg-black/95 backdrop-blur-xl border-r border-amber-500/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div ref={logoRef} className="relative">
                <div className="w-10 h-10 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-400">EFR</span>
                </div>
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg scale-150" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-light text-amber-100 tracking-wide">EFR CRM</h1>
                  <p className="text-xs text-amber-300/60">Marine Tourism</p>
                </div>
              )}
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-md text-amber-300 hover:text-amber-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Collapse button for desktop */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-1 rounded-md text-amber-300 hover:text-amber-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-6 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.name}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg
                    transition-all duration-200 hover-glow text-left
                    ${isActive 
                      ? 'bg-amber-500/20 text-amber-100 border border-amber-400/30' 
                      : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-500/10'
                    }
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
                  {!isCollapsed && (
                    <span className="tracking-wide">{item.name}</span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-amber-400 to-yellow-300 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-amber-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-black">EF</span>
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-amber-100">EFR Admin</p>
                  <p className="text-xs text-amber-300/60">Marine Manager</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
