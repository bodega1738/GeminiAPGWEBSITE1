import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users,
  Clock,
  Target,
  Calendar,
  Star
} from 'lucide-react';

export default function AnalyticsView() {
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(viewRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo('.analytics-card',
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, []);

  const analyticsData = {
    revenue: {
      current: 2850000,
      previous: 2150000,
      growth: 32.6
    },
    bookings: {
      current: 47,
      previous: 38,
      growth: 23.7
    },
    avgBookingValue: {
      current: 60638,
      previous: 56579,
      growth: 7.2
    },
    conversionRate: {
      current: 34.2,
      previous: 28.5,
      growth: 20.0
    }
  };

  const topVessels = [
    { name: 'Luxury Yacht "Perla"', bookings: 15, revenue: 1125000, rating: 4.9 },
    { name: 'Catamaran "Bandera"', bookings: 12, revenue: 540000, rating: 4.8 },
    { name: 'Private Yacht "Kalayaan"', bookings: 8, revenue: 800000, rating: 4.9 },
    { name: 'Speedboat "Sigaw"', bookings: 10, revenue: 250000, rating: 4.7 },
    { name: 'Catamaran "Pag-ibig"', bookings: 6, revenue: 270000, rating: 4.8 }
  ];

  const leadSources = [
    { name: 'Facebook', leads: 18, percentage: 38.3, color: 'bg-blue-500' },
    { name: 'Instagram', leads: 14, percentage: 29.8, color: 'bg-pink-500' },
    { name: 'WhatsApp', leads: 8, percentage: 17.0, color: 'bg-green-500' },
    { name: 'Website', leads: 5, percentage: 10.6, color: 'bg-emerald-500' },
    { name: 'Referral', leads: 2, percentage: 4.3, color: 'bg-purple-500' }
  ];

  const monthlyData = [
    { month: 'Oct', revenue: 1800000, bookings: 32 },
    { month: 'Nov', revenue: 2150000, bookings: 38 },
    { month: 'Dec', revenue: 2650000, bookings: 45 },
    { month: 'Jan', revenue: 2200000, bookings: 40 },
    { month: 'Feb', revenue: 2850000, bookings: 47 }
  ];

  return (
    <div ref={viewRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-light text-emerald-100 tracking-wide">
            Business Analytics
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 bg-slate-800/50 border border-emerald-500/20 rounded-lg text-emerald-100 focus:outline-none focus:border-emerald-400/50">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              +{analyticsData.revenue.growth}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-light text-emerald-100">
              ₱{(analyticsData.revenue.current / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-emerald-300/60">Total Revenue</p>
            <p className="text-xs text-emerald-300/50 mt-1">
              vs ₱{(analyticsData.revenue.previous / 1000000).toFixed(1)}M last period
            </p>
          </div>
        </div>

        <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              +{analyticsData.bookings.growth}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-light text-emerald-100">
              {analyticsData.bookings.current}
            </p>
            <p className="text-sm text-emerald-300/60">Total Bookings</p>
            <p className="text-xs text-emerald-300/50 mt-1">
              vs {analyticsData.bookings.previous} last period
            </p>
          </div>
        </div>

        <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              +{analyticsData.avgBookingValue.growth}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-light text-emerald-100">
              ₱{(analyticsData.avgBookingValue.current / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-emerald-300/60">Avg Booking Value</p>
            <p className="text-xs text-emerald-300/50 mt-1">
              vs ₱{(analyticsData.avgBookingValue.previous / 1000).toFixed(0)}K last period
            </p>
          </div>
        </div>

        <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              +{analyticsData.conversionRate.growth}%
            </span>
          </div>
          <div>
            <p className="text-2xl font-light text-emerald-100">
              {analyticsData.conversionRate.current}%
            </p>
            <p className="text-sm text-emerald-300/60">Conversion Rate</p>
            <p className="text-xs text-emerald-300/50 mt-1">
              vs {analyticsData.conversionRate.previous}% last period
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          <h3 className="text-lg font-medium text-emerald-100 mb-6">Monthly Performance</h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => {
              const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));
              const widthPercentage = (month.revenue / maxRevenue) * 100;
              
              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-300/70">{month.month}</span>
                    <div className="text-right">
                      <span className="text-emerald-100">₱{(month.revenue / 1000000).toFixed(1)}M</span>
                      <span className="text-emerald-300/60 ml-2">({month.bookings} bookings)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${widthPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          <h3 className="text-lg font-medium text-emerald-100 mb-6">Lead Sources</h3>
          <div className="space-y-4">
            {leadSources.map((source, index) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${source.color}`} />
                  <span className="text-emerald-300/70">{source.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-100">{source.leads} leads</span>
                  <span className="text-emerald-300/60 ml-2">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-emerald-500/20">
            <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
              {leadSources.map((source, index) => (
                <div
                  key={source.name}
                  className={`${source.color} transition-all duration-1000`}
                  style={{ width: `${source.percentage}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Vessels */}
      <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
        <h3 className="text-lg font-medium text-emerald-100 mb-6">Top Performing Vessels</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {topVessels.map((vessel, index) => (
            <div key={vessel.name} className="bg-slate-900/30 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-emerald-100">{vessel.name}</h4>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-emerald-300/70">{vessel.rating}</span>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-300/60">Bookings:</span>
                  <span className="text-emerald-100">{vessel.bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300/60">Revenue:</span>
                  <span className="text-emerald-100">₱{(vessel.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300/60">Avg per booking:</span>
                  <span className="text-emerald-100">₱{(vessel.revenue / vessel.bookings / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="analytics-card bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
        <h3 className="text-lg font-medium text-emerald-100 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h4 className="font-medium text-emerald-100">Response Times</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Average:</span>
                <span className="text-emerald-100">7.5 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Under 5 min:</span>
                <span className="text-green-300">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Over 1 hour:</span>
                <span className="text-orange-300">12%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h4 className="font-medium text-emerald-100">Customer Satisfaction</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Overall Rating:</span>
                <span className="text-emerald-100">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300/60">5-star reviews:</span>
                <span className="text-green-300">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Repeat customers:</span>
                <span className="text-emerald-100">34%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h4 className="font-medium text-emerald-100">Growth Trends</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Monthly growth:</span>
                <span className="text-green-300">+32.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300/60">New customers:</span>
                <span className="text-emerald-100">66%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300/60">Booking frequency:</span>
                <span className="text-emerald-100">1.8x/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
