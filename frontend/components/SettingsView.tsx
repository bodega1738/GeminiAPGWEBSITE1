import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Database,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';

export default function SettingsView() {
  const viewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    gsap.fromTo(viewRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo('.settings-section',
      { x: 30, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-black">EF</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-amber-100">EFR Admin</h3>
                <p className="text-amber-300/60">Marine Operations Manager</p>
                <button className="mt-2 text-sm text-amber-400 hover:text-amber-300">Change Photo</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-amber-300/70 mb-2">First Name</label>
                <input 
                  type="text" 
                  defaultValue="EFR"
                  className="w-full p-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-sm text-amber-300/70 mb-2">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Admin"
                  className="w-full p-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-sm text-amber-300/70 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/60" />
                  <input 
                    type="email" 
                    defaultValue="admin@efr-subic.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-amber-300/70 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/60" />
                  <input 
                    type="tel" 
                    defaultValue="+63 47 252 3456"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-amber-300/70 mb-2">Company</label>
                <input 
                  type="text" 
                  defaultValue="EFR Marine Tourism"
                  className="w-full p-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-amber-300/70 mb-2">Bio</label>
                <textarea 
                  rows={3}
                  defaultValue="Experienced marine operations manager specializing in luxury yacht charters and marine tourism in Subic Bay area."
                  className="w-full p-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Password Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-amber-300/70 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/60" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-300/60 hover:text-amber-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-amber-300/70 mb-2">New Password</label>
                  <input 
                    type="password"
                    className="w-full p-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-300/70 mb-2">Confirm New Password</label>
                  <input 
                    type="password"
                    className="w-full p-3 bg-slate-900/50 border border-amber-500/20 rounded-lg text-amber-100 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Two-Factor Authentication</h3>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100">Enable 2FA</p>
                    <p className="text-sm text-amber-300/60">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Login Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'Subic Bay, Philippines', time: 'Current session', current: true },
                  { device: 'iPhone 13', location: 'Manila, Philippines', time: '2 hours ago', current: false },
                  { device: 'iPad Pro', location: 'Olongapo, Philippines', time: '1 day ago', current: false }
                ].map((session, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">{session.device}</p>
                      <p className="text-sm text-amber-300/60">{session.location} • {session.time}</p>
                    </div>
                    {!session.current && (
                      <button className="text-sm text-red-400 hover:text-red-300">Revoke</button>
                    )}
                    {session.current && (
                      <span className="text-sm text-green-400">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { title: 'New Lead Alerts', description: 'Get notified when new leads come in', enabled: true },
                  { title: 'Booking Confirmations', description: 'Receive updates on booking status changes', enabled: true },
                  { title: 'Payment Notifications', description: 'Alerts for payments received', enabled: true },
                  { title: 'Weekly Reports', description: 'Weekly business performance summaries', enabled: false },
                  { title: 'Marketing Updates', description: 'Updates about new features and improvements', enabled: false }
                ].map((notification, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100">{notification.title}</p>
                        <p className="text-sm text-amber-300/60">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {[
                  { title: 'Urgent Lead Alerts', description: 'High-priority leads that need immediate attention', enabled: true },
                  { title: 'System Maintenance', description: 'Notifications about system updates and maintenance', enabled: true },
                  { title: 'Daily Summaries', description: 'End-of-day business summaries', enabled: false }
                ].map((notification, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100">{notification.title}</p>
                        <p className="text-sm text-amber-300/60">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Theme Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border-2 border-amber-400/50">
                  <div className="w-full h-20 bg-gradient-to-br from-black via-slate-900 to-black rounded-lg mb-3"></div>
                  <p className="text-amber-100 text-center">EFR Marine (Current)</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-lg mb-3"></div>
                  <p className="text-amber-100 text-center">Ocean Blue</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-lg mb-3"></div>
                  <p className="text-amber-100 text-center">Sunset Purple</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">Compact Mode</p>
                      <p className="text-sm text-amber-300/60">Show more information in less space</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">Animation Effects</p>
                      <p className="text-sm text-amber-300/60">Enable smooth transitions and animations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Social Media Integrations</h3>
              <div className="space-y-4">
                {[
                  { name: 'Facebook Messenger', icon: '📘', connected: true, description: 'Sync Facebook messages with CRM' },
                  { name: 'Instagram', icon: '📷', connected: true, description: 'Monitor Instagram DMs and comments' },
                  { name: 'WhatsApp Business', icon: '💬', connected: false, description: 'Connect WhatsApp Business account' }
                ].map((integration, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="text-amber-100">{integration.name}</p>
                          <p className="text-sm text-amber-300/60">{integration.description}</p>
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        integration.connected 
                          ? 'bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30'
                          : 'bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30'
                      }`}>
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-amber-100 mb-4">Payment Gateways</h3>
              <div className="space-y-4">
                {[
                  { name: 'PayPal', connected: true, description: 'Accept international payments' },
                  { name: 'GCash', connected: true, description: 'Local Philippine mobile payments' },
                  { name: 'PayMaya', connected: false, description: 'Digital wallet payments' },
                  { name: 'Bank Transfer', connected: true, description: 'Direct bank transfers' }
                ].map((gateway, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100">{gateway.name}</p>
                        <p className="text-sm text-amber-300/60">{gateway.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          gateway.connected 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {gateway.connected ? 'Connected' : 'Not Connected'}
                        </span>
                        <button className="text-sm text-amber-400 hover:text-amber-300">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={viewRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-light text-amber-100 tracking-wide">
            Settings
          </h2>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-300 hover:text-amber-100 hover:bg-amber-500/30 transition-all">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/30 backdrop-blur-xl border border-amber-500/20 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all
                      ${activeTab === tab.id 
                        ? 'bg-amber-500/20 border border-amber-400/30 text-amber-100' 
                        : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-500/10'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="settings-section bg-slate-900/30 backdrop-blur-xl border border-amber-500/20 rounded-xl p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
