import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Bell, Search, Sun, Moon, Globe } from 'lucide-react';

export default function Header() {
  const [notifications] = useState(3);
  const headerRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header entrance animation
    gsap.fromTo(headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );

    // Pulsing animation for urgent alerts
    if (notifications > 0) {
      gsap.to(alertRef.current, {
        scale: 1.1,
        duration: 1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, [notifications]);

  return (
    <header 
      ref={headerRef}
      className="bg-slate-900/80 backdrop-blur-xl border-b border-blue-500/20 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left: Search and alerts */}
        <div className="flex items-center space-x-6">
          {/* Priority alert bar */}
          {notifications > 0 && (
            <div 
              ref={alertRef}
              className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-sm text-orange-200 font-medium">
                  {notifications} urgent leads require immediate attention
                </span>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300/60 group-focus-within:text-blue-300" />
            <input
              type="text"
              placeholder="Search leads, communications..."
              className="
                w-80 pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-500/20 rounded-lg
                text-blue-100 placeholder-blue-300/50 
                focus:outline-none focus:border-blue-400/50 focus:bg-slate-800/70
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Right: Status and controls */}
        <div className="flex items-center space-x-4">
          {/* Live status indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-300">All Systems Online</span>
          </div>

          {/* Time zone */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-blue-500/20">
            <Globe className="w-4 h-4 text-blue-300/60" />
            <span className="text-sm text-blue-200">UTC-5</span>
          </div>

          {/* Theme toggle */}
          <button className="p-2 rounded-lg bg-slate-800/50 border border-blue-500/20 text-blue-300 hover:text-blue-100 hover:bg-slate-800/70 transition-all">
            <Sun className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-slate-800/50 border border-blue-500/20 text-blue-300 hover:text-blue-100 hover:bg-slate-800/70 transition-all">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{notifications}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
