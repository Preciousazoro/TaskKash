"use client";

import { useState, useEffect, useRef } from "react";
import { Link as LinkIcon, ExternalLink, Trophy, CheckCircle2, ListTodo, Loader2, ChevronLeft, ChevronRight, Wallet, Upload, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TaskDocument, TaskCard, transformTaskToCard } from "@/types/shared-task";
import { Task } from "@/lib/taskState";
import { TaskCard as TaskCardComponent } from "@/components/tasks/TaskCard";
import { TaskPreviewModal } from "@/components/tasks/TaskPreviewModal";
import { RecentActivity } from "@/components/user-dashboard/RecentActivity";
import { ContentOnlySkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils";

// Directly import the Sidebar and Header here
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

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
  const pageSize = 9;
  const router = useRouter();
  const isNavigating = useRef(false);

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

  const filteredAndSortedTasks = getFilteredAndSortedTasks();
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
    return (
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Sidebar */}
        <UserSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <UserHeader />

          {/* Content Skeleton */}
          <ContentOnlySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 1. Sidebar */}
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 2. Header */}
        <UserHeader />

        {/* 3. Page Content */}
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
                href="#"
                className="hidden md:block bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full md:w-auto text-center"
              >
                View Achievements
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
                    {taskPoints.toLocaleString()} TP
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
                    {tasksCompleted}
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
                    {totalWithdrawn.toLocaleString()} TP
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
                    {activeTasksCount}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Active Tasks
                </p>
              </Link>
            </section>




<section className="space-y-6 py-5">

  {/* Tasks Section Header */}
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-black uppercase tracking-tighter leading-none">
      Pending Tasks
    </h2>
    {filteredAndSortedTasks.length > 0 && (
      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
        {filteredAndSortedTasks.length} tasks found
      </span>
    )}
  </div>

  {/* Filter Tabs */}
  <div className="flex gap-2 p-1 bg-muted/50 rounded-lg overflow-x-auto w-full sm:w-fit">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => handleTabChange(tab)}
        className={`px-4 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
          activeTab === tab
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Task Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {paginatedTasks.length > 0 ? (
      paginatedTasks.map((task) => (
        <TaskCardComponent
          key={task._id}
          task={task}
          onClick={handleTaskClick}
          onStartTask={handleStartTask}
        />
      ))
    ) : (
      <div className="col-span-full text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tighter mb-2">
            {activeTab === 'All' ? 'No tasks available yet' : `No ${activeTab.toLowerCase()} tasks`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeTab === 'All'
              ? 'Check back later! New tasks are added regularly by administrators.'
              : `You don't have any ${activeTab.toLowerCase()} tasks.`}
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-3 rounded-lg border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Prev
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9  rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
              currentPage === page
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-3 rounded-lg border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )}

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