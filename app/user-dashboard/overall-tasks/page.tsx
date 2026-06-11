"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { Trophy, Clock, ChevronRight, ListTodo, CheckCircle2, XCircle, AlertCircle, Loader2, Filter } from "lucide-react";
import { TaskDocument, TaskCard, transformTaskToCard } from "@/types/shared-task";
import { Task, TaskStateManager } from "@/lib/taskState";
import { TaskCard as TaskCardComponent } from "@/components/tasks/TaskCard";
import { TaskPreviewModal } from "@/components/tasks/TaskPreviewModal";
import { Button } from "@/components/ui/button";
import OverallTasksSkeleton from "@/components/LoadingSkeleton/OverallTasksSkeleton";

// Directly import the Sidebar and Header here
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

interface Stats {
  totalTasks: number;
  totalExpiredTasks: number;
  totalPending: number;
  totalApproved: number;
}

export default function OverallTasksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    totalExpiredTasks: 0,
    totalPending: 0,
    totalApproved: 0
  });
  const [selectedTask, setSelectedTask] = useState<TaskDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Approved' | 'Rejected' | 'Expired' | 'Pending' | 'TaskStarted'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const isNavigating = useRef(false);
  const pageSize = 20;

  // Fetch all tasks with user status
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks/overall');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks || []);
        setStats(data.stats || {
          totalTasks: 0,
          totalExpiredTasks: 0,
          totalPending: 0,
          totalApproved: 0
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (task: TaskDocument) => {
    if (isNavigating.current) return;
    
    isNavigating.current = true;
    setSelectedTask(task);
    setIsModalOpen(true);
    
    setTimeout(() => {
      isNavigating.current = false;
    }, 300);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    switch (activeFilter) {
      case 'Pending':
        filtered = tasks.filter(task => task.userTaskStatus === 'pending');
        break;
      case 'Approved':
        filtered = tasks.filter(task => task.userTaskStatus === 'approved');
        break;
      case 'Rejected':
        filtered = tasks.filter(task => task.userTaskStatus === 'rejected');
        break;
      case 'Expired':
        filtered = tasks.filter(task => task.status === 'expired');
        break;
      case 'Active':
        filtered = tasks.filter(task => task.status === 'active');
        break;
      case 'TaskStarted':
        filtered = tasks.filter(task => task.userTaskStatus === 'available' && TaskStateManager.isTaskStarted(task._id));
        break;
      default:
        filtered = tasks;
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  // Reset page when filter changes
  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filters: Array<typeof activeFilter> = ['All', 'Pending', 'Approved', 'Rejected', 'Expired', 'Active', 'TaskStarted'];

  if (isLoading) {
    return <OverallTasksSkeleton />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <UserHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Page Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                Overall Tasks
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                View all available tasks and track your submissions
              </p>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="#"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <ListTodo className="w-5 h-5 text-primary" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {stats.totalTasks}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Total Tasks
                </p>
              </Link>

              <Link
                href="#"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                    <Clock className="w-5 h-5 text-red-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {stats.totalExpiredTasks}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Expired Tasks
                </p>
              </Link>

              <Link
                href="#"
                className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                    {stats.totalPending}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Pending
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
                    {stats.totalApproved}
                  </p>
                )}
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Approved
                </p>
              </Link>
            </section>




            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>




            {/* Tasks Grid */}
            {paginatedTasks.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedTasks.map((task) => (
                    <TaskCardComponent
                      key={task._id}
                      task={task}
                      onClick={handleTaskClick}
                      onStartTask={handleTaskClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card border border-border rounded-2xl py-25 px-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-sm font-bold text-foreground mb-2">No Tasks Found</h3>
                <p className="text-muted-foreground">
                  {activeFilter === 'All' 
                    ? 'There are no tasks available at the moment.'
                    : `No ${activeFilter.toLowerCase()} tasks found.`}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Preview Modal */}
      {selectedTask && (
        <TaskPreviewModal
          task={selectedTask as any}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
