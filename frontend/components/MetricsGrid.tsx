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
  ArrowDown,
  Waves
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
      value: metrics?.total_leads || 47,
      change: '+18%',
      changeType: 'positive',
      icon: Users,
      color: 'amber',
      description: 'This month'
    },
    {
      title: 'Active Bookings',
      value: metrics?.new_leads || 12,
      change: '+23%',
      changeType: 'positive',
      icon: Target,
      color: 'yellow',
      description: 'Today'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics?.conversion_rate || 34.2}%`,
      change: '+5.7%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'orange',
      description: 'This month'
    },
    {
      title: 'Response Time',
      value: `${Math.round((metrics?.avg_response_time || 450) / 60)}m`,
      change: '-22%',
      changeType: 'positive',
      icon: Clock,
      color: 'amber',
      description: 'Average'
    },
    {
      title: 'Revenue',
      value: `₱${((metrics?.total_revenue || 2850000) / 1000).toFixed(0)}K`,
      change: '+35%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'yellow',
      description: 'This month'
    },
    {
      title: 'Pending Quotes',
      value: metrics?.pending_proposals || 8,
      change: '+5',
      changeType: 'neutral',
      icon: FileText,
      color: 'orange',
      description: 'Awaiting response'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      amber: 'from-amber-500/20 to-amber-600/20 border-amber-400/30 text-amber-300',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 text-yellow-300',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-300',
    };
    return colors[color as keyof typeof colors] || colors.amber;
  };

  return (
    <div ref={gridRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Waves className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-light text-amber-100 tracking-wide">
            Operations Dashboard
          </h2>
        </div>
        <div className="text-sm text-amber-300/60">
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
                hover:shadow-2xl hover:shadow-amber-500/10
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
                      'text-amber-300'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-amber-300/70 tracking-wide uppercase">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-light text-amber-100 tracking-tight">
                    {metric.value}
                  </p>
                  <p className="text-xs text-amber-300/50">
                    {metric.description}
                  </p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/0 to-yellow-400/0 group-hover:from-amber-400/10 group-hover:to-yellow-400/10 transition-all duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
