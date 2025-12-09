import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  User, Mail, Calendar, Award, Target, TrendingUp, Flame, Star,
  Edit3, Share2, Settings, CheckCircle, Mic, FileText, Trophy,
  Clock, BarChart2, Zap, BookOpen, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

type TabType = 'overview' | 'activity' | 'goals' | 'achievements' | 'stats';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const stats = [
    { label: 'Sessions Completed', value: '125', icon: CheckCircle, color: 'text-brand-turquoise' },
    { label: 'Avg Score', value: '89%', icon: TrendingUp, color: 'text-brand-purple' },
    { label: 'Badges Earned', value: '42', icon: Award, color: 'text-brand-pink' },
    { label: 'Day Streak', value: '15', icon: Flame, color: 'text-orange-500' },
    { label: 'Level', value: '12', icon: Star, color: 'text-yellow-500' },
    { label: 'Active Days', value: '7', icon: Zap, color: 'text-green-500' },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'goals', label: 'Goals' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Profile Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-purple via-brand-pink to-brand-turquoise p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Profile Picture */}
            <div className="relative group mb-4">
              <div className="h-28 w-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center text-4xl font-bold shadow-xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit3 className="h-6 w-6" />
              </button>
            </div>

            {/* User Info */}
            <h1 className="text-2xl font-bold">{user?.name || 'John Doe'}</h1>
            <p className="text-white/80">Software Engineer</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/70">
              <Mail className="h-4 w-4" />
              <span>{user?.email || 'john.doe@example.com'}</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/70">
              <Calendar className="h-4 w-4" />
              <span>Member since March 2024</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 w-full max-w-3xl">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <stat.icon className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                <Share2 className="h-4 w-4 mr-2" /> Share Profile
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Button>
            </div>
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
                  ? "border-brand-purple text-brand-purple"
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'activity' && <ActivityTab />}
        {activeTab === 'goals' && <GoalsTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>
    </div>
  );
};


// Overview Tab Component
const OverviewTab = () => {
  const skills = ['React', 'JavaScript', 'Python', 'Data Structures', 'Algorithms', 'System Design', 'Communication'];
  
  const recentAchievements = [
    { icon: '🏆', name: 'Score Master', time: '2 days ago' },
    { icon: '⭐', name: 'Quick Learner', time: '5 days ago' },
    { icon: '🎯', name: 'Consistent', time: '1 week ago' },
  ];

  const goals = [
    { name: 'Master React Advanced Concepts', progress: 65, target: 'June 2024' },
    { name: 'Ace System Design Interviews', progress: 25, target: 'July 2024' },
  ];

  const streakDays = [
    [1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* About Me */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>About Me</CardTitle>
          <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Aspiring software engineer passionate about AI and machine learning. 
            Currently preparing for technical interviews at top tech companies.
          </p>
        </CardContent>
      </Card>

      {/* Current Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Goals</CardTitle>
          <Button variant="ghost" size="sm">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-brand-purple" />
                <span className="font-medium text-sm">{goal.name}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-turquoise rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">Target: {goal.target}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Achievements</CardTitle>
          <Button variant="ghost" size="sm">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {recentAchievements.map((achievement, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <p className="text-xs font-medium">{achievement.name}</p>
                <p className="text-xs text-slate-400">{achievement.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-brand-lavender text-brand-purple rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
            <button className="px-3 py-1 border-2 border-dashed border-slate-300 text-slate-400 rounded-full text-sm hover:border-brand-purple hover:text-brand-purple transition-colors">
              + Add Skill
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Streak Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Streak Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-3">March 2024</p>
          <div className="space-y-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIdx) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-8">{day}</span>
                <div className="flex gap-1">
                  {streakDays.map((week, weekIdx) => (
                    <div
                      key={weekIdx}
                      className={cn(
                        "h-4 w-4 rounded-sm",
                        week[dayIdx] ? "bg-brand-turquoise" : "bg-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <div className="h-3 w-3 bg-slate-200 rounded-sm" /> Inactive
            <div className="h-3 w-3 bg-brand-turquoise rounded-sm" /> Active
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


// Activity Tab Component
const ActivityTab = () => {
  const activities = [
    { type: 'quiz', title: 'Completed React Quiz - Advanced Hooks', score: '92%', improvement: '+12%', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
    { type: 'voice', title: 'Voice Interview Practice - Behavioral', duration: '25 minutes', time: '5 hours ago', icon: Mic, color: 'text-brand-purple' },
    { type: 'text', title: 'Text Interview - Data Structures', score: '88%', time: '1 day ago', icon: FileText, color: 'text-brand-turquoise' },
    { type: 'achievement', title: 'Achievement Unlocked: Score Master', desc: 'Achieved 90%+ on 5 consecutive quizzes', time: '1 day ago', icon: Trophy, color: 'text-yellow-500' },
    { type: 'goal', title: 'Goal Progress Updated', desc: '"Master React" - 65% complete (+10%)', time: '3 days ago', icon: Target, color: 'text-brand-pink' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Feed</CardTitle>
        <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
          <option>All Time</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-500">Today</p>
          {activities.slice(0, 2).map((activity, i) => (
            <ActivityItem key={i} activity={activity} />
          ))}
          
          <p className="text-sm font-semibold text-slate-500 pt-4">Yesterday</p>
          {activities.slice(2, 4).map((activity, i) => (
            <ActivityItem key={i} activity={activity} />
          ))}
          
          <p className="text-sm font-semibold text-slate-500 pt-4">This Week</p>
          {activities.slice(4).map((activity, i) => (
            <ActivityItem key={i} activity={activity} />
          ))}
          
          <Button variant="outline" className="w-full mt-4">Load More</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ activity }: { activity: any }) => (
  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
    <div className={cn("p-2 rounded-full bg-white shadow-sm", activity.color)}>
      <activity.icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-slate-900">{activity.title}</p>
      {activity.score && (
        <p className="text-sm text-slate-500">
          Score: {activity.score} {activity.improvement && <span className="text-green-500">({activity.improvement} improvement)</span>}
        </p>
      )}
      {activity.duration && <p className="text-sm text-slate-500">Duration: {activity.duration}</p>}
      {activity.desc && <p className="text-sm text-slate-500">{activity.desc}</p>}
      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
    </div>
    <Button variant="ghost" size="sm">View Details</Button>
  </div>
);

// Goals Tab Component
const GoalsTab = () => {
  const activeGoals = [
    { name: 'Master React Advanced Concepts', progress: 65, target: 'June 30, 2024', sessions: '13/20', streak: 5, recent: ['React Hooks Quiz - 92% (Today)', 'Component Patterns - 88% (Yesterday)'] },
    { name: 'Ace Technical Interviews', progress: 25, target: 'July 15, 2024', sessions: '5/20', streak: 2, recent: [] },
  ];

  const completedGoals = [
    { name: 'JavaScript Fundamentals', completed: 'March 15, 2024', score: '95%' },
  ];

  const suggestedGoals = ['Python for Beginners', 'System Design Basics', 'Behavioral Interview Skills'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Learning Goals</CardTitle>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-brand-purple font-medium">Active: 3</span>
              <span className="text-green-500 font-medium">Completed: 12</span>
              <span className="text-slate-400">Archived: 5</span>
            </div>
          </div>
          <Button><Target className="h-4 w-4 mr-2" /> Create Goal</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-semibold text-slate-700">Active Goals</p>
          {activeGoals.map((goal, i) => (
            <div key={i} className="p-4 border rounded-xl space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-purple" />
                <span className="font-semibold">{goal.name}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-turquoise to-brand-purple rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-slate-500">Target:</span> {goal.target}</div>
                <div><span className="text-slate-500">Sessions:</span> {goal.sessions}</div>
                <div><span className="text-slate-500">Streak:</span> {goal.streak} days</div>
              </div>
              {goal.recent.length > 0 && (
                <div className="text-sm">
                  <p className="text-slate-500 mb-1">Recent Activity:</p>
                  {goal.recent.map((r, idx) => (
                    <p key={idx} className="text-slate-600">• {r}</p>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">Mark Complete</Button>
                <Button variant="ghost" size="sm" className="text-slate-400">Archive</Button>
              </div>
            </div>
          ))}

          <p className="font-semibold text-slate-700 pt-4">Completed Goals (12)</p>
          {completedGoals.map((goal, i) => (
            <div key={i} className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">{goal.name}</p>
                <p className="text-sm text-slate-500">Completed: {goal.completed} • Final Score: {goal.score}</p>
              </div>
            </div>
          ))}

          <p className="font-semibold text-slate-700 pt-4">Suggested Goals for You</p>
          <div className="grid grid-cols-3 gap-4">
            {suggestedGoals.map((goal, i) => (
              <div key={i} className="p-4 border-2 border-dashed rounded-xl text-center hover:border-brand-purple transition-colors cursor-pointer">
                <BookOpen className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="font-medium text-sm">{goal}</p>
                <Button variant="ghost" size="sm" className="mt-2">+ Add</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


// Achievements Tab Component
const AchievementsTab = () => {
  const earnedBadges = [
    { icon: '🏆', name: 'Score Master', earned: true, time: '2d ago' },
    { icon: '⭐', name: 'Quick Learner', earned: true, time: '5d ago' },
    { icon: '🎯', name: 'Sharp Shooter', earned: true, time: '1w ago' },
    { icon: '🔥', name: 'Week Warrior', earned: true, time: '2w ago' },
    { icon: '⚡', name: 'Speed Demon', earned: true, time: '3w ago' },
  ];

  const inProgressBadges = [
    { icon: '🎓', name: 'Centurion', progress: 75, current: 75, total: 100 },
    { icon: '💎', name: 'Consistency Quest', progress: 60, current: 30, total: 50 },
    { icon: '🌟', name: 'Perfectionist', progress: 40, current: 4, total: 10 },
    { icon: '👑', name: 'Interview King', progress: 20, current: 2, total: 10 },
  ];

  const lockedBadges = [
    { icon: '🔒', name: 'Legend' },
    { icon: '🔒', name: 'Elite Expert' },
    { icon: '🔒', name: 'Marathon' },
    { icon: '🔒', name: 'Ninja Coder' },
  ];

  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Special'];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Achievements & Badges</CardTitle>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-slate-600">All: 70</span>
              <span className="text-green-500 font-medium">Earned: 42</span>
              <span className="text-slate-400">Locked: 28</span>
            </div>
          </div>
          <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
            <option>Sort: Recent</option>
            <option>Sort: Name</option>
            <option>Sort: Rarity</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recently Earned */}
        <div>
          <p className="font-semibold text-slate-700 mb-3">Recently Earned</p>
          <div className="flex flex-wrap gap-4">
            {earnedBadges.map((badge, i) => (
              <div key={i} className="w-24 text-center p-3 bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 rounded-xl">
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium truncate">{badge.name}</p>
                <p className="text-xs text-green-500">✓ Earned</p>
                <p className="text-xs text-slate-400">{badge.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <p className="font-semibold text-slate-700 mb-3">In Progress</p>
          <div className="flex flex-wrap gap-4">
            {inProgressBadges.map((badge, i) => (
              <div key={i} className="w-24 text-center p-3 bg-slate-50 border rounded-xl">
                <div className="text-3xl mb-1 grayscale-[30%]">{badge.icon}</div>
                <p className="text-xs font-medium truncate">{badge.name}</p>
                <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-purple rounded-full" style={{ width: `${badge.progress}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{badge.current}/{badge.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Locked */}
        <div>
          <p className="font-semibold text-slate-700 mb-3">Locked Badges</p>
          <div className="flex flex-wrap gap-4">
            {lockedBadges.map((badge, i) => (
              <div key={i} className="w-24 text-center p-3 bg-slate-100 border border-slate-200 rounded-xl opacity-60">
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium truncate">{badge.name}</p>
                <p className="text-xs text-slate-400">???</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="pt-4 border-t">
          <p className="text-sm text-slate-500 mb-2">Badge Categories:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                  i === 0 ? "bg-brand-purple text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Tab Component
const StatsTab = () => {
  const modePerformance = [
    { mode: 'Quiz Mode', score: 85, color: 'bg-brand-purple' },
    { mode: 'Text Interview', score: 72, color: 'bg-brand-turquoise' },
    { mode: 'Voice Interview', score: 78, color: 'bg-brand-pink' },
    { mode: 'Live Bot', score: 68, color: 'bg-orange-500' },
  ];

  const timeRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'];
  const [selectedRange, setSelectedRange] = useState(1);

  const heatmapData = Array(7).fill(null).map(() => 
    Array(12).fill(null).map(() => Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0)
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {timeRanges.map((range, i) => (
          <button
            key={i}
            onClick={() => setSelectedRange(i)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedRange === i ? "bg-brand-purple text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overall Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2 px-4">
              {[60, 65, 70, 75, 80, 85, 88, 90, 85, 92, 88, 95].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-brand-purple to-brand-turquoise rounded-t-sm transition-all hover:opacity-80"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-slate-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Radar (Simplified) */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { skill: 'Technical', score: 90 },
                { skill: 'Problem Solving', score: 85 },
                { skill: 'Communication', score: 75 },
                { skill: 'Behavioral', score: 70 },
                { skill: 'Speed', score: 80 },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.skill}</span>
                    <span className="font-medium">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-purple to-brand-turquoise rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-3">Last 12 Weeks</p>
            <div className="space-y-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIdx) => (
                <div key={day} className="flex items-center gap-1">
                  <span className="text-xs text-slate-400 w-8">{day}</span>
                  <div className="flex gap-0.5">
                    {heatmapData[dayIdx].map((level, weekIdx) => (
                      <div
                        key={weekIdx}
                        className={cn(
                          "h-3 w-3 rounded-sm",
                          level === 0 && "bg-slate-100",
                          level === 1 && "bg-brand-turquoise/30",
                          level === 2 && "bg-brand-turquoise/60",
                          level === 3 && "bg-brand-turquoise"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              Less <div className="h-3 w-3 bg-slate-100 rounded-sm" />
              <div className="h-3 w-3 bg-brand-turquoise/30 rounded-sm" />
              <div className="h-3 w-3 bg-brand-turquoise/60 rounded-sm" />
              <div className="h-3 w-3 bg-brand-turquoise rounded-sm" /> More
            </div>
          </CardContent>
        </Card>

        {/* Mode-wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Mode-wise Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {modePerformance.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.mode}</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Invested */}
        <Card>
          <CardHeader>
            <CardTitle>Time Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-brand-purple" />
                <div>
                  <p className="font-semibold">45 hours 32 minutes</p>
                  <p className="text-sm text-slate-500">Total time</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-2xl font-bold text-brand-turquoise">1.2h</p>
                  <p className="text-sm text-slate-500">Avg per day</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-purple">3h 15m</p>
                  <p className="text-sm text-slate-500">Longest session</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 pt-2">
                <span className="font-medium">Most active day:</span> Friday (6.5 hours)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <Button variant="outline"><BarChart2 className="h-4 w-4 mr-2" /> Download Full Report</Button>
        <Button variant="outline"><Share2 className="h-4 w-4 mr-2" /> Share Statistics</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
