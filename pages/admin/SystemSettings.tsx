
import React from 'react';
import { Save, Server, Shield, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdminStore } from '../../store/adminStore';

export const SystemSettings = () => {
  const { config, updateConfig } = useAdminStore();
  const [localConfig, setLocalConfig] = React.useState(config);

  const handleSave = () => {
    updateConfig(localConfig);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">System Configuration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Model Settings
          </CardTitle>
          <CardDescription>Configure Gemini integration parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="Model Version" 
            value={localConfig.aiModelVersion}
            onChange={(e) => setLocalConfig({...localConfig, aiModelVersion: e.target.value})}
          />
          <p className="text-xs text-slate-500">Current active model for standard generation tasks.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Shield className="h-5 w-5 text-blue-600" />
             Access & Limits
          </CardTitle>
          <CardDescription>Manage user access control.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between">
              <div>
                 <h4 className="font-medium text-slate-900">Allow New Registrations</h4>
                 <p className="text-sm text-slate-500">If disabled, only admins can create users.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localConfig.allowRegistrations} 
                  onChange={(e) => setLocalConfig({...localConfig, allowRegistrations: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
           </div>
           
           <div className="flex items-center justify-between">
              <div>
                 <h4 className="font-medium text-slate-900">Maintenance Mode</h4>
                 <p className="text-sm text-slate-500">Disable all user access for maintenance.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localConfig.maintenanceMode} 
                  onChange={(e) => setLocalConfig({...localConfig, maintenanceMode: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Input 
                type="number" 
                label="Max Daily Sessions (Per User)" 
                value={localConfig.maxDailySessions}
                onChange={(e) => setLocalConfig({...localConfig, maxDailySessions: parseInt(e.target.value)})}
              />
              <Input 
                 type="number"
                 label="Default Time Limit (Mins)" 
                 value={localConfig.defaultTimeLimit}
                 onChange={(e) => setLocalConfig({...localConfig, defaultTimeLimit: parseInt(e.target.value)})}
              />
           </div>
        </CardContent>
        <CardFooter className="bg-slate-50 rounded-b-lg border-t border-slate-100">
           <Button onClick={handleSave} className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
