import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Activity,
  Clock,
  Target,
  TrendingUp,
  Award,
  Calendar,
  ArrowRight,
  Flame,
  FileText,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAnalyticsSummary, useSkillsData, useActivityData, useAnalyticsReport } from '../../hooks/api/useAnalyticsApi';
import { SimpleBarChart, SimpleRadarChart, SimpleTrendChart, HorizontalBarChart, DonutChart } from '../../components/analytics/AnalyticsCharts';
import { cn } from '../../lib/utils';
import { Tooltip } from '../../components/ui/Tooltip';
import { Skeleton } from '../../components/ui/Skeleton';

type Period = '7d' | '30d' | '90d';

const MODE_COLORS: Record<string, string> = {
  quiz: '#6C63FF',
  text: '#FF6B9D',
  voice: '#4ECDC4',
  bot: '#0EA5E9',
};

const SKILL_GRADIENTS = [
  { gradientFrom: '#4ade80', gradientTo: '#22c55e' },
  { gradientFrom: '#2dd4bf', gradientTo: '#0ea5e9' },
  { gradientFrom: '#4ECDC4', gradientTo: '#2dd4bf' },
  { gradientFrom: '#f97316', gradientTo: '#facc15' },
  { gradientFrom: '#6C63FF', gradientTo: '#a78bfa' },
];

export const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<Period>('7d');

  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: skillsData, isLoading: skillsLoading } = useSkillsData();
  const { data: activityData, isLoading: activityLoading } = useActivityData(period);
  const { data: reportData, isLoading: reportLoading } = useAnalyticsReport(period);

  const isLoading = summaryLoading || skillsLoading || activityLoading || reportLoading;

  // Extract values from API response with fallbacks
  const totalActivities = summary?.totalActivities || 0;
  const averageScore = summary?.averageScore || 0;
  const totalHours = summary?.totalHours || '0';
  const streakDays = summary?.streakDays || 0;
  const improvement = reportData?.summary?.improvement || '0%';

  // Skills data for radar chart (API returns { subject, value, sessions })
  const skillData = skillsData?.skills || [];

  // Transform weekly progress to trend data (array of scores)
  const trendData = useMemo(() => {
    if (!reportData?.weeklyProgress?.length) {
      return []; // Return empty array when no data
    }
    return reportData.weeklyProgress.map(w => w.avgScore);
  }, [reportData?.weeklyProgress]);

  // Transform skills data for topic performance horizontal bar chart
  const topicPerformance = useMemo(() => {
    if (!skillsData?.skills?.length) {
      return []; // Return empty array when no data
    }
    return skillsData.skills.slice(0, 5).map((skill, i) => ({
      label: skill.subject,
      value: skill.value,
      ...(SKILL_GRADIENTS[i % SKILL_GRADIENTS.length]),
    }));
  }, [skillsData?.skills]);

  // Transform mode distribution from report API
  const modeDistribution = useMemo(() => {
    if (!reportData?.modeDistribution?.length) {
      return []; // Return empty array when no data
    }
    return reportData.modeDistribution.map(m => ({
      label: m.mode.charAt(0).toUpperCase() + m.mode.slice(1),
      value: m.count,
      color: MODE_COLORS[m.mode] || '#94a3b8',
    }));
  }, [reportData?.modeDistribution]);

  // Transform activity data to heatmap (90 days)
  const heatmapData = useMemo(() => {
    if (!activityData?.data?.length) {
      // Return empty array for no data state
      return Array(84).fill(0);
    }
    // Create a map of date -> count
    const activityMap = new Map(activityData.data.map(d => [d.date, d.value]));

    // Generate last 84 days of data
    const data: number[] = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]!;
      const count = activityMap.get(dateStr) || 0;
      // Normalize to 0-3 range for heatmap
      data.push(Math.min(3, count));
    }
    return data;
  }, [activityData?.data]);

  const hasNoData = totalActivities === 0; 

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header & Date Range */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time insights into your learning journey.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
               <button
                 onClick={() => setPeriod('7d')}
                 className={cn("px-3 py-1 rounded-md transition-all", period === '7d' ? "bg-white shadow-sm text-brand-purple" : "text-slate-500 hover:text-slate-900")}
               >7 Days</button>
               <button
                 onClick={() => setPeriod('30d')}
                 className={cn("px-3 py-1 rounded-md transition-all", period === '30d' ? "bg-white shadow-sm text-brand-purple" : "text-slate-500 hover:text-slate-900")}
               >30 Days</button>
               <button
                 onClick={() => setPeriod('90d')}
                 className={cn("px-3 py-1 rounded-md transition-all", period === '90d' ? "bg-white shadow-sm text-brand-purple" : "text-slate-500 hover:text-slate-900")}
               >3 Months</button>
            </div>
            <Link to="/dashboard/analytics/report">
                <Button className="bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/20">
                    <FileText className="mr-2 h-4 w-4" />
                    Full Report
                </Button>
            </Link>
        </div>
      </div>

      {/* Header Statistics - Row of Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-brand-purple/10 rounded-full text-brand-purple ring-4 ring-brand-purple/5">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Sessions</p>
              <h3 className="text-2xl font-black text-slate-900">{totalActivities}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-brand-turquoise/10 rounded-full text-brand-turquoise ring-4 ring-brand-turquoise/5">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Score</p>
              <h3 className="text-2xl font-black text-slate-900">{averageScore}%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-green-100 rounded-full text-green-600 ring-4 ring-green-50">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Improvement</p>
              <div className="flex items-center">
                 {isLoading ? (
                   <Skeleton className="h-8 w-16" />
                 ) : (
                   <>
                     <h3 className="text-2xl font-black text-slate-900">{improvement}</h3>
                     <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded flex items-center">
                        <ArrowRight className="h-3 w-3 -rotate-45 mr-0.5" /> {period === '7d' ? 'This Week' : period === '30d' ? 'This Month' : 'This Quarter'}
                     </span>
                   </>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-brand-yellow/20 rounded-full text-yellow-600 ring-4 ring-brand-yellow/10">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Streak</p>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <h3 className="text-2xl font-black text-slate-900">{streakDays} Days</h3>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Section */}
      <Card className="border-none shadow-md">
         <CardHeader>
            <CardTitle className="text-brand-purple">Activity Heatmap</CardTitle>
            <CardDescription>Visualizing your consistency over the last 3 months.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
               {heatmapData.map((level, i) => (
                   <Tooltip key={i} content={`${level * 2} sessions`} className="cursor-help">
                       <div className={cn(
                           "w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all hover:scale-125",
                           level === 0 ? "bg-slate-100" :
                           level === 1 ? "bg-brand-lavender" :
                           level === 2 ? "bg-brand-purple/50" :
                           "bg-brand-purple"
                       )}></div>
                   </Tooltip>
               ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-end">
                <span>Less</span>
                <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-brand-lavender rounded-sm"></div>
                <div className="w-3 h-3 bg-brand-purple/50 rounded-sm"></div>
                <div className="w-3 h-3 bg-brand-purple rounded-sm"></div>
                <span>More</span>
            </div>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trend Chart */}
          <Card className="lg:col-span-2 border-none shadow-md">
             <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-800 border-b-2 border-brand-turquoise pb-1">Score Trend</CardTitle>
                </div>
                <CardDescription>Your performance trajectory over the last 10 sessions.</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                {trendData.length > 0 ? (
                  <SimpleTrendChart data={trendData} height={250} />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
                    Complete some sessions to see your score trend
                  </div>
                )}
             </CardContent>
          </Card>

          {/* Topic Performance */}
          <Card className="border-none shadow-md">
             <CardHeader>
                <CardTitle className="text-slate-800">Topic Performance</CardTitle>
                <CardDescription>Breakdown by subject area.</CardDescription>
             </CardHeader>
             <CardContent>
                {topicPerformance.length > 0 ? (
                  <HorizontalBarChart data={topicPerformance} />
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">
                    Complete assessments to see topic breakdown
                  </div>
                )}
             </CardContent>
          </Card>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mode Comparison (Donut) */}
          <Card className="border-none shadow-md">
             <CardHeader>
                <CardTitle className="text-slate-800">Mode Preference</CardTitle>
                <CardDescription>Distribution of your practice sessions.</CardDescription>
             </CardHeader>
             <CardContent className="flex flex-col items-center">
                {modeDistribution.length > 0 ? (
                  <>
                    <DonutChart data={modeDistribution} size={220} />
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
                        {modeDistribution.map((mode, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }}></span>
                                 {mode.label} ({mode.value})
                            </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
                    Try different interview modes to see distribution
                  </div>
                )}
             </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card className="border-2 border-brand-lavender/30 border-dashed shadow-sm">
             <CardHeader>
                <CardTitle className="text-slate-800">Skill Radar</CardTitle>
                <CardDescription>Balanced assessment of your competencies.</CardDescription>
             </CardHeader>
             <CardContent className="flex justify-center pb-2">
                {skillData.length > 0 ? (
                  <SimpleRadarChart data={skillData} size={280} />
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
                    Complete assessments to build your skill profile
                  </div>
                )}
             </CardContent>
          </Card>
      </div>
      
      {/* History Link */}
      <div className="flex justify-center">
         <Link to="/dashboard/analytics/history">
            <Button variant="outline" className="text-slate-500 hover:text-brand-purple border-slate-200">
                View Full Session History
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
         </Link>
      </div>

    </div>
  );
};