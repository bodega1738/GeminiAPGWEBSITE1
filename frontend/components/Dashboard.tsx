import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Sidebar from './Sidebar';
import Header from './Header';
import MetricsGrid from './MetricsGrid';
import PipelineVisualization from './PipelineVisualization';
import CommunicationHub from './CommunicationHub';
import QuickActions from './QuickActions';
import AIAssistant from './AIAssistant';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dashboard entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(dashboardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Stagger in dashboard sections
    tl.fromTo('.dashboard-section',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out" 
      },
      "-=0.5"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={dashboardRef} className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Metrics Grid */}
          <div className="dashboard-section">
            <MetricsGrid />
          </div>

          {/* Pipeline and Communication */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="dashboard-section">
              <PipelineVisualization />
            </div>
            <div className="dashboard-section">
              <CommunicationHub />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <QuickActions />
          </div>
        </main>
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
}
