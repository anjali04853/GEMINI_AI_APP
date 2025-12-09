
import React from 'react';
import { Users, HelpCircle, Database, AlertTriangle, Activity, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { useAdminStore } from '../../store/adminStore';

export const AdminDashboard = () => {
  const { users, questions, datasets, reports } = useAdminStore();
  
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">System overview and health status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900">{users.length}</h3>
              <p className="text-xs text-green-600">{activeUsers} Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Questions</p>
              <h3 className="text-2xl font-bold text-slate-900">{questions.length}</h3>
              <p className="text-xs text-slate-500">Across {datasets.length} Datasets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Reports</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingReports}</h3>
              <p className="text-xs text-orange-600">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">System Health</p>
              <h3 className="text-2xl font-bold text-slate-900">98%</h3>
              <p className="text-xs text-slate-500">Operational</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Content requiring moderation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 5).map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-4 w-4 ${report.status === 'pending' ? 'text-red-500' : 'text-green-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900 capitalize">{report.type} Report</p>
                      <p className="text-xs text-slate-500">{report.reason}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
              {reports.length === 0 && <p className="text-slate-500 text-sm">No active reports.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Status</CardTitle>
            <CardDescription>Overview of active question banks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datasets.map(dataset => (
                <div key={dataset.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{dataset.name}</p>
                      <p className="text-xs text-slate-500">{dataset.questionCount} questions</p>
                    </div>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${dataset.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
