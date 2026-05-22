"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  Loader2,
  Info,
  ArrowLeft,
  X,
  Eye,
  FileText,
  Layers,
  HelpCircle,
} from "lucide-react";
import { TaskStateManager } from "@/lib/taskState";
import { toast } from "react-toastify";

// Navigation Imports
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import TaskVerificationSkeleton from "@/components/LoadingSkeleton/TaskVerificationSkeleton";

export default function TaskVerificationPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskTitle = searchParams.get("title") || "Task";
  const reward = searchParams.get("reward") || "0";
  const category = searchParams.get("category") || "Other";
  const taskDescription = searchParams.get("description") || "";
  const taskUrl = searchParams.get("url") || "";

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    description?: string;
    files?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRedirecting = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check if task is started
  useEffect(() => {
    if (taskId && !isRedirecting.current) {
      const isStarted = TaskStateManager.isTaskStarted(taskId as string);

      if (!isStarted) {
        isRedirecting.current = true;
        toast.error("You must start the task first before submitting proof.", {
          autoClose: 3000,
        });

        const redirectTimer = setTimeout(() => {
          router.push("/user-dashboard/dashboard");
        }, 1000);

        return () => clearTimeout(redirectTimer);
      }
    }
  }, [taskId]);

  const onChooseFile = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > 5) {
      toast.error("Maximum 5 screenshots allowed");
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isValidType = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }

      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    if (validFiles.length > 0 && errors.files) {
      setErrors((prev) => ({ ...prev, files: undefined }));
    }
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskId) return;

    const newErrors: { description?: string; files?: string } = {};

    if (!description.trim()) {
      newErrors.description = "Proof details & context is required";
    }

    if (!files || files.length === 0) {
      newErrors.files = "At least one screenshot / image proof is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setErrors({});

    if (!TaskStateManager.isTaskStarted(taskId as string)) {
      toast.error("Task must be started before submitting proof.");
      router.push("/user-dashboard/dashboard");
      return;
    }

    setIsSubmitting(true);

    try {
      const proofUrls: string[] = [];

      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            return uploadData.url;
          } else {
            throw new Error(`Failed to upload ${file.name}`);
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        proofUrls.push(...uploadedUrls);
      }

      const submissionData = {
        taskId,
        proofUrls: proofUrls,
        proofLink: taskUrl,
        notes: description,
      };

      const response = await fetch("/api/tasks/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit proof");
      }

      const data = await response.json();
      TaskStateManager.updateTaskState(taskId as string, "submitted");
      toast.success(
        "Proof submitted successfully! You'll receive your reward after verification.",
      );

      setTimeout(() => {
        router.push("/user-dashboard/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit proof. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (isRedirecting.current) return;
    router.back();
  };

  if (isLoading) {
    return <TaskVerificationSkeleton />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 1. SIDEBAR */}
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 2. HEADER */}
        <UserHeader />

        {/* 3. MAIN CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-6xl mx-auto mb-5">
            {/* Context Breadcrumbs Header */}
            <header className="mb-8 space-y-4">
              <div className="flex items-center gap-3">
                {/* <button
                  onClick={goBack}
                  className="p-2 rounded-full hover:bg-muted transition-colors border border-border/40"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button> */}
                <div>
                  <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic leading-none text-foreground">
                    Verification Gate
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Provide precise validation data to claim your earnings
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs pt-1">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                  {taskTitle}
                </span>
                <span className="text-green-500 font-black tracking-tight font-mono">
                  +{reward} TP Reward
                </span>
                <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  {category}
                </span>
                <span className="text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                  ID: {String(taskId)}
                </span>
              </div>

              {taskDescription && (
                <div className="px-4 py-3 bg-muted/20 rounded-xl border border-border/60">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {stripHtmlTags(taskDescription)}
                  </p>
                </div>
              )}
            </header>

            {/* Split Screen Dashboard Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMNS: SUBMISSION WORKSPACE */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Form Step 1: Proof Context */}
                  <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layers size={14} /> Step 1: Verification Context{" "}
                      <span className="text-red-500">*</span>
                    </h3>

                    <div className="space-y-2">
                      <textarea
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (errors.description && e.target.value.trim()) {
                            setErrors((prev) => ({
                              ...prev,
                              description: undefined,
                            }));
                          }
                        }}
                        placeholder="Paste links, transaction hashes, wallets, or detail your workflow completion..."
                        className={`w-full h-36 resize-none bg-muted/30 border rounded-xl p-4 text-sm font-medium focus:border-foreground focus:ring-0 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground ${
                          errors.description
                            ? "border-red-500 bg-red-500/5"
                            : "border-border"
                        }`}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/40">
                      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="leading-normal">
                        Make sure to provide direct evidence. Misleading,
                        spoofed, or placeholder submittals will trigger account
                        suspension.
                      </p>
                    </div>
                  </div>

                  {/* Form Step 2: Media Dropzone Box */}
                  <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Upload size={14} /> Step 2: Asset Dropzone{" "}
                      <span className="text-red-500">*</span>
                    </h3>

                    {/* Integrated Reference Dropzone style */}
                    {files.length < 5 && (
                      <div
                        onClick={onChooseFile}
                        className={`relative group cursor-pointer p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[180px] ${
                          files.length > 0
                            ? "border-green-500/40 bg-green-500/5"
                            : errors.files
                              ? "border-red-500/40 bg-red-500/5"
                              : "border-border bg-muted/30 hover:border-foreground/40 hover:bg-muted/50"
                        }`}
                      >
                        <div className="space-y-4 max-w-md">
                          <div className="bg-foreground/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                            <Upload className="h-5 w-5 text-foreground" />
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-wider text-foreground">
                              {files.length > 0
                                ? `Add extra screen proofs (${files.length}/5)`
                                : "Select image proofs"}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                              Or drag and drop local files directly here
                            </p>
                          </div>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-60">
                            Supports PNG, JPG, WEBP • Max 5MB per file
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          multiple
                          className="hidden"
                          onChange={onFileChange}
                        />
                      </div>
                    )}

                    {errors.files && (
                      <p className="text-xs text-red-500 font-medium mt-2">
                        {errors.files}
                      </p>
                    )}

                    {/* Compact layout alert confirmation */}
                    {files.length > 0 && (
                      <div className="flex items-center gap-2 bg-foreground/5 p-2.5 rounded-lg border border-foreground/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">
                          System holding: {files.length} payload image
                          {files.length !== 1 ? "s" : ""} ready
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submission Trigger */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-foreground text-background py-3 rounded-xl font-black hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Ledger...
                      </>
                    ) : (
                      "Submit Proof Payload"
                    )}
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: LIVE DATA PREVIEW MOCK CARD */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Eye size={14} /> Review Monitor
                </h3>

                <div className="bg-card rounded-2xl overflow-hidden border border-border group shadow-sm">
                  {/* Preview Top Aspect Box Container */}
                  <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center border-b border-border/40">
                    {files.length > 0 ? (
                      <img
                        src={URL.createObjectURL(files[files.length - 1])}
                        alt="Latest Upload Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-4 space-y-2">
                        <FileText
                          size={32}
                          className="text-muted-foreground/30 animate-pulse"
                        />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">
                          Awaiting Active Image
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 bg-background/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-foreground border border-border/40 uppercase tracking-widest">
                      Live Stream
                    </div>
                  </div>

                  {/* Preview Form Content Injection Output */}
                  <div className="p-5 space-y-3">
                    <h2 className="font-bold text-base leading-tight text-foreground truncate">
                      {taskTitle}
                    </h2>

                    <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed break-words whitespace-pre-wrap">
                      {description.trim() ||
                        "Waiting for verification context details text update..."}
                    </p>

                    {/* Upload Queue File Strip Counter Grid */}
                    {files.length > 0 && (
                      <div className="pt-2 border-t border-border/40 space-y-2">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                          Upload Strip Array ({files.length}/5)
                        </span>
                        <div className="grid grid-cols-5 gap-1.5">
                          {files.map((file, idx) => (
                            <div
                              key={idx}
                              className="relative group/thumb aspect-square bg-muted/60 rounded border border-border overflow-hidden"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFiles((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  );
                                }}
                                className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[9px] font-black bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                        #{category.replace(/\s+/g, "").toUpperCase()}
                      </span>
                      <span className="text-[9px] font-black bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">
                        #{reward}TP
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Policy Advisory Card */}
                <div className="bg-muted/40 border border-border p-5 rounded-2xl">
                  <h4 className="font-bold text-xs mb-2 flex items-center gap-2 uppercase text-foreground">
                    <HelpCircle size={14} /> Verification Policy
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Once submitted, proofs are routed directly to the validation
                    engine nodes. Average verification turnaround window lasts{" "}
                    <span className="text-foreground font-medium">
                      12-24 hours
                    </span>{" "}
                    depending on platform load factor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
