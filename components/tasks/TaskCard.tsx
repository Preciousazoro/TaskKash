"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, ExternalLink, Loader2 } from "lucide-react";
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

const truncateText = (html: string, maxLength: number = 80): string => {
  const plainText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength) + '...';
};

export function TaskCard({ task, onClick, onStartTask }: TaskCardProps) {
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();
  const isClicking = useRef(false);

  const isPending  = task.userTaskStatus === 'pending';
  const isApproved = task.userTaskStatus === 'approved';
  const isRejected = task.userTaskStatus === 'rejected';
  const isAvailable = task.userTaskStatus === 'available';
  const isStarted = TaskStateManager.isTaskStarted(task._id) && !isPending && !isApproved && !isRejected;

  const handleStartTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStarting || isClicking.current) return;
    if (TaskStateManager.isTaskStarted(task._id)) {
      toast.info("Task already started!");
      return;
    }
    isClicking.current = true;
    setIsStarting(true);
    try {
      const response = await fetch('/api/tasks/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task._id }),
      });
      if (!response.ok) throw new Error('Failed to start task');
      TaskStateManager.updateTaskState(task._id, 'started');
      toast.success("Task started! Complete it and submit your proof.", { autoClose: 3000 });
      if (onStartTask) onStartTask(task);
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
    setTimeout(() => { isClicking.current = false; }, 300);
  };

  const handleCardClick = () => {
    if (isClicking.current || isPending || isApproved) return;
    isClicking.current = true;
    onClick(task);
    setTimeout(() => { isClicking.current = false; }, 300);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`relative rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-primary transition-all overflow-hidden flex flex-col h-[230px] ${
        isPending || isApproved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Left border accent — white in dark mode, dark in light mode */}
      {/* <div className="absolute left-0 top-0 h-full w-1 bg-foreground rounded-l-2xl" /> */}

      <div className="relative pl-5 pr-5 pt-5 pb-5 flex flex-col h-full gap-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 shrink-0">
          <div className="flex-1 space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {task.category}
            </span>
            <h3 className="text-base font-black uppercase tracking-tighter leading-snug line-clamp-2">
              {task.title}
            </h3>
          </div>
          <StatusBadge status={task.userTaskStatus || 'available'} />
        </div>

        {/* Description — truncated */}
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {truncateText(task.description, 100)}
        </p>

        {/* Meta row */}
        <div className="flex justify-between items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {(task.taskLink || task.alternateUrl) && (
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Task URL
            </span>
          )}
          {task.deadline && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Due: {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border shrink-0">

          {/* Reward badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5">
            <Trophy className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-black uppercase tracking-widest text-yellow-500">
              {task.rewardPoints} TP
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">

            {isAvailable && (
              <button
                onClick={handleViewTask}
                className="h-8 px-3 rounded-lg border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all"
              >
                View
              </button>
            )}

            {isAvailable && (
              <button
                onClick={handleStartTask}
                disabled={isStarting}
                className="h-8 px-3 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Starting...
                  </>
                ) : (
                  'Start Task'
                )}
              </button>
            )}

            {isRejected && (
              <button
                onClick={handleViewTask}
                className="h-8 px-3 rounded-lg border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all"
              >
                View
              </button>
            )}

            {isPending && (
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
                Pending
              </span>
            )}

            {isApproved && (
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500 px-2">
                Completed
              </span>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
}