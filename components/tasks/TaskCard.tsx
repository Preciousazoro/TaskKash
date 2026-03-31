"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, ExternalLink, Eye, Play, Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { TaskDocument } from "@/types/shared-task";
import { TaskStateManager } from "@/lib/taskState";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface TaskCardProps {
  task: TaskDocument;
  onClick: (task: TaskDocument) => void;
  onStartTask: (task: TaskDocument) => void;
}

// Helper function to truncate HTML content and strip tags
const truncateText = (html: string, maxLength: number = 120): string => {
  // Remove HTML tags
  const plainText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.slice(0, maxLength) + '...';
};

export function TaskCard({
  task,
  onClick,
  onStartTask,
}: TaskCardProps) {
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();
  const isClicking = useRef(false);
  const isPending = task.userTaskStatus === 'pending';
  const isApproved = task.userTaskStatus === 'approved';
  const isRejected = task.userTaskStatus === 'rejected';
  const isAvailable = task.userTaskStatus === 'available';
  const isStarted = TaskStateManager.isTaskStarted(task._id) && !isPending && !isApproved && !isRejected;
  const categoryStyles = {
    social: "from-pink-500/40 to-purple-500/40",
    content: "from-blue-500/40 to-cyan-500/40",
    commerce: "from-emerald-500/40 to-green-500/40",
  };

  const handleStartTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isStarting || isClicking.current) return;
    
    // Check if task is already started
    if (TaskStateManager.isTaskStarted(task._id)) {
      toast.info("Task already started!");
      return;
    }
    
    isClicking.current = true;
    setIsStarting(true);
    
    try {
      // Call API to start task
      const response = await fetch('/api/tasks/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: task._id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start task');
      }
      
      // Mark task as started in local state
      TaskStateManager.updateTaskState(task._id, 'started');
      
      // Show success toast
      toast.success("Task started! Complete it and submit your proof.", {
        autoClose: 3000,
      });
      
      // Call parent handler if provided
      if (onStartTask) {
        onStartTask(task);
      }
      
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error("Failed to start task. Please try again.");
    } finally {
      setIsStarting(false);
      isClicking.current = false;
    }
  };

  const handleViewTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isClicking.current) return;
    
    isClicking.current = true;
    onClick(task);
    
    // Reset the clicking flag after a short delay
    setTimeout(() => {
      isClicking.current = false;
    }, 300);
  };

  const handleCardClick = () => {
    if (isClicking.current || isPending || isApproved) return;
    
    isClicking.current = true;
    onClick(task);
    
    // Reset the clicking flag after a short delay
    setTimeout(() => {
      isClicking.current = false;
    }, 300);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-[280px] ${
        isPending || isApproved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Accent gradient strip */}
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b ${
          categoryStyles[task.category]
        }`}
      />

      <div className="relative p-6 space-y-4 flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1 flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {task.category}
            </span>
            <h3 className="text-lg font-bold leading-snug line-clamp-2">
              {task.title}
            </h3>
          </div>

          <StatusBadge status={task.userTaskStatus || 'available'} />
        </div>

        {/* Preview Content - Truncated */}
        <div className="flex-1 space-y-3">
          {/* Short Description Preview */}
          <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {truncateText(task.description, 150)}
          </div>

          {/* Quick Info */}
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {/* URL Indicator */}
            {(task.taskLink || task.alternateUrl) && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                <span>Task URL</span>
              </div>
            )}
            
            {/* Deadline */}
            {task.deadline && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed with Actions */}
        <div className="flex items-center justify-between gap-4 pt-2 shrink-0">
          {/* Reward */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <Trophy className="h-3 w-3" />
            {task.rewardPoints} TP
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {/* View Button - Always visible for available tasks */}
            {isAvailable && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewTask}
                className="font-semibold h-8 px-3"
              >
                View
              </Button>
            )}

            {/* Start Button - Always visible for available tasks */}
            {isAvailable && (
              <Button
                size="sm"
                onClick={handleStartTask}
                disabled={isStarting}
                className="font-semibold h-8 px-3 bg-linear-to-r from-green-500 to-purple-600 hover:from-green-600 hover:to-purple-700"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    Start Task
                  </>
                )}
              </Button>
            )}

            {/* Resubmit Button - Only for rejected tasks that are started */}
            {isRejected && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewTask}
                className="font-semibold h-8 px-3"
              >
                View
              </Button>
            )}

            {/* Status indicators for pending/approved tasks */}
            {isPending && (
              <div className="flex items-center text-xs text-muted-foreground font-medium px-2">
                Pending
              </div>
            )}

            {isApproved && (
              <div className="flex items-center text-xs text-green-600 font-medium px-2">
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
