import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Target,
  FileText,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import backend from '~backend/client';

export default function MetricsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => backend.crm.getDashboardMetrics(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    // Stagger animation for metric cards
    gsap.fromTo('.metric-card',
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.3
      }
    );

    // Floating animation for icons
    gsap.to('.metric-icon', {
      y: -5,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
    });
  }, [metrics]);

  const metricCards = [
    {
      title: 'Total Leads',
      value: metrics?.total_leads || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      description: 'This month'
    },
    {
      title: 'New Leads',
      value: metrics?.new_leads || 0,
      change: '+8%',
      changeType: 'positive',
      icon: Target,
      color: 'green',
      description: 'Today'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics?.conversion_rate || 0}%`,
      change: '+2.4%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple',
      description: 'This month'
    },
    {
      title: 'Avg Response Time',
      value: `${Math.round((metrics?.avg_response_time || 0) / 60)}m`,
      change: '-15%',
      changeType: 'positive',
      icon: Clock,
      color: 'orange',
      description: 'This week'
    },
    {
      title: 'Total Revenue',
      value: `$${(metrics?.total_revenue || 0).toLocaleString()}`,
      change: '+24%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'cyan',
      description: 'This month'
    },
    {
      title: 'Pending Proposals',
      value: metrics?.pending_proposals || 0,
      change: '+3',
      changeType: 'neutral',
      icon: FileText,
      color: 'indigo',
      description: 'Awaiting response'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-300',
      green: 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-300',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-300',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-300',
      cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-400/30 text-cyan-300',
      indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-400/30 text-indigo-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div ref={gridRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-blue-100 tracking-wide">
          Navigation Dashboard
        </h2>
        <div className="text-sm text-blue-300/60">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className={`
                metric-card relative group
                bg-gradient-to-br ${getColorClasses(metric.color)}
                backdrop-blur-xl border rounded-xl p-6
                hover:scale-105 transition-all duration-300
                hover:shadow-2xl hover:shadow-blue-500/10
                cursor-pointer overflow-hidden
              `}
            >
              {/* Background wave pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
                    fill="currentColor"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`metric-icon p-2 rounded-lg bg-gradient-to-br ${getColorClasses(metric.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {metric.changeType === 'positive' ? (
                      <ArrowUp className="w-4 h-4 text-green-400" />
                    ) : metric.changeType === 'negative' ? (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    ) : null}
                    <span className={`text-xs font-medium ${
                      metric.changeType === 'positive' ? 'text-green-400' :
                      metric.changeType === 'negative' ? 'text-red-400' :
                      'text-blue-300'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-blue-300/70 tracking-wide uppercase">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-light text-blue-100 tracking-tight">
                    {metric.value}
                  </p>
                  <p className="text-xs text-blue-300/50">
                    {metric.description}
                  </p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/10 group-hover:to-cyan-400/10 transition-all duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
