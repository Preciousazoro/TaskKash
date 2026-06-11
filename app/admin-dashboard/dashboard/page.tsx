'use client';

import { useEffect, useMemo, useState, useRef, lazy, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { AdminContentOnlySkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Users,
  FileText,
  CheckCircle,
  Plus,
  Loader2,
  UserMinus,
  UserCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Layers,
  Gift,
  Trophy,
  Star,
  XCircle,
  MessageSquare,
  Mail,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";


// Simple chart implementation with proper cleanup
const SimpleChart = ({ data, type }: { data: any; type: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      import("chart.js/auto").then((Chart) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          // Destroy existing chart if it exists
          if (chartRef.current) {
            chartRef.current.destroy();
          }
          // Create new chart
          chartRef.current = new Chart.default(ctx, data);
        }
      });
    }

    // Cleanup function to destroy chart when component unmounts or data changes
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
};

/* ---------------- TYPES ---------------- */
type Task = {
  id: string;
  title: string;
  category: string;
  rewardPoints: number;
  createdAt: string;
};

type DashboardMetrics = {
  stats: Array<{
    label: string;
    value: number;
    icon: string;
    color: string;
    bg: string;
  }>;
  totalUsers: number;
  tasksCompleted: number;
  pendingReviews: number;
  rejectedSubmissions: number;
  totalWithdrawalAmount: string;
  pendingWithdrawalAmount: string;
  totalTaskPoints: number;
  userGrowthLabels: string[];
  userGrowthValues: number[];
  lastUpdated: string;
};

/* ---------------- COMPONENT ---------------- */
const Dashboard = () => {
  const router = useRouter();

  /* ---------- LOCAL DATA ---------- */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  const iconMap: { [key: string]: any } = {
    Users,
    UserCheck,
    UserMinus,
    Layers,
    TrendingUp,
    Clock,
    ArrowDownLeft,
    ArrowUpRight,
    Shield,
    Gift,
    Trophy,
    Star,
    CheckCircle,
    FileText,
    XCircle,
    MessageSquare,
    Mail,
  };

  /* ---------- FETCH METRICS ---------- */
  const fetchMetrics = useCallback(async () => {
    try {
      setMetricsLoading(true);
      setMetricsError(null);

      const response = await fetch('/api/admin/metrics');
      const data = await response.json();

      if (data.success) {
        setMetrics(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch metrics');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetricsError(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Failed to load dashboard metrics');
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  /* ---------- FETCH ACTIVITIES ---------- */
  const fetchActivities = useCallback(async (page: number = 1) => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);

      const response = await fetch(`/api/admin/activities?page=${page}&limit=20`);
      const data = await response.json();

      if (data.activities) {
        setActivities(data.activities);
        setActivitiesTotalPages(data.pagination.totalPages);
        setActivitiesPage(page);
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivitiesError(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Failed to load recent activities');
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    fetchMetrics();
    fetchActivities();
  }, [fetchMetrics, fetchActivities]);

  // Set up polling with optimized intervals
  useEffect(() => {
    // Only set up polling if not already set up
    const metricsInterval = setInterval(() => {
      fetchMetrics();
    }, 60000); // Increased from 30 to 60 seconds

    return () => {
      clearInterval(metricsInterval);
    };
  }, [fetchMetrics]);

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    if (metrics && metrics.stats) {
      return metrics.stats.map((stat) => ({
        ...stat,
        icon: iconMap[stat.icon] || Users
      }));
    }

    // Fallback to empty array if metrics not loaded
    return [];
  }, [metrics]);

  /* ---------- CHARTS ---------- */
  // Charts are now lazy loaded with Suspense, no initialization needed

  /* ---------- UI ---------- */
  if (metricsLoading || activitiesLoading) {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader />

          <AdminContentOnlySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">Dashboard Overview</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <Layers className="w-3 h-3 text-primary" />
                Platform Analytics
              </p>
            </div>
            <button
              onClick={() => router.push('/admin-dashboard/tasks/create')}
              className="hidden md:flex items-center text-base font-semibold gap-1 px-3 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors"
            >
              <Plus size={16} />
              Create Task
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {metricsLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                <div key={item} className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-muted animate-pulse">
                      <div className="w-5 h-5 bg-muted-foreground/20 rounded"></div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                  </div>
                  <div>
                    <div className="h-3 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : metricsError ? (
              <div className="col-span-full">
                <div className="bg-card border rounded-2xl p-5 text-center">
                  <p className="text-red-500 text-sm">Failed to load metrics</p>
                  <button
                    onClick={fetchMetrics}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              stats.map((stat, index) => (
                <div key={index} className="bg-card px-5 py-3 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{stat.value.toLocaleString()}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">{stat.label}</h4>
                  </div>
                </div>
              ))
            )}
          </div>





          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border rounded-2xl p-5 h-[360px] flex flex-col">
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-semibold">User Growth</h3>
                <span className="text-xs text-muted-foreground">
                  Last 6 months
                </span>
              </div>
              <div className="flex-1">
                {metrics ? (
                  <SimpleChart
                    type="line"
                    data={{
                      type: "line",
                      data: {
                        labels: metrics.userGrowthLabels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [
                          {
                            label: "Users",
                            data: metrics.userGrowthValues || [0, 0, 0, 0, 0, 0],
                            borderColor: "#a855f7",
                            backgroundColor: "rgba(168,85,247,.15)",
                            borderWidth: 2,
                            pointRadius: 3,
                            pointHoverRadius: 4,
                            fill: true,
                            tension: 0.35,
                          },
                        ],
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: { color: "#6b7280", font: { size: 11 } },
                          },
                          y: {
                            grid: { color: "rgba(255,255,255,0.05)" },
                            ticks: { color: "#6b7280", font: { size: 11 } },
                            beginAtZero: true,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-5 h-[360px] flex flex-col">
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  Task Completion
                </h3>
                <span className="text-xs text-muted-foreground">
                  Overview
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {metrics ? (
                  <SimpleChart
                    type="doughnut"
                    data={{
                      type: "doughnut",
                      data: {
                        labels: ["Completed", "Pending", "Rejected"],
                        datasets: [
                          {
                            data: [metrics.tasksCompleted, metrics.pendingReviews, metrics.rejectedSubmissions],
                            backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
                            borderWidth: 0,
                          },
                        ],
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "70%",
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              color: "#9ca3af",
                              boxWidth: 10,
                              padding: 12,
                              font: { size: 11 },
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>





          {/* RECENT ACTIVITY */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-foreground font-bold text-sm uppercase tracking-wider">Recent Activity</h2>
                <p className="text-xs text-muted-foreground mt-1">Latest activities across the platform</p>
              </div>
              <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>

            {activitiesLoading ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left table-auto whitespace-nowrap">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Activity</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <tr key={item} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activitiesError ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
                </div>
                <p className="text-red-500 text-sm mb-4">{activitiesError}</p>
                <button
                  onClick={() => fetchActivities(activitiesPage)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-tighter mb-2">
                    No activities yet
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase mb-6">
                    Once activities occur, they will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left table-auto whitespace-nowrap">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Activity</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activities.slice(0, 20).map((activity) => (
                      <tr key={activity._id} className="hover:bg-muted/50 transition-colors">
                        {/* ACTIVITY COLUMN (MAX 20 CHARACTERS) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                {activity.user?.avatarUrl ? (
                                  <img
                                    src={activity.user.avatarUrl}
                                    alt={activity.user.name}
                                    className="w-10 h-10 rounded-lg object-cover border-2 border-background"
                                    onError={(e) => {
                                      e.currentTarget.src = "https://github.com/shadcn.png";
                                    }}
                                  />
                                ) : (
                                  <img
                                    src="https://github.com/shadcn.png"
                                    alt={activity.user?.name || 'User'}
                                    className="w-10 h-10 rounded-lg object-cover border-2 border-background"
                                  />
                                )}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${activity.type === 'task_approved' ? 'bg-green-500' :
                                  activity.type === 'task_rejected' ? 'bg-red-500' :
                                    activity.type === 'task_submitted' ? 'bg-blue-500' :
                                      'bg-gray-500'
                                }`}></div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-card-foreground block whitespace-nowrap">
                                {activity.title && activity.title.length > 20
                                  ? `${activity.title.substring(0, 20)}...`
                                  : activity.title || 'Untitled Activity'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* USER COLUMN */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground font-semibold block whitespace-nowrap">
                            {activity.user?.name || 'Unknown User'}
                          </span>
                        </td>

                        {/* EMAIL COLUMN */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground block whitespace-nowrap">
                            {activity.user?.email || 'No email'}
                          </span>
                        </td>

                        {/* DATE COLUMN */}
                        <td className="px-6 py-4">
                          <span className="text-xs text-muted-foreground font-medium block whitespace-nowrap">
                            {new Date(activity.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </td>

                        {/* STATUS COLUMN */}
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase rounded-full border whitespace-nowrap ${activity.type === 'task_approved'
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                              : activity.type === 'task_rejected'
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                : activity.type === 'task_submitted'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                  : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                            }`}>
                            {activity.type ? activity.type.replace('_', ' ') : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */
const Stat = ({ icon, label, value }: any) => (
  <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
    <div className="p-3 rounded-full bg-primary/20">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <h3 className="text-xl font-semibold">
        {value.toLocaleString()}
      </h3>
    </div>
  </div>
);

const StatSkeleton = ({ label }: { label: string }) => (
  <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
    <div className="p-3 rounded-full bg-primary/20 animate-pulse">
      <Loader2 className="animate-spin" size={20} />
    </div>
    <div className="flex-1">
      <p className="text-sm text-muted-foreground mb-1">
        {label}
      </p>
      <div className="h-6 bg-muted rounded animate-pulse w-16" />
    </div>
  </div>
);

export default Dashboard;
