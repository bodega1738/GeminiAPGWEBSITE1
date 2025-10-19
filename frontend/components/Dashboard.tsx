import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Sidebar from './Sidebar';
import Header from './Header';
import MetricsGrid from './MetricsGrid';
import PipelineVisualization from './PipelineVisualization';
import CommunicationHub from './CommunicationHub';
import QuickActions from './QuickActions';
import AIAssistant from './AIAssistant';
import AIAssistantWidget from './AIAssistantWidget';
import LeadsView from './LeadsView';
import CalendarView from './CalendarView';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';
import QuotesView from './QuotesView';
import ConversationsView from './ConversationsView';
import BookingsView from './BookingsView';
import FleetView from './FleetView';
import SettingsAdminView from './SettingsAdminView';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState('dashboard');

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

  const renderMainContent = () => {
    switch (activeView) {
      case 'conversations':
        return (
          <div className="dashboard-section">
            <ConversationsView />
          </div>
        );
      case 'quotes':
        return (
          <div className="dashboard-section">
            <QuotesView />
          </div>
        );
      case 'bookings':
        return (
          <div className="dashboard-section">
            <BookingsView />
          </div>
        );
      case 'fleet':
        return (
          <div className="dashboard-section">
            <FleetView />
          </div>
        );
      case 'leads':
        return (
          <div className="dashboard-section">
            <LeadsView />
          </div>
        );
      case 'communications':
        return (
          <div className="dashboard-section">
            <CommunicationHub />
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard-section">
            <AnalyticsView />
          </div>
        );
      case 'calendar':
        return (
          <div className="dashboard-section">
            <CalendarView />
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-section">
            <SettingsAdminView />
          </div>
        );
      default:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <div ref={dashboardRef} className="flex h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {renderMainContent()}
        </main>
      </div>

      {/* Floating AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
}
