import React from 'react';
import { Save, Server, Shield, Brain, Sliders, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdminStore } from '../../store/adminStore';

export const SystemSettings = () => {
  const { config, updateConfig } = useAdminStore();
  const [localConfig, setLocalConfig] = React.useState(config);

  const handleSave = () => {
    updateConfig(localConfig);
    // In real app, toast notification here
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-white">System Settings</h1>
           <p className="text-slate-400 text-sm mt-1">Configure global platform parameters.</p>
        </div>
        <Button onClick={handleSave} className="bg-brand-turquoise hover:bg-teal-500 text-white shadow-lg shadow-brand-turquoise/20">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Model Config */}
        <Card className="bg-brand-darkCharcoal border-slate-700 shadow-lg">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Brain className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-white">AI Model Configuration</CardTitle>
                        <CardDescription className="text-slate-400">Fine-tune the Gemini integration.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Model Version</label>
                    <Input 
                        value={localConfig.aiModelVersion}
                        onChange={(e) => setLocalConfig({...localConfig, aiModelVersion: e.target.value})}
                        className="bg-brand-charcoal border-slate-600 text-white focus:border-brand-purple"
                    />
                    <p className="text-xs text-slate-500 mt-1">Currently active model for user-facing generation tasks.</p>
                </div>
            </CardContent>
        </Card>

        {/* Access Control */}
        <Card className="bg-brand-darkCharcoal border-slate-700 shadow-lg">
            <CardHeader className="border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-white">Access & Security</CardTitle>
                        <CardDescription className="text-slate-400">Manage platform availability and limits.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div>
                        <h4 className="font-medium text-white">Allow New Registrations</h4>
                        <p className="text-sm text-slate-400">If disabled, only admins can create users.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                        type="checkbox" 
                        checked={localConfig.allowRegistrations} 
                        onChange={(e) => setLocalConfig({...localConfig, allowRegistrations: e.target.checked})}
                        className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div>
                        <h4 className="font-medium text-white flex items-center gap-2">
                            Maintenance Mode
                            {localConfig.maintenanceMode && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase font-bold">Active</span>}
                        </h4>
                        <p className="text-sm text-slate-400">Disable all user access for maintenance.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                        type="checkbox" 
                        checked={localConfig.maintenanceMode} 
                        onChange={(e) => setLocalConfig({...localConfig, maintenanceMode: e.target.checked})}
                        className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-1.5 block">Max Daily Sessions</label>
                        <Input 
                            type="number" 
                            value={localConfig.maxDailySessions}
                            onChange={(e) => setLocalConfig({...localConfig, maxDailySessions: parseInt(e.target.value)})}
                            className="bg-brand-charcoal border-slate-600 text-white focus:border-brand-purple"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-1.5 block">Default Time Limit (Mins)</label>
                        <Input 
                            type="number"
                            value={localConfig.defaultTimeLimit}
                            onChange={(e) => setLocalConfig({...localConfig, defaultTimeLimit: parseInt(e.target.value)})}
                            className="bg-brand-charcoal border-slate-600 text-white focus:border-brand-purple"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};