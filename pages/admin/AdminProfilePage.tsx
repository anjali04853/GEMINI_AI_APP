import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { 
  User, Mail, Calendar, Shield, Crown, Users, HelpCircle, Database,
  Activity, Clock, CheckCircle, AlertTriangle, Settings, Eye, Edit3,
  BarChart2, FileText, MessageSquare, Lock, Key, Smartphone, Globe,
  TrendingUp, Zap, Server, HardDrive, Cpu, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

type AdminTabType = 'overview' | 'platform' | 'content' | 'analytics' | 'tools';

export const AdminProfilePage = () => {
  const { user } = useAuthStore();
  const { users, questions, datasets, reports } = useAdminStore();
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  const adminStats = [
    { label: 'Total Users Managed', value: users.length.toString(), icon: Users, color: 'text-brand-turquoise' },
    { label: 'Active Today', value: activeUsers.toString(), icon: Activity, color: 'text-green-500' },
    { label: 'Flagged Content', value: pendingReports.toString(), icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Questions Created', value: questions.length.toString(), icon: HelpCircle, color: 'text-brand-purple' },
    { label: 'Datasets Active', value: datasets.length.toString(), icon: Database, color: 'text-brand-pink' },
    { label: 'System Uptime', value: '98.5%', icon: Server, color: 'text-green-500' },
  ];

  const tabs: { id: AdminTabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'platform', label: 'Platform Activity' },
    { id: 'content', label: 'Content Stats' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'tools', label: 'Tools & Permissions' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Admin Profile Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture with Admin Badge */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-500/50 flex items-center justify-center text-3xl font-bold shadow-xl">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 shadow-lg">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Admin Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-bold">{user?.name || 'Sarah Admin'}</h1>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-slate-300">Platform Administrator</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-slate-400">
                <Mail className="h-4 w-4" />
                <span>{user?.email || 'sarah.admin@geminiapp.com'}</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-slate-400">
                <Shield className="h-4 w-4" />
                <span>Admin since January 2024</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                <BarChart2 className="h-4 w-4 mr-2" /> Admin Dashboard
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                <Eye className="h-4 w-4 mr-2" /> View as User
              </Button>
            </div>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            {adminStats.map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                <stat.icon className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-yellow-500 text-yellow-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <AdminOverviewTab />}
        {activeTab === 'platform' && <PlatformActivityTab />}
        {activeTab === 'content' && <ContentStatsTab />}
        {activeTab === 'analytics' && <AdminAnalyticsTab />}
        {activeTab === 'tools' && <ToolsPermissionsTab />}
      </div>
    </div>
  );
};


// Admin Overview Tab
const AdminOverviewTab = () => {
  const recentActions = [
    { action: 'Approved 12 user questions', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
    { action: 'Created new dataset "AI Basics"', time: '4 hours ago', icon: Database, color: 'text-brand-purple' },
    { action: 'Flagged inappropriate content', time: '5 hours ago', icon: AlertTriangle, color: 'text-orange-500' },
    { action: 'Reviewed user report #2847', time: '1 day ago', icon: FileText, color: 'text-brand-turquoise' },
    { action: 'Updated system settings', time: '1 day ago', icon: Settings, color: 'text-slate-500' },
  ];

  const teamMembers = [
    { name: 'John SuperAdmin', status: 'Online now', role: 'Super Admin' },
    { name: 'Mike Moderator', status: '2 hours ago', role: 'Moderator' },
  ];

  const responsibilities = ['Content Moderation', 'User Support', 'Analytics', 'System Config', 'Question Management'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Admin Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Details</CardTitle>
          <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Full Name:</span></div>
            <div className="font-medium">Sarah Admin</div>
            <div><span className="text-slate-500">Email:</span></div>
            <div className="font-medium">sarah.admin@geminiapp.com</div>
            <div><span className="text-slate-500">Role:</span></div>
            <div className="font-medium">Super Administrator</div>
            <div><span className="text-slate-500">Permissions:</span></div>
            <div className="font-medium text-green-600">Full Access</div>
            <div><span className="text-slate-500">Admin ID:</span></div>
            <div className="font-medium font-mono">ADM-2024-001</div>
            <div><span className="text-slate-500">Last Login:</span></div>
            <div className="font-medium">Today at 9:30 AM</div>
            <div><span className="text-slate-500">Location:</span></div>
            <div className="font-medium">Mumbai, India</div>
            <div><span className="text-slate-500">Two-Factor Auth:</span></div>
            <div className="font-medium text-green-600">✅ Enabled</div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Admin Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Admin Actions</CardTitle>
          <Button variant="ghost" size="sm">View All Activity</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <action.icon className={cn("h-4 w-4 flex-shrink-0", action.color)} />
                <span className="flex-1">{action.action}</span>
                <span className="text-slate-400 text-xs">{action.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {responsibilities.map((resp, i) => (
              <span key={i} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-sm font-medium">
                {resp}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members (Other Admins)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teamMembers.map((member, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-slate-500">
                    {member.status === 'Online now' ? (
                      <span className="text-green-500">● Online now</span>
                    ) : (
                      `Last active: ${member.status}`
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View Profile</Button>
                <Button variant="ghost" size="sm">Message</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Platform Activity Tab
const PlatformActivityTab = () => {
  const todayStats = [
    { label: 'Active users', value: '450', icon: Users },
    { label: 'Sessions completed', value: '1,247', icon: CheckCircle },
    { label: 'Quizzes taken', value: '342', icon: HelpCircle },
    { label: 'Voice interviews', value: '89', icon: Activity },
    { label: 'Avg session time', value: '23 min', icon: Clock },
  ];

  const realTimeActivity = [
    { user: 'user_4523', action: 'completed "React Quiz"', time: 'Just now', status: 'success' },
    { user: 'user_1892', action: 'started voice interview', time: '1 min ago', status: 'success' },
    { user: 'user_7734', action: 'flagged question #5621', time: '2 mins ago', status: 'warning' },
    { user: 'user_2341', action: 'earned "Score Master"', time: '3 mins ago', status: 'success' },
    { user: 'user_9012', action: 'reported bug', time: '5 mins ago', status: 'error' },
    { user: 'user_3456', action: 'created new goal', time: '7 mins ago', status: 'success' },
  ];

  const systemHealth = [
    { label: 'Server Status', value: 'All systems operational', status: 'good' },
    { label: 'API Response', value: '98ms (Excellent)', status: 'good' },
    { label: 'Database', value: 'Healthy', status: 'good' },
    { label: 'Storage Used', value: '72% (150GB / 200GB)', status: 'warning' },
    { label: 'Active Sessions', value: '450 / 10,000', status: 'good' },
    { label: 'Queue Jobs', value: '12 pending', status: 'good' },
  ];

  return (
    <div className="space-y-6">
      {/* Today's Stats */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {todayStats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-brand-purple" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Real-time Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Real-time Activity Feed</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Pause</Button>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {realTimeActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-slate-50">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    activity.status === 'success' && "bg-green-500",
                    activity.status === 'warning' && "bg-yellow-500",
                    activity.status === 'error' && "bg-red-500"
                  )} />
                  <span className="font-mono text-xs text-slate-400">{activity.user}</span>
                  <span className="flex-1">{activity.action}</span>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      item.status === 'good' && "bg-green-500",
                      item.status === 'warning' && "bg-yellow-500"
                    )} />
                    <span className="text-sm">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Moderation Queue */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Content Moderation Queue</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </div>
            <Button>Go to Moderation Queue</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-red-600">89</p>
                <p className="text-sm text-red-600">Items pending review</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">45</p>
                <p className="text-sm text-orange-600">Flagged responses</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-yellow-600">Reported users</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <HelpCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">32</p>
                <p className="text-sm text-blue-600">Question submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


// Content Stats Tab
const ContentStatsTab = () => {
  const questionBreakdown = [
    { type: 'Multiple Choice', count: 189, percent: 55 },
    { type: 'Text Response', count: 87, percent: 25 },
    { type: 'Voice Response', count: 45, percent: 13 },
    { type: 'Ranking', count: 21, percent: 7 },
  ];

  const categoryBreakdown = [
    { category: 'Technical', count: 156 },
    { category: 'Behavioral', count: 98 },
    { category: 'Situational', count: 67 },
    { category: 'General', count: 21 },
  ];

  const topDatasets = [
    { name: 'JavaScript Fundamentals', completions: 2345 },
    { name: 'React Basics', completions: 1892 },
    { name: 'Interview Prep', completions: 1567 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Questions Created */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions Created by Me</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">View All</Button>
              <Button size="sm">Create New</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 text-sm">
              <span className="font-semibold">Total: 342 questions</span>
              <span className="text-green-600">Active: 298</span>
              <span className="text-yellow-600">Draft: 12</span>
              <span className="text-slate-400">Archived: 32</span>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Breakdown by Type:</p>
              <div className="space-y-2">
                {questionBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-32">{item.type}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                    <span className="text-sm text-slate-500">{item.count} ({item.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Breakdown by Category:</p>
              <div className="grid grid-cols-2 gap-2">
                {categoryBreakdown.map((item, i) => (
                  <div key={i} className="flex justify-between p-2 bg-slate-50 rounded-lg text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datasets Managed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Datasets Managed</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">View All</Button>
              <Button size="sm">Create Dataset</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 text-sm">
              <span className="font-semibold">Total: 15 datasets</span>
              <span className="text-green-600">Active: 12</span>
              <span className="text-slate-400">Inactive: 3</span>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Most Used Datasets:</p>
              <div className="space-y-2">
                {topDatasets.map((dataset, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-brand-purple">{i + 1}.</span>
                      <span className="font-medium">{dataset.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{dataset.completions.toLocaleString()} completions</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moderation Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Moderation Activity</CardTitle>
            <CardDescription>This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-600">567</p>
                <p className="text-sm text-green-600">Approved</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-red-600">89</p>
                <p className="text-sm text-red-600">Rejected</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <Edit3 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">123</p>
                <p className="text-sm text-blue-600">Edited</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-purple-600">2.5m</p>
                <p className="text-sm text-purple-600">Avg review time</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1">View Moderation History</Button>
              <Button variant="outline" className="flex-1">Reports</Button>
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>User Engagement with My Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-purple">15,234</p>
                <p className="text-sm text-slate-500">Total Interactions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">4.7/5.0</p>
                <p className="text-sm text-slate-500">Average Rating ⭐</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">87%</p>
                <p className="text-sm text-slate-500">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-turquoise">78%</p>
                <p className="text-sm text-slate-500">Average Score</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Detailed Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Admin Analytics Tab
const AdminAnalyticsTab = () => {
  const actionBreakdown = [
    { action: 'Content Moderation', percent: 45, color: 'bg-brand-purple' },
    { action: 'Question Creation', percent: 30, color: 'bg-brand-turquoise' },
    { action: 'User Support', percent: 15, color: 'bg-brand-pink' },
    { action: 'System Config', percent: 10, color: 'bg-orange-500' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Admin (You)', actions: 1247, medal: '🥇' },
    { rank: 2, name: 'John SuperAdmin', actions: 1089, medal: '🥈' },
    { rank: 3, name: 'Mike Moderator', actions: 892, medal: '🥉' },
    { rank: 4, name: 'Emma Support', actions: 567, medal: '' },
    { rank: 5, name: 'Alex Content', actions: 432, medal: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'].map((range, i) => (
          <button
            key={i}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              i === 1 ? "bg-yellow-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2 px-4">
              {[25, 35, 42, 38, 45, 50, 48, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80, 78, 85, 82, 90, 88, 95, 92, 98, 95, 100, 97, 105].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-sm transition-all hover:opacity-80"
                    style={{ height: `${value * 0.9}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-4">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Action Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionBreakdown.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.action}</span>
                  <span className="font-medium">{item.percent}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Response Time Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-purple">15m</p>
                <p className="text-xs text-slate-500">Avg Response Time</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-500">2m</p>
                <p className="text-xs text-slate-500">Fastest Response</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-turquoise">18m</p>
                <p className="text-xs text-slate-500">Moderation Queue</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-pink">12m</p>
                <p className="text-xs text-slate-500">User Support</p>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm font-medium text-green-700">Performance Rating: ⭐⭐⭐⭐⭐ (Excellent)</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Leaderboard */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Admin Leaderboard (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((admin, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  admin.rank === 1 ? "bg-yellow-50 border border-yellow-200" : "bg-slate-50"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-8">{admin.medal || admin.rank}</span>
                    <span className={cn("font-medium", admin.rank === 1 && "text-yellow-700")}>{admin.name}</span>
                  </div>
                  <span className="font-bold">{admin.actions.toLocaleString()} actions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
