import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ArrowRight, Users, Eye, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import backend from '~backend/client';

export default function PipelineVisualization() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  
  const { data: leadsData } = useQuery({
    queryKey: ['leads'],
    queryFn: () => backend.crm.getLeads(),
    refetchInterval: 30000,
  });

  const leads = leadsData?.leads || [];

  const pipelineStages = [
    { 
      id: 'new', 
      label: 'New Leads', 
      icon: Users, 
      color: 'blue',
      count: leads.filter(lead => lead.status === 'new').length
    },
    { 
      id: 'contacted', 
      label: 'Contacted', 
      icon: Eye, 
      color: 'yellow',
      count: leads.filter(lead => lead.status === 'contacted').length
    },
    { 
      id: 'qualified', 
      label: 'Qualified', 
      icon: CheckCircle, 
      color: 'green',
      count: leads.filter(lead => lead.status === 'qualified').length
    },
    { 
      id: 'proposal', 
      label: 'Proposal', 
      icon: FileText, 
      color: 'purple',
      count: leads.filter(lead => lead.status === 'proposal').length
    },
    { 
      id: 'booked', 
      label: 'Booked', 
      icon: Calendar, 
      color: 'emerald',
      count: leads.filter(lead => lead.status === 'booked').length
    },
    { 
      id: 'lost', 
      label: 'Lost', 
      icon: XCircle, 
      color: 'red',
      count: leads.filter(lead => lead.status === 'lost').length
    },
  ];

  useEffect(() => {
    // Pipeline entrance animation
    gsap.fromTo('.pipeline-stage',
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power2.out" 
      }
    );

    // Flowing water animation between stages
    gsap.to('.flow-animation', {
      x: "100%",
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
    });
  }, [leads]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-300',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 text-yellow-300',
      green: 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-300',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-300',
      emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-400/30 text-emerald-300',
      red: 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div ref={pipelineRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-light text-blue-100 tracking-wide">
          Revenue Pipeline
        </h3>
        <div className="text-sm text-blue-300/60">
          {leads.length} total leads
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative">
                <div
                  className={`
                    pipeline-stage group
                    bg-gradient-to-br ${getColorClasses(stage.color)}
                    backdrop-blur-xl border rounded-xl p-4
                    hover:scale-105 transition-all duration-300
                    hover:shadow-xl hover:shadow-blue-500/10
                    cursor-pointer
                  `}
                >
                  {/* Stage content */}
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${getColorClasses(stage.color)} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <p className="text-2xl font-light text-blue-100">
                        {stage.count}
                      </p>
                      <p className="text-xs text-blue-300/70 tracking-wide">
                        {stage.label}
                      </p>
                    </div>
                  </div>

                  {/* Hover details */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/5 group-hover:to-cyan-400/5 transition-all duration-300" />
                </div>

                {/* Flow animation between stages */}
                {index < pipelineStages.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="relative w-4 h-4">
                      <ArrowRight className="w-4 h-4 text-blue-400/60" />
                      <div className="absolute inset-0 flow-animation w-1 h-1 bg-blue-400 rounded-full blur-sm -translate-x-full" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pipeline flow visualization */}
        <div className="mt-8 p-6 bg-slate-800/30 backdrop-blur-xl border border-blue-500/20 rounded-xl">
          <h4 className="text-lg font-light text-blue-100 mb-4">Pipeline Flow</h4>
          
          <div className="relative h-16 bg-slate-900/50 rounded-lg overflow-hidden">
            {/* Flow path */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20" />
            
            {/* Animated water flow */}
            <div className="absolute inset-0 opacity-50">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent flow-animation -translate-x-full" />
            </div>

            {/* Stage markers */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              {pipelineStages.slice(0, -1).map((stage, index) => (
                <div key={stage.id} className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between text-xs text-blue-300/60">
            <span>Lead Entry</span>
            <span>Conversion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
