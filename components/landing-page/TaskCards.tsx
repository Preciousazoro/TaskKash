"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, ExternalLink, Users, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { TaskDocument } from "@/types/shared-task";

export default function TaskCards() {
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setVisibleCount(mobile ? 10 : 20);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleTasks = tasks.slice(0, visibleCount);
  const hasMoreTasks = tasks.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + (isMobile ? 10 : 20));
  };

  const truncateText = (html: string, maxLength: number = 80): string => {
    const plainText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.slice(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1500px] px-4 lg:px-8 py-16 lg:py-24 w-full">
        <div className="mb-8">
          <h2 className="text-3xl md:text-3xl font-black uppercase tracking-tighter mb-2">
            Available Tasks
          </h2>
          <p className="text-muted-foreground font-semibold max-w-lg text-base md:text-lg">
            Start earning Task Points (TP) by completing active tasks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/60 p-5 flex flex-col h-[230px]">
              {/* Header skeleton */}
              <div className="flex items-start justify-between gap-3 shrink-0 mb-3">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
                  <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                </div>
              </div>

              {/* Description skeleton */}
              <div className="flex-1 mb-3 space-y-2">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
              </div>

              {/* Meta row skeleton */}
              <div className="flex justify-between items-center gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-12 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border shrink-0 mt-auto">
                <div className="h-7 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-24 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (tasks.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 lg:px-8 py-16 lg:py-0 w-full">
      {/* Header */}
      <div className="mb-8">
        
        <h2 className="text-3xl md:text-3xl font-black uppercase tracking-tighter mb-2">
          Available Tasks
        </h2>
        
        <p className="text-muted-foreground font-semibold max-w-lg text-base md:text-lg">
          Start earning Task Points (TP) by completing active tasks. Complete tasks, earn rewards, and convert to SOL.
        </p>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {visibleTasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative cursor-pointer rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_10px_40px_-12px_rgba(16,185,129,0.35)] overflow-hidden flex flex-col h-[230px]"
          >
            {/* Top accent line — visible on hover */}
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-emerald-500 to-emerald-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 shrink-0 mb-3">
              <div className="flex-1 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {task.category}
                </span>
                <h3 className="text-base font-black uppercase tracking-tighter leading-snug">
                  {task.title.length > 20
                    ? `${task.title.slice(0, 20)}...`
                    : task.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-3">
              {truncateText(task.description, 90)}
            </p>

            {/* Meta row */}
            <div className="flex justify-between items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
              <div className="flex items-center gap-3">
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
                {task.maxParticipants && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Max: {task.maxParticipants}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border shrink-0 mt-auto">
              {/* Reward badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5">
                <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-xs font-black uppercase tracking-widest text-yellow-500">
                  {task.rewardPoints} TP
                </span>
              </div>

              {/* Start Task Button */}
              <Link
                href="/auth/login"
                className="h-8 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
              >
                Start Task
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button & CTA Section - Flexed on big screens */}
      <div className="mt-10 flex flex-row md:flex-row items-center justify-center gap-4">
        {hasMoreTasks && (
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold tracking-widest transition-all hover:scale-105"
          >
            More Tasks
          </button>
        )}

        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold tracking-widest transition-all hover:scale-105"
        >
          Start Earning
        </Link>
      </div>

      {/* Footer rule */}
      <div className="mt-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">
          More tasks added daily
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
}
