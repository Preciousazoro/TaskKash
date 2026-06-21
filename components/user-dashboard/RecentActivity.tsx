'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Info,
  Loader2,
  Activity,
  RefreshCw,
} from 'lucide-react';

interface ActivityItem {
  _id: string;
  type: string;
  status: string;
  title: string;
  description?: string;
  rewardPoints?: number;
  taskDetails?: {
    title?: string;
    rewardPoints?: number;
    category?: string;
  };
  metadata?: {
    taskTitle?: string;
    taskCategory?: string;
    rejectionReason?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

interface ActivitiesResponse {
  activities: ActivityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function RecentActivity() {
  const limit =15;
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/activities?page=1&limit=${limit}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Please login to view your activities');
          } else if (response.status === 404) {
            setError('No activities found');
          } else {
            setError('Failed to load activities');
          }
          return;
        }
        
        const data: ActivitiesResponse = await response.json();
        // Filter out user_deleted activities
        const filteredActivities = data.activities.filter(activity => activity.type !== 'user_deleted');
        setActivities(filteredActivities);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="pt-10 border-t border-border relative">
        <div className="flex justify-between mb-5 gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Your Latest Task Activities
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
            <RefreshCw className="w-3 h-3 animate-spin text-primary" />
            <span className="hidden sm:inline">Loading...</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <div className="min-w-[600px] w-full">
              <div className="flex justify-between items-center bg-muted/50 border-b border-border px-6 py-4">
                <div className="flex-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Task
                </div>
                <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Category
                </div>
                <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Status
                </div>
                <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Reward
                </div>
                <div className="flex-1 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Time
                </div>
              </div>

              <div className="divide-y divide-border/50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-6 py-4 animate-pulse"
                  >
                    <div className="flex-1 h-4 bg-muted rounded w-32"></div>
                    <div className="flex-1 h-4 bg-muted rounded w-16 ml-auto"></div>
                    <div className="flex-1 h-4 bg-muted rounded w-16 ml-auto"></div>
                    <div className="flex-1 h-4 bg-muted rounded w-12 ml-auto"></div>
                    <div className="flex-1 h-4 bg-muted rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="pt-10 border-t border-border relative">
        <div className="flex justify-between mb-5 gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Your Latest Task Activities
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <section className="pt-10 border-t border-border relative">
        <div className="flex justify-between mb-5 gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Your Latest Task Activities
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <Activity className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">No Recent Activity</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Start completing tasks to see your activity here! Your task submissions, approvals, and rewards will appear in this section.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/user-dashboard/overall-tasks'}
              className="w-full lg:w-auto px-10 py-3 bg-primary cursor-pointer text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Browse Tasks
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-5 border-t border-border relative">
      {/* Header Section */}
      <div className="flex justify-between mb-5 gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Recent Activity
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Your Latest Task Activities
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
          <RefreshCw className="w-3 h-3 text-primary" />
          <span className="hidden sm:inline">Last Update:</span>{" "}
          {formattedTime}
        </div>
      </div>

      {/* Activity Data Container */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[600px] w-full">
            {/* Header Row */}
            <div className="flex justify-between items-center bg-muted/50 border-b border-border px-6 py-4">
              <div className="flex-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Task
              </div>
              <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Category
              </div>
              <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Status
              </div>
              <div className="flex-1 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Reward
              </div>
              <div className="flex-1 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Time
              </div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-border/50">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors flex-nowrap"
                >
                  {/* Task */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 bg-primary/10 rounded-full overflow-hidden flex items-center justify-center border border-primary/20">
                        <img
                          src="https://i.postimg.cc/59XZ1skK/LOGO.jpg"
                          alt="Activity"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="truncate">
                      <div className="font-black text-sm uppercase tracking-tighter leading-none">
                        {activity.taskDetails?.title || activity.title || activity.metadata?.taskTitle || 'Activity'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium truncate">
                        {activity.type}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex-1 text-right">
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                      {activity.taskDetails?.category || activity.metadata?.taskCategory || '-'}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(activity.status)}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${getStatusBadge(activity.status)}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="flex-1 text-right">
                    <div className="font-bold text-sm tracking-tight">
                      {activity.taskDetails?.rewardPoints || activity.rewardPoints ? (
                        <span className="text-green-500">
                          +{activity.taskDetails?.rewardPoints || activity.rewardPoints} TP
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex-1 text-center">
                    <div className="text-[10px] text-muted-foreground font-medium">
                      {formatDistanceToNow(
                        new Date(activity.updatedAt || activity.createdAt),
                        { addSuffix: true }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
