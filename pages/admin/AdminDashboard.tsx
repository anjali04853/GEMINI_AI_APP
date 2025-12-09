import React from 'react';
import { Users, HelpCircle, Database, AlertTriangle, Activity, Settings, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { useAdminStore } from '../../store/adminStore';
import { cn } from '../../lib/utils';

export const AdminDashboard = () => {
  const { users, questions, datasets, reports } = useAdminStore();
  
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  
  const metrics = [
    { 
      label: "Total Users", 
      value: users.length, 
      subtext: `${activeUsers} Active`, 
      icon: Users, 
      color: "text-brand-turquoise", 
      bg: "bg-brand-turquoise/10",
      border: "border-brand-turquoise" 
    },
    { 
      label: "Questions", 
      value: questions.length, 
      subtext: `Across ${datasets.length} Datasets`, 
      icon: HelpCircle, 
      color: "text-brand-purple", 
      bg: "bg-brand-purple/10",
      border: "border-brand-purple" 
    },
    { 
      label: "Pending Reports", 
      value: pendingReports, 
      subtext: "Action Required", 
      icon: AlertTriangle, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      border: "border-orange-500" 
    },
    { 
      label: "System Health", 
      value: "99.9%", 
      subtext: "All Systems Operational", 
      icon: Activity, 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      border: "border-green-500" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Platform metrics and health status.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Card key={i} className={cn("bg-white border-t-4 border-x-slate-100 border-b-slate-100 shadow-md hover:-translate-y-1 transition-transform", metric.border)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", metric.bg)}>
                  <metric.icon className={cn("h-6 w-6", metric.color)} />
                </div>
                {/* Mock Sparkline */}
                <div className="flex gap-0.5 items-end h-8">
                   {[40, 60, 45, 80, 50, 90, 70].map((h, idx) => (
                      <div key={idx} className={cn("w-1 rounded-t-sm opacity-50", metric.color.replace('text-', 'bg-'))} style={{ height: `${h}%` }}></div>
                   ))}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{metric.value}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">{metric.label}</p>
                <p className={cn("text-xs mt-2 font-medium", metric.color)}>{metric.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Feed */}
        <Card className="bg-white border-t-4 border-brand-sky shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">System Activity</CardTitle>
            <CardDescription className="text-slate-500">Recent system events and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative pl-2">
              {/* Timeline Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
              
              {[
                { time: "2 mins ago", msg: "New user registration: alex.dev", type: "user" },
                { time: "15 mins ago", msg: "Backup completed successfully", type: "system" },
                { time: "1 hour ago", msg: "Flagged content report #1234", type: "alert" },
                { time: "2 hours ago", msg: "Dataset 'React 2024' updated", type: "data" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  <div className={cn(
                    "w-3 h-3 rounded-full mt-1.5 border-2 border-white shadow-sm",
                    item.type === "alert" ? "bg-red-500" : item.type === "system" ? "bg-green-500" : "bg-brand-sky"
                  )}></div>
                  <div>
                    <p className="text-sm text-slate-700">{item.msg}</p>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-white border-t-4 border-orange-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Moderation Queue</CardTitle>
              <CardDescription className="text-slate-500">Items requiring attention</CardDescription>
            </div>
            <div className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
               {pendingReports} Pending
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 4).map(report => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      report.status === 'pending' ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
                    )}>
                       <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-brand-purple transition-colors capitalize">{report.type} Report</p>
                      <p className="text-xs text-slate-500">{report.reason}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider",
                    report.status === 'pending' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                  )}>
                    {report.status}
                  </span>
                </div>
              ))}
              {reports.length === 0 && <p className="text-slate-400 text-sm italic">No active reports.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};