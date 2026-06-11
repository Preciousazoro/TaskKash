'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Plus, Loader2, Star, ShieldCheck, Calendar, ExternalLink, Link2, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

/* ─── PREVIEW HELPER LABELS & STYLES ─── */
const CATEGORY_LABELS: Record<string, string> = {
  social: "Social",
  content: "Content",
  commerce: "Commerce",
};
const CATEGORY_STYLES: Record<string, string> = {
  social: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  content: "bg-green-500/10 text-green-500 border border-green-500/20",
  commerce: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
};
const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border border-green-500/20",
  expired: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  disabled: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

function fmtDeadline(dt: string) {
  if (!dt) return null;
  return new Date(dt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CreateTaskPage = () => {
  const router = useRouter();

  /* ---------- FORM STATE ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<'social' | 'content' | 'commerce'>('social');
  const [rewardPoints, setRewardPoints] = useState<number | "">("");
  const [validationType, setValidationType] = useState("");
  const [instructions, setInstructions] = useState("");
  const [taskLink, setTaskLink] = useState("");
  const [alternateUrl, setAlternateUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<'active' | 'expired' | 'disabled'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPreviewEmpty =
    !title.trim() && !description.trim() && !rewardPoints && !taskLink.trim() && !alternateUrl.trim() && !validationType;

  /* ---------- CREATE TASK ---------- */
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title.trim()) {
      toast.error('Title is required');
      setIsSubmitting(false);
      return;
    }

    if (!description.trim()) {
      toast.error('Description is required');
      setIsSubmitting(false);
      return;
    }

    if (!taskLink.trim() && !alternateUrl.trim()) {
      toast.error('At least one link is required (Task Link or Alternate URL)');
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        title: title.trim(),
        description: description.trim(),
        category,
        rewardPoints: Number(rewardPoints),
        validationType: validationType.trim(),
        instructions: instructions.trim(),
        taskLink: taskLink.trim(),
        alternateUrl: alternateUrl.trim() || '',
        deadline: deadline || null,
        status: status || 'active'
      };

      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details?.join(', ') || 'Failed to create task');
      }

      toast.success('Task created successfully!');
      router.push('/admin-dashboard/manage-tasks');
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared Shadcn-like dropdown wrapper base styles
  const inputBaseClass = "w-full bg-card border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const selectClass = `${inputBaseClass} appearance-none cursor-pointer pr-10`;

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
              Create New Task
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <Plus size={16} />
              Task Management
            </p>
          </div>

          {/* SIDE-BY-SIDE GRID (FORM & PREVIEW) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 max-w-7xl items-start">

            {/* LEFT SIDE: CREATE TASK FORM */}
            <div className="bg-card border rounded-2xl p-5 lg:p-6">
              <form onSubmit={handleCreateTask} className="space-y-6">

                {/* GRID ROW 1: TITLE & CATEGORY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
                    <input
                      className={inputBaseClass}
                      placeholder="Enter task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={category}
                        onChange={(e) => setCategory(e.target.value as 'social' | 'content' | 'commerce')}
                        required
                      >
                        <option value="social" className="bg-popover text-popover-foreground py-2">Social</option>
                        <option value="content" className="bg-popover text-popover-foreground py-2">Content</option>
                        <option value="commerce" className="bg-popover text-popover-foreground py-2">Commerce</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/70">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
                  <RichTextEditor
                    content={description}
                    onChange={setDescription}
                    placeholder="Enter task description"
                    className="bg-card border-border text-foreground placeholder-muted-foreground"
                  />
                </div>

                {/* GRID ROW 2: REWARD POINTS & VALIDATION TYPE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Reward Points</label>
                    <input
                      type="number"
                      className={inputBaseClass}
                      placeholder="Enter reward points"
                      value={rewardPoints}
                      onChange={(e) =>
                        setRewardPoints(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Validation Type</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={validationType}
                        onChange={(e) => setValidationType(e.target.value)}
                        required
                      >
                        <option value="" className="bg-popover text-muted-foreground/50 py-2">Select validation type</option>
                        <option value="screenshot" className="bg-popover text-popover-foreground py-2">Screenshot</option>
                        <option value="username" className="bg-popover text-popover-foreground py-2">Username</option>
                        <option value="text" className="bg-popover text-popover-foreground py-2">Text</option>
                        <option value="link" className="bg-popover text-popover-foreground py-2">Link</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/70">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Instructions</label>
                  <RichTextEditor
                    content={instructions}
                    onChange={setInstructions}
                    placeholder="Enter task instructions"
                    className="bg-card border-border text-foreground placeholder-muted-foreground"
                  />
                </div>

                {/* GRID ROW 3: TASK LINK & ALTERNATE URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Task Link (preferred)</label>
                    <input
                      type="url"
                      className={inputBaseClass}
                      placeholder="https://example.com/task"
                      value={taskLink}
                      onChange={(e) => setTaskLink(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Alternate URL</label>
                    <input
                      type="url"
                      className={inputBaseClass}
                      placeholder="https://example.com/alternate"
                      value={alternateUrl}
                      onChange={(e) => setAlternateUrl(e.target.value)}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground bg-card p-3 rounded-lg border border-border">
                  ⚠️ At least one link is required (Task Link or Alternate URL)
                </p>

                {/* GRID ROW 4: DEADLINE & STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Deadline</label>
                    <input
                      type="datetime-local"
                      className={inputBaseClass}
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Status</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'active' | 'expired' | 'disabled')}
                        required
                      >
                        <option value="active" className="bg-popover text-popover-foreground py-2">Active</option>
                        <option value="expired" className="bg-popover text-popover-foreground py-2">Expired</option>
                        <option value="disabled" className="bg-popover text-popover-foreground py-2">Disabled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/70">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-border md:flex md:justify-end md:w-auto">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full md:w-auto px-6 py-2 text-center border border-border rounded-lg text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-border/20 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500/20 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      'Create Task'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: LIVE PREVIEW CONTAINER */}
            <div className="xl:sticky xl:top-0 space-y-4">
              <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2 bg-muted/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground">Live Card Preview</p>
                </div>

                <div className="p-6">
                  {isPreviewEmpty ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3">
                        <Star className="w-5 h-5 text-muted-foreground opacity-40" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Your card is empty</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-[220px]">
                        Fill out the title and fields on the left to see the update live.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Category Badge */}
                      <div>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${CATEGORY_STYLES[category]}`}>
                          {CATEGORY_LABELS[category]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold tracking-tight text-foreground break-words leading-tight">
                        {title || <span className="text-muted-foreground italic font-normal text-sm">Untitled Task</span>}
                      </h3>

                      {/* Description */}
                      {description && (
                        <div
                          className="text-sm text-muted-foreground break-words line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      )}

                      <div className="border-t border-border/60 my-2" />

                      {/* Reward Counter */}
                      {rewardPoints !== "" && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-foreground tracking-tight">{Number(rewardPoints).toLocaleString()}</span>
                          <span className="text-xs font-bold uppercase text-green-500 tracking-wider">Points</span>
                        </div>
                      )}

                      {/* Info Metadata Items */}
                      <div className="space-y-2 pt-1">
                        {validationType && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="capitalize">{validationType} Verification Required</span>
                          </div>
                        )}

                        {deadline && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>Ends: {fmtDeadline(deadline)}</span>
                          </div>
                        )}

                        <div className="pt-1">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                            {status}
                          </span>
                        </div>
                      </div>

                      {/* Render Links If Added */}
                      {(taskLink || alternateUrl) && (
                        <div className="pt-2 space-y-1.5 border-t border-border/60">
                          {taskLink && (
                            <div className="flex items-center gap-2 text-xs text-blue-500 font-medium truncate">
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate hover:underline">{taskLink}</span>
                            </div>
                          )}
                          {alternateUrl && (
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium truncate">
                              <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate hover:underline">{alternateUrl}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTaskPage;