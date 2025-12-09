import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  Activity, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { SimpleBarChart, SimpleRadarChart, SimpleTrendChart } from '../../components/analytics/AnalyticsCharts';

export const AnalyticsDashboard = () => {
  const { 
    totalActivities, 
    averageScore, 
    totalHours, 
    activityData, 
    skillData,
    recentHistory 
  } = useAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="text-slate-500 mt-1">Track your progress and skills growth over time.</p>
        </div>
        <Link to="/analytics/history">
          <Button variant="outline">
            View Full History
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Activities</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalActivities}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Average Score</p>
              <h3 className="text-2xl font-bold text-slate-900">{averageScore}%</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Time Spent</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalHours}h</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Skill Growth</p>
              <h3 className="text-2xl font-bold text-slate-900">+12%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Activity Chart */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Number of practice sessions completed in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[250px] flex items-center justify-center">
                <SimpleBarChart data={activityData} height={250} />
             </div>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Skills Breakdown</CardTitle>
            <CardDescription>Current proficiency analysis based on performance</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[280px]">
             <SimpleRadarChart data={skillData} size={280} />
          </CardContent>
        </Card>
      </div>

      {/* Recent History Preview */}
      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle>Recent Sessions</CardTitle>
                   <CardDescription>Your latest practice activity</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {recentHistory.slice(0, 5).map((item: any, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                {item.type.includes('Voice') ? <Activity className="h-5 w-5 text-orange-500" /> :
                                 item.type.includes('Bot') ? <Activity className="h-5 w-5 text-indigo-500" /> :
                                 <Award className="h-5 w-5 text-blue-500" />}
                             </div>
                             <div>
                                <p className="font-medium text-slate-900 text-sm">{item.type}</p>
                                <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                             </div>
                         </div>
                         <div className="text-right">
                            {item.score !== undefined && (
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                    {item.score}%
                                </span>
                            )}
                         </div>
                      </div>
                  ))}
                  {recentHistory.length === 0 && (
                      <p className="text-slate-400 text-center py-4">No activity yet. Start practicing!</p>
                  )}
               </div>
            </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <CardHeader>
               <CardTitle className="text-white">Recommended Next Steps</CardTitle>
               <CardDescription className="text-indigo-200">AI-generated path to improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                  <h4 className="font-semibold text-sm mb-1">System Design Deep Dive</h4>
                  <p className="text-xs text-indigo-100">Your system design score is slightly below your coding average. Try a focused quiz.</p>
                  <Link to="/interview/setup">
                    <Button variant="secondary" size="sm" className="mt-3 w-full">Start Quiz</Button>
                  </Link>
               </div>
               
               <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                  <h4 className="font-semibold text-sm mb-1">Behavioral Confidence</h4>
                  <p className="text-xs text-indigo-100">Practice speaking your STAR answers to improve flow.</p>
                  <Link to="/interview/voice/setup">
                     <Button variant="secondary" size="sm" className="mt-3 w-full">Practice Voice</Button>
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};
