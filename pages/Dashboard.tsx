import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';
import { OnboardingTour } from '../components/OnboardingTour';
import { Skeleton } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay for dashboard data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Subscriptions",
      value: "+2350",
      description: "+180.1% from last month",
      icon: Users,
    },
    {
      title: "Sales",
      value: "+12,234",
      description: "+19% from last month",
      icon: CreditCard,
    },
    {
      title: "Active Now",
      value: "+573",
      description: "+201 since last hour",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <OnboardingTour />
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-slate-500">Welcome back, {user?.name}!</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <Tooltip content={stat.description} side="bottom">
                    <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-slate-500">
                        {stat.description}
                        </p>
                    </div>
                </Tooltip>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center space-x-4">
                       <Skeleton className="h-9 w-9 rounded-full" />
                       <div className="space-y-2">
                         <Skeleton className="h-4 w-24" />
                         <Skeleton className="h-3 w-32" />
                       </div>
                       <Skeleton className="h-4 w-12 ml-auto" />
                    </div>
                  ))}
               </div>
            ) : (
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-900">U{i}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">User {i}</p>
                      <p className="text-sm text-slate-500">user{i}@example.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$1,999.00</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Operational metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-8" /></div>
                      <Skeleton className="h-2 w-full rounded-full" />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-8" /></div>
                      <Skeleton className="h-2 w-full rounded-full" />
                   </div>
                </div>
             ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">API Latency</span>
                      <span className="font-medium">45ms</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[20%]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Database Load</span>
                      <span className="font-medium">24%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[24%]" />
                    </div>
                  </div>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};