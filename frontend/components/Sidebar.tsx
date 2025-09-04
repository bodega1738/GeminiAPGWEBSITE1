import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart3,
  Calendar,
  Settings,
  Anchor,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, current: true },
  { name: 'Leads', icon: Users, current: false },
  { name: 'Communications', icon: MessageCircle, current: false },
  { name: 'Analytics', icon: BarChart3, current: false },
  { name: 'Calendar', icon: Calendar, current: false },
  { name: 'Settings', icon: Settings, current: false },
];

export default function Sidebar() {
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900/80 backdrop-blur-sm text-blue-100 hover:bg-blue-800/80 transition-colors"
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
        <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border-r border-blue-500/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div ref={logoRef} className="relative">
                <Anchor className="w-8 h-8 text-blue-400" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg scale-150" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-light text-blue-100 tracking-wide">AquaCRM</h1>
                  <p className="text-xs text-blue-300/60">Maritime Tourism</p>
                </div>
              )}
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-md text-blue-300 hover:text-blue-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Collapse button for desktop */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-1 rounded-md text-blue-300 hover:text-blue-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-6 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg
                    transition-all duration-200 hover-glow
                    ${item.current 
                      ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' 
                      : 'text-blue-300/70 hover:text-blue-100 hover:bg-blue-500/10'
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
                  {item.current && (
                    <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-300 rounded-r-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-slate-900">CA</span>
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-blue-100">Captain Admin</p>
                  <p className="text-xs text-blue-300/60">Maritime Manager</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
