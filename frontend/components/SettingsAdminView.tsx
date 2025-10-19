import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsAdminView() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      return await backend.settings.getSettings();
    },
  });

  const [toggles, setToggles] = useState({
    messaging: false,
    audit: false,
    exports: false,
    invites: false,
    aiAssistant: false,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newToggles: any) => {
      return await backend.settings.updateSettings({
        toggles: newToggles,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleToggleChange = (key: string, value: boolean) => {
    const updated = { ...toggles, [key]: value };
    setToggles(updated);
    updateSettingsMutation.mutate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Organization Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Messaging</Label>
              <p className="text-sm text-slate-400">Enable messaging features</p>
            </div>
            <Switch
              checked={settings?.toggles?.messaging || false}
              onCheckedChange={(checked) => handleToggleChange('messaging', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Audit Logs</Label>
              <p className="text-sm text-slate-400">Track all user actions</p>
            </div>
            <Switch
              checked={settings?.toggles?.audit || false}
              onCheckedChange={(checked) => handleToggleChange('audit', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Data Exports</Label>
              <p className="text-sm text-slate-400">Allow data export functionality</p>
            </div>
            <Switch
              checked={settings?.toggles?.exports || false}
              onCheckedChange={(checked) => handleToggleChange('exports', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">User Invites</Label>
              <p className="text-sm text-slate-400">Enable user invitation system</p>
            </div>
            <Switch
              checked={settings?.toggles?.invites || false}
              onCheckedChange={(checked) => handleToggleChange('invites', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">AI Assistant</Label>
              <p className="text-sm text-slate-400">Enable AI-powered assistant</p>
            </div>
            <Switch
              checked={settings?.toggles?.aiAssistant || false}
              onCheckedChange={(checked) => handleToggleChange('aiAssistant', checked)}
            />
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Configuration</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Active Provider</Label>
            <p className="text-white">{settings?.activeAiProviderKeyName || 'Not configured'}</p>
            <p className="text-sm text-slate-400 mt-1">
              Configure secret values in the Infrastructure settings
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
