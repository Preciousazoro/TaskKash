"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Trash2, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle,
  History,
  Archive,
  Loader2
} from "lucide-react";
import { toast } from 'react-toastify';
import { confirmToast } from '../../../../components/admin-dashboard/confirmToast';
import AdminHeader from "../../../../components/admin-dashboard/AdminHeader";
import AdminSidebar from "../../../../components/admin-dashboard/AdminSidebar";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { AdminContentOnlySkeleton } from "@/components/ui/LoadingSkeleton";

interface ArchivedTask {
  _id: string;
  title: string;
  description: string;
  category: 'social' | 'content' | 'commerce';
  rewardPoints: number;
  validationType: string;
  instructions: string;
  taskLink: string;
  alternateUrl: string;
  deadline: string | null;
  originalStatus: 'active' | 'expired' | 'disabled';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  originalCreatedAt: string;
  originalUpdatedAt: string;
  archiveReason: 'expired' | 'deleted' | 'disabled';
  archivedAt: string;
  retentionDays: number;
  deleteAfter: string;
  archivedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  archiveNotes?: string;
  daysUntilDeletion: number;
  isExpired: boolean;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const TaskHistory = () => {
  /* ------------------ HELPER FUNCTIONS ------------------ */
  const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  /* ------------------ STATE ------------------ */
  const [tasks, setTasks] = useState<ArchivedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [reasonFilter, setReasonFilter] = useState('all');
  const [retentionFilter, setRetentionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Modal states
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [extendNotes, setExtendNotes] = useState('');

  /* ------------------ API FUNCTIONS ------------------ */
  const fetchTasks = async (filters?: {
    reason?: string;
    retention?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.reason && filters.reason !== 'all') params.append('reason', filters.reason);
      if (filters?.retention && filters.retention !== 'all') params.append('retention', filters.retention);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const url = params.toString() ? `/api/admin/tasks/history?${params.toString()}` : '/api/admin/tasks/history';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch archived tasks');
      }
      const data = await response.json();
      setTasks(data.tasks || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error('Error fetching archived tasks:', error);
      toast.error('Failed to load archived tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks({ page: currentPage, limit: itemsPerPage });
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTasks({
        reason: reasonFilter,
        retention: retentionFilter,
        search: searchQuery,
        page: 1,
        limit: itemsPerPage
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [reasonFilter, retentionFilter, searchQuery, itemsPerPage]);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTasks({
      reason: reasonFilter,
      retention: retentionFilter,
      search: searchQuery,
      page: newPage,
      limit: itemsPerPage
    });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  /* ------------------ HANDLERS ------------------ */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(tasks.map(task => task._id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleExtendRetention = async () => {
    if (selectedTasks.length === 0) {
      toast.error('Please select tasks to extend retention');
      return;
    }

    setIsActionLoading(true);
    try {
      const response = await fetch('/api/admin/tasks/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'extend_retention',
          taskIds: selectedTasks,
          additionalDays: extendDays,
          notes: extendNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extend retention');
      }

      const data = await response.json();
      toast.success(`Extended retention for ${data.successful} tasks`);
      setSelectedTasks([]);
      setShowExtendModal(false);
      setExtendDays(30);
      setExtendNotes('');
      
      // Refresh tasks
      fetchTasks({
        reason: reasonFilter,
        retention: retentionFilter,
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to extend retention');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (selectedTasks.length === 0) {
      toast.error('Please select tasks to delete permanently');
      return;
    }

    await confirmToast({
      title: 'Permanent Delete',
      message: `Are you sure you want to permanently delete ${selectedTasks.length} archived task(s)? This action cannot be undone and will remove all historical data.`,
      confirmText: 'Delete Permanently',
      cancelText: 'Cancel',
      confirmButtonVariant: 'destructive',
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          const response = await fetch('/api/admin/tasks/history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'delete_permanently',
              taskIds: selectedTasks
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to delete tasks permanently');
          }

          const data = await response.json();
          toast.success(`Permanently deleted ${data.deletedCount} tasks`);
          setSelectedTasks([]);
          
          // Refresh tasks
          fetchTasks({
            reason: reasonFilter,
            retention: retentionFilter,
            search: searchQuery,
            page: currentPage,
            limit: itemsPerPage
          });
        } catch (error: any) {
          toast.error(error.message || 'Failed to delete tasks');
        } finally {
          setIsActionLoading(false);
        }
      }
    });
  };

  const getArchiveReasonBadge = (reason: string) => {
    switch (reason) {
      case 'expired':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'disabled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getRetentionStatus = (task: ArchivedTask) => {
    if (task.isExpired) {
      return { text: 'Expired', color: 'text-red-600 dark:text-red-400', icon: AlertCircle };
    } else if (task.daysUntilDeletion <= 7) {
      return { text: `${task.daysUntilDeletion} days`, color: 'text-orange-600 dark:text-orange-400', icon: Clock };
    } else {
      return { text: `${task.daysUntilDeletion} days`, color: 'text-green-600 dark:text-green-400', icon: CheckCircle };
    }
  };

  /* ------------------ RENDER ------------------ */
  if (isLoading) {
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
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Task History</h2>
                <span className="text-sm text-muted-foreground">
                  {pagination?.totalTasks || 0} archived tasks
                </span>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Archive Reason Filter */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Archive Reason</label>
                  <Select value={reasonFilter} onValueChange={setReasonFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Reasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reasons</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Retention Period Filter */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Retention Period</label>
                  <Select value={retentionFilter} onValueChange={setRetentionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Periods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="30days">≤ 30 days</SelectItem>
                      <SelectItem value="60days">≤ 60 days</SelectItem>
                      <SelectItem value="90days">≤ 90 days</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Search & Actions Row */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search archived tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex gap-2 items-center">
                  <Button 
                    onClick={() => setShowExtendModal(true)}
                    disabled={selectedTasks.length === 0 || isActionLoading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Extend Retention
                  </Button>
                  <Button 
                    onClick={handlePermanentDelete}
                    disabled={selectedTasks.length === 0 || isActionLoading}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Permanently
                  </Button>
                </div>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <Checkbox
                          checked={selectedTasks.length === tasks.length && tasks.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Reward</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Archive Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Archived Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Retention</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((task) => {
                      const retentionStatus = getRetentionStatus(task);
                      const StatusIcon = retentionStatus.icon;
                      
                      return (
                        <tr key={task._id} className="border-t hover:bg-muted/40">
                          <td className="px-6 py-4">
                            <Checkbox
                              checked={selectedTasks.includes(task._id)}
                              onCheckedChange={(checked) => handleSelectTask(task._id, checked as boolean)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="font-medium truncate">{task.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Created {formatDistanceToNow(new Date(task.originalCreatedAt))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{task.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{task.rewardPoints} TP</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getArchiveReasonBadge(task.archiveReason)}`}>
                              {task.archiveReason}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(task.archivedAt))}
                            </div>
                            {task.archivedBy && (
                              <div className="text-xs text-muted-foreground">
                                by {task.archivedBy.name || task.archivedBy.email}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{task.retentionDays} days</div>
                            <div className="text-xs text-muted-foreground">
                              until {new Date(task.deleteAfter).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center gap-2 ${retentionStatus.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{retentionStatus.text}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalTasks)} of {pagination.totalTasks} tasks</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">Show:</label>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}>
                        <SelectTrigger className="w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === pagination.currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Extend Retention Modal */}
            {showExtendModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-card p-8 rounded-2xl w-full max-w-md space-y-6 text-foreground border border-border">
                  <h3 className="text-xl font-bold">Extend Retention Period</h3>
                  <p className="text-muted-foreground">
                    Extend retention for {selectedTasks.length} selected task(s)
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Days</label>
                    <Select value={extendDays.toString()} onValueChange={(value) => setExtendDays(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                    <textarea
                      className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Reason for extending retention..."
                      value={extendNotes}
                      onChange={(e) => setExtendNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleExtendRetention}
                      disabled={isActionLoading}
                      className="flex-1"
                    >
                      {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Extend Retention
                    </Button>
                    <Button
                      onClick={() => {
                        setShowExtendModal(false);
                        setExtendDays(30);
                        setExtendNotes('');
                      }}
                      variant="outline"
                      disabled={isActionLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskHistory;
