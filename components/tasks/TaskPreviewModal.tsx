"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Clock, Loader2, Trophy, Info } from "lucide-react";
import { TaskDocument } from "@/types/shared-task";
import { StatusBadge } from "./StatusBadge";
import { toast } from "react-toastify";
import { TaskStateManager } from "@/lib/taskState";
import { SafeHTMLRenderer } from "@/components/ui/SafeHTMLRenderer";

interface TaskPreviewModalProps {
  task: TaskDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskPreviewModal({
  task,
  isOpen,
  onClose,
}: TaskPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!task) return null;

  const getCategoryColor = (category: "social" | "content" | "commerce") => {
    switch (category) {
      case "social":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30";
      case "content":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      case "commerce":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const handleStartTask = async () => {
    setIsLoading(true);
    try {
      TaskStateManager.updateTaskState(task._id, "started");
      toast.success("Task started! Complete it and submit your proof.", {
        autoClose: 3000,
      });
      setTimeout(() => {
        window.open(task.taskLink || task.alternateUrl || "", "_blank");
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error starting task:", error);
      toast.error("Failed to start task. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmitProof = () => {
    if (!TaskStateManager.isTaskStarted(task._id)) {
      toast.error("Please start the task first before submitting proof.");
      return;
    }
    const params = new URLSearchParams({
      taskId: task._id,
      title: task.title,
      description: task.description,
      reward: task.rewardPoints.toString(),
      category: task.category,
      url: task.taskLink || task.alternateUrl || "",
    });
    toast.info("Redirecting to proof submission...", { autoClose: 2000 });
    setTimeout(() => {
      window.location.href = `/user-dashboard/task-verification/${task._id}?${params.toString()}`;
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Uses global background token with dynamic blur opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal - Configured to use global dynamic theme tokens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="
fixed inset-0
md:inset-auto md:top-1/2 md:left-1/2
md:-translate-x-1/2 md:-translate-y-1/2
w-full md:max-w-2xl
h-full md:h-auto md:max-h-[85vh]

bg-background
border-0 md:border md:border-border/70
rounded-none md:rounded-3xl

shadow-[0_20px_50px_rgba(0,0,0,0.15)]
dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)]

ring-1 ring-border/30
z-[100]
overflow-hidden
flex flex-col
pt-safe pb-safe
"
          >
            {/* Header - Adapts transparently using card background boundaries */}
            <div className="relative p-5 border-b border-border shrink-0 bg-card/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="flex items-start gap-3 pr-10">
                <div className="flex-1 space-y-2">
                  {/* Category + Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(task.category)}`}
                    >
                      {task.category}
                    </span>
                    <StatusBadge status="available" />
                  </div>

                  {/* Title */}
                  <h2 className="text-sm md:text-xl font-black uppercase tracking-tighter leading-tight text-foreground">
                    {task.title}
                  </h2>

                  {/* Reward + ID */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5">
                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-xs font-black uppercase tracking-widest text-yellow-500">
                        {task.rewardPoints} TP
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      ID: {task._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-4 bg-card">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Description
                </h3>
                <div className="p-4 bg-muted/40 rounded-xl border border-border">
                  <SafeHTMLRenderer
                    content={task.description}
                    className="text-sm text-muted-foreground leading-relaxed"
                  />
                </div>
              </div>

              {/* Instructions */}
              {task.instructions && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Instructions
                  </h3>
                  <div className="p-4 bg-muted/40 rounded-xl border border-border">
                    <SafeHTMLRenderer
                      content={task.instructions}
                      className="text-sm text-muted-foreground leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Validation Type */}
              {task.validationType && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Validation Type
                  </h3>
                  <div className="p-4 bg-muted/40 rounded-xl border border-border">
                    <p className="text-sm font-black uppercase tracking-widest text-foreground">
                      {task.validationType}
                    </p>
                  </div>
                </div>
              )}

              {/* Task URL */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Task Link
                </h3>
                <div className="p-4 bg-muted/40 rounded-xl border border-border flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground truncate flex-1">
                    {task.taskLink || task.alternateUrl || "No URL provided"}
                  </span>
                  <button
                    onClick={() =>
                      window.open(
                        task.taskLink || task.alternateUrl || "",
                        "_blank",
                      )
                    }
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors shrink-0"
                  >
                    Visit
                  </button>
                </div>
              </div>

              {/* Deadline */}
              {task.deadline && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Deadline
                  </h3>
                  <div className="p-4 bg-muted/40 rounded-xl border border-border flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex justify-between items-center w-full">
                      <p className="text-sm font-black uppercase tracking-tighter text-foreground">
                        {new Date(task.deadline).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        {new Date(task.deadline).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* How to Complete */}
              <div className="p-4 bg-muted/40 rounded-xl border border-border flex items-start gap-3">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                    How to Complete
                  </h3>
                  <ol className="space-y-2">
                    {[
                      'Click "Start Task" to begin',
                      "Complete the task on the external website",
                      "Return here and submit your proof",
                    ].map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-5 h-5 rounded-full bg-foreground/10 text-foreground text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 md:p-5 border-t border-border bg-card/50 shrink-0 space-y-3 mb-safe">
              <div className="flex sm:flex-row gap-2">
                <button
                  onClick={handleStartTask}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border border-border text-muted-foreground hover:text-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "Start Task"
                  )}
                </button>

                <button
                  onClick={handleSubmitProof}
                  className="flex-1 py-3 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Submit Proof
                </button>
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                Start task first to enable proof submission
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
