"use client";

import { useState, useEffect, useRef } from "react";
import { Link as LinkIcon, ExternalLink, CheckCircle, Coins, Trophy, CheckCircle2, Flame, ListTodo, Loader2, ChevronLeft, ChevronRight, Wallet, Upload, ShieldCheck, Folder, Share2, FileText, Users, Music, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TaskDocument, TaskCard, transformTaskToCard } from "@/types/shared-task";
import { Task } from "@/lib/taskState";
import { TaskCard as TaskCardComponent } from "@/components/tasks/TaskCard";
import { TaskPreviewModal } from "@/components/tasks/TaskPreviewModal";
import { RecentActivity } from "@/components/user-dashboard/RecentActivity";
import DashboardSkeleton from "@/components/LoadingSkeleton/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils";

// Directly import the Sidebar and Header here
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import ProfileCompletionTracker from "@/components/user-dashboard/ProfileCompletionTracker";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskPoints, setTaskPoints] = useState<number>(0);
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
  const [activeTasksCount, setActiveTasksCount] = useState<number>(0);
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState<string>("");
  const [featuredTasks, setFeaturedTasks] = useState<TaskDocument[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const pageSize = 6;
  const router = useRouter();
  const isNavigating = useRef(false);

  const formatPoints = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1).replace(".0", "")}M`;
    }

    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1).replace(".0", "")}K`;
    }

    return num.toString();
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;
    const visibleChars = Math.min(5, localPart.length);
    const maskedPart = localPart.slice(0, visibleChars) + "********";
    return `${maskedPart}@${domain}`;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile for name
        const profileResponse = await fetch('/api/user/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserName(profileData.name || "");
        }

        // Try the new balance API first
        let response = await fetch('/api/user/balance');
        let data;
        
        if (!response.ok) {
          // If new API fails, fall back to the original approve API
          console.log('Falling back to original API');
          response = await fetch('/api/tasks/approve');
        }
        
        if (response.ok) {
          data = await response.json();
          setTaskPoints(data.taskPoints || 0); // Fallback to 0 if undefined
          setTasksCompleted(data.tasksCompleted || 0);
        } else {
          // If both APIs fail, set default values
          console.warn('API calls failed, using default values');
          setTaskPoints(0);
          setTasksCompleted(0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set default values on error
        setTaskPoints(0);
        setTasksCompleted(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Set up periodic updates
    const interval = setInterval(fetchUserData, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Fetch active tasks with user status
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks/user-dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Fetch user stats (withdrawals and active tasks)
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setTotalWithdrawn(data.totalWithdrawn || 0);
          setActiveTasksCount(data.activeTasksCount || 0);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setTotalWithdrawn(0);
        setActiveTasksCount(0);
      }
    };

    fetchUserStats();
  }, []);

  // Fetch featured tasks (random pending tasks)
  useEffect(() => {
    const fetchFeaturedTasks = async () => {
      try {
        const response = await fetch('/api/tasks/featured');
        if (response.ok) {
          const data = await response.json();
          setFeaturedTasks(data.tasks || []);
        }
      } catch (error) {
        console.error('Error fetching featured tasks:', error);
        setFeaturedTasks([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedTasks();
  }, []);

  const handleTaskClick = (task: TaskDocument) => {
    // Prevent multiple rapid clicks
    if (isNavigating.current) return;
    
    isNavigating.current = true;
    setSelectedTask(task);
    setIsModalOpen(true);
    
    // Reset navigation guard after a short delay
    setTimeout(() => {
      isNavigating.current = false;
    }, 300);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleStartTask = (task: TaskDocument) => {
    // Start task is now handled directly in TaskCard component
    // This handler is kept for compatibility but can be removed if not needed
  };

  const handleSubmitProof = (task: TaskDocument) => {
    // Submit proof is now handled directly in TaskPreviewModal
    // This handler is kept for compatibility but can be removed if not needed
    handleTaskClick(task);
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    let filtered = tasks;

    // Filter by active tab
    if (activeTab !== 'All') {
      filtered = tasks.filter(task => task.userTaskStatus === activeTab.toLowerCase());
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      if (activeTab === 'All') {
        // In All tab: available/rejected first, then pending, then approved last
        const getSortPriority = (status: string | undefined) => {
          if (!status) return 3;
          if (status === 'available' || status === 'rejected') return 0;
          if (status === 'pending') return 1;
          if (status === 'approved') return 2;
          return 3;
        };
        
        const priorityA = getSortPriority(a.userTaskStatus);
        const priorityB = getSortPriority(b.userTaskStatus);
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // If same priority, sort by creation date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        // In other tabs: sort by latest submission date, fallback to task creation date
        const dateA = a.latestSubmission?.submittedAt ? new Date(a.latestSubmission.submittedAt).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.latestSubmission?.submittedAt ? new Date(b.latestSubmission.submittedAt).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      }
    });

    return sorted;
  };

  const filteredAndSortedTasks = getFilteredAndSortedTasks().slice(0, 18);
  const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredAndSortedTasks.slice(startIndex, startIndex + pageSize);

  // Reset page when tab changes
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const tabs: Array<typeof activeTab> = ['All', 'Pending', 'Approved', 'Rejected'];

  if (isLoading || tasksLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 1. Sidebar */}
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 2. Header */}
        <UserHeader />



        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Welcome & Investment Snapshot */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-2xl font-black uppercase tracking-tighter  leading-none">
                  {isLoading ? (
                    <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
                  ) : (
                    getGreeting(userName || "User")
                  )}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3 text-primary" /> Task
                    Kash: Your account is currently protected
                  </span>
                </div>
              </div>
              <Link
                href="/user-dashboard/gift-user"
                className="hidden md:block bg-green-500 text-white px-3 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full md:w-auto text-center"
              >
                Gift a Member
              </Link>
            </section>




            {/* Quick Stats Summary */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="#"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {formatPoints(taskPoints)} TP
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Total Earned
                </p>
              </Link>

              <Link
                href="#"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {formatPoints(tasksCompleted)}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Tasks Done
                </p>
              </Link>

              <Link
                href="/user-dashboard/withdrawals"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Wallet className="w-5 h-5 text-blue-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {formatPoints(totalWithdrawn)} TP
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Withdrawals
                </p>
              </Link>

              <Link
                href="/user-dashboard/tasks"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Upload className="w-5 h-5 text-purple-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {formatPoints(activeTasksCount)}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Active Tasks
                </p>
              </Link>
            </section>

 
            {/* Profile Completion Tracker */}
            <div className="block lg:hidden w-full">
              <ProfileCompletionTracker />
            </div>



{/* Featured Tasks */}
<section className="mb-14">
    <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Featured Tasks</h2>
        <div className="h-[1px] flex-1 bg-border ml-4"></div>
    </div>

    <div className="flex gap-5 overflow-x-auto pb-3 no-scrollbar">
        {featuredLoading ? (
            <div className="flex gap-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[300px] bg-card border border-border px-6 py-2 rounded-2xl animate-pulse">
                        <div className="h-4 w-20 bg-muted rounded mb-4"></div>
                        <div className="h-6 w-40 bg-muted rounded mb-4"></div>
                        <div className="h-5 w-16 bg-muted rounded"></div>
                    </div>
                ))}
            </div>
        ) : featuredTasks.length > 0 ? (
            featuredTasks.slice(0, 20).map((task) => {
                const categoryColors: Record<string, { from: string; to: string; border: string; text: string; bg: string; hover: string }> = {
                    social: { from: 'from-blue-500/10', to: 'to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400', bg: 'bg-blue-500/10', hover: 'hover:bg-blue-500' },
                    content: { from: 'from-purple-500/10', to: 'to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400', bg: 'bg-purple-500/10', hover: 'hover:bg-purple-500' },
                    community: { from: 'from-green-500/10', to: 'to-green-600/5', border: 'border-green-500/20', text: 'text-green-400', bg: 'bg-green-500/10', hover: 'hover:bg-green-500' },
                    music: { from: 'from-pink-500/10', to: 'to-pink-600/5', border: 'border-pink-500/20', text: 'text-pink-400', bg: 'bg-pink-500/10', hover: 'hover:bg-pink-500' },
                };
                
                const colors = categoryColors[task.category] || categoryColors.social;
                const isHot = Math.random() > 0.5;

                return (
                    <div 
                        key={task._id}
                        onClick={() => handleTaskClick(task)}
                        className={`min-w-[300px] bg-gradient-to-br ${colors.from} ${colors.to} border ${colors.border} p-6 rounded-2xl relative overflow-hidden group transition-all shadow-md hover:border-current cursor-pointer`}
                    >
                        {isHot && (
                            <div className={`absolute top-4 right-4 ${colors.text.replace('400', '500')} text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10`}>HOT</div>
                        )}
                        <span className={`text-[10px] font-bold ${colors.text} uppercase tracking-widest`}>{task.category}</span>
                        <h3 className="text-lg font-bold mt-2 leading-snug">{task.title.slice(0, 20)}.....</h3>
                        <div className="flex items-center justify-between">
                            <span className={`font-black ${colors.text}`}>{task.rewardPoints} TP</span>
                            <button className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.hover} hover:text-white transition-all flex items-center justify-center`}>
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="w-full text-center py-5">
                <p className="text-muted-foreground text-sm">No active tasks to feature</p>
            </div>
        )}
    </div>
</section>






{/* Task Categories */}
<section>
    <div className="flex items-center gap-2 mb-5">
        <Folder className="w-5 h-5 text-primary" />
        <h2 className="text-xm font-black uppercase tracking-[0.2em]">Task Categories</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Social */}
        <Link href="/user-dashboard/task-category/social" className="relative group cursor-pointer h-full transition-all">
            <div className="relative bg-card border border-border p-6 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <Share2 className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-1">Social Tasks</h3>
                <p className="text-muted-foreground text-sm flex-grow">Engage, follow, repost & interact on social platforms.</p>
                <div className="mt-2 flex items-center text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    VIEW TASKS <ArrowRight className="ml-1 w-4 h-4" />
                </div>
            </div>
        </Link>

        {/* Content */}
        <Link href="/user-dashboard/task-category/content" className="relative group cursor-pointer h-full transition-all">
            <div className="relative bg-card border border-border p-6 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <FileText className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold mb-1">Content Tasks</h3>
                <p className="text-muted-foreground text-sm flex-grow">Create threads, videos, and original content.</p>
                <div className="mt-2 flex items-center text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    VIEW TASKS <ArrowRight className="ml-1 w-4 h-4" />
                </div>
            </div>
        </Link>

        {/* Community */}
        <Link href="/user-dashboard/task-category/community" className="relative group cursor-pointer h-full transition-all">
            <div className="relative bg-card border border-border p-6 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <Users className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold mb-1">Community</h3>
                <p className="text-muted-foreground text-sm flex-grow">Join Discord, Telegram, invite users, and engage.</p>
                <div className="mt-2 flex items-center text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    VIEW TASKS <ArrowRight className="ml-1 w-4 h-4" />
                </div>
            </div>
        </Link>

        {/* Music */}
        <Link href="/user-dashboard/campaign-center" className="relative group cursor-pointer h-full transition-all">
            <div className="relative bg-card border border-border p-6 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <Music className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="text-lg font-bold mb-1">Music Tasks</h3>
                <p className="text-muted-foreground text-sm flex-grow">Listen, stream and earn rewards via partner protocols.</p>
                <div className="mt-4 flex items-center text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    VIEW TASKS <ArrowRight className="ml-1 w-4 h-4" />
                </div>
            </div>
        </Link>
    </div>
</section>





            {/* 4. Recent Activity Section */}
            <RecentActivity />
          </div>
        </main>
      </div>

      {/* Task Preview Modal */}
      <TaskPreviewModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}