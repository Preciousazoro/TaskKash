"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Share2, 
  ChevronDown, 
  FileText, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Award, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Layers
} from "lucide-react";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";

// Types
type TimeFilter = "24h" | "7d" | "30d" | "All";

interface ActivityBar {
  height: number; // percentage 0-100
}

interface ProjectData {
  id: string;
  name: string;
  status: "active" | "ended";
  remainingText: string;
  participants: string;
  pointsEarned: string;
  startDate: string;
  endDate: string;
  duration: string;
  interactedUsers: string;
  activeUsers: string;
  retentionRate: string;
  totalTasks: number;
  completedTasks: string;
  completionRate: string;
  activityBars: ActivityBar[];
  peakActivity: string;
}

// Sample Data derived from HTML template
const PROJECTS: ProjectData[] = [
  {
    id: "#44021",
    name: "Summer DeFi Quest",
    status: "active",
    remainingText: "14 Days Left",
    participants: "12,450",
    pointsEarned: "840.2k",
    startDate: "Jun 01, 2026",
    endDate: "Jun 30, 2026",
    duration: "30 Days",
    interactedUsers: "45,102",
    activeUsers: "9,211",
    retentionRate: "74.2%",
    totalTasks: 15,
    completedTasks: "186,750",
    completionRate: "82%",
    activityBars: [
      { height: 40 },
      { height: 60 },
      { height: 30 },
      { height: 80 },
      { height: 100 },
      { height: 70 },
      { height: 90 },
    ],
    peakActivity: "Sun, 18:00",
  },
  {
    id: "#44022",
    name: "NFT Creator Spotlight",
    status: "ended",
    remainingText: "Completed",
    participants: "8,120",
    pointsEarned: "320.5k",
    startDate: "May 10, 2026",
    endDate: "May 20, 2026",
    duration: "10 Days",
    interactedUsers: "15,020",
    activeUsers: "7,800",
    retentionRate: "96.0%",
    totalTasks: 5,
    completedTasks: "40,600",
    completionRate: "100%",
    activityBars: [
      { height: 20 },
      { height: 40 },
      { height: 90 },
      { height: 100 },
      { height: 80 },
      { height: 30 },
      { height: 10 },
    ],
    peakActivity: "Fri, 21:00",
  },
];

export default function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("7d");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>("#44021");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  const handleExportCSV = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    alert(`Exporting CSV for project ${projectId}...`);
  };

  const handleShare = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    alert(`Share link for project ${projectId} copied to clipboard!`);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
                  Project Analytics
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  Performance Metrics
                </p>
              </div>

              {/* Time Filter Pill Selector */}
              <div className="inline-flex p-1 bg-card rounded-xl border border-border shadow-sm">
                {(["24h", "7d", "30d", "All"] as TimeFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* TOP SUMMARY CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <SummaryCard
                title="Total Participants"
                value="42,812"
                trend="+12.4% from last week"
                icon={<Users className="w-4 h-4 text-primary" />}
              />
              <SummaryCard
                title="Completion Rate"
                value="76.4%"
                trend="+2.1% from last week"
                icon={<CheckCircle2 className="w-4 h-4 text-primary" />}
              />
              <SummaryCard
                title="Points Issued"
                value="1.28M"
                trend="+18.2% from last week"
                icon={<Award className="w-4 h-4 text-primary" />}
              />
              <SummaryCard
                title="Avg. Engagement"
                value="4.2"
                trend="+0.5 from last week"
                icon={<Activity className="w-4 h-4 text-primary" />}
              />
            </section>

            {/* PROJECT METRICS SECTION */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Projects Performance
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  Total 15 Projects
                </span>
              </div>

              <div className="space-y-3">
                {PROJECTS.map((project) => {
                  const isExpanded = expandedProjectId === project.id;

                  return (
                    <div
                      key={project.id}
                      className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                    >
                  {/* Summary Bar (Clickable Header) */}
                  <div
                    onClick={() => toggleExpand(project.id)}
                    className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto_auto] items-center gap-4 cursor-pointer select-none"
                  >
                    {/* Title & ID */}
                    <div>
                      <h3 className="font-bold text-foreground text-base">
                        {project.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        ID: {project.id}
                      </span>
                    </div>

                        {/* Status Box */}
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md w-fit ${
                              project.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {project.status}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {project.remainingText}
                          </span>
                        </div>

                        {/* Participants (Hidden on mobile) */}
                        <div className="hidden sm:block">
                          <span className="text-xs text-muted-foreground block">
                            Participants
                          </span>
                          <span className="font-bold text-foreground">
                            {project.participants}
                          </span>
                        </div>

                        {/* Points Earned (Hidden on tablet/mobile) */}
                        <div className="hidden md:block">
                          <span className="text-xs text-muted-foreground block">
                            Points Earned
                          </span>
                          <span className="font-bold text-foreground">
                            {project.pointsEarned}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            title="Export CSV"
                            onClick={(e) => handleExportCSV(e, project.id)}
                            className="p-2 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            title="Share Project"
                            onClick={(e) => handleShare(e, project.id)}
                            className="p-2 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Expand Chevron Icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-muted-foreground flex justify-center items-center pl-2"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>

                      {/* Expandable Content Area with Framer Motion */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="border-t border-border bg-muted/50"
                          >
                            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {/* Timeline Group */}
                              <DetailGroup title="Timeline">
                                <DetailRow label="Start Date" value={project.startDate} />
                                <DetailRow label="End Date" value={project.endDate} />
                                <DetailRow label="Duration" value={project.duration} />
                                <DetailRow
                                  label="Remaining"
                                  value={project.remainingText}
                                  valueClass="text-primary"
                                />
                              </DetailGroup>

                              {/* Engagement Group */}
                              <DetailGroup title="User Engagement">
                                <DetailRow label="Interacted" value={project.interactedUsers} />
                                <DetailRow label="Participated" value={project.participants} />
                                <DetailRow label="Active Users" value={project.activeUsers} />
                                <DetailRow label="Retention" value={project.retentionRate} />
                              </DetailGroup>

                          {/* Task Progress Group */}
                          <DetailGroup title="Task Progress">
                            <DetailRow label="Total Tasks" value={project.totalTasks} />
                            <DetailRow label="Total Completed" value={project.completedTasks} />
                            <DetailRow label="Completion Rate" value={project.completionRate} />
                          </DetailGroup>

                              {/* Activity Graph Group */}
                              <DetailGroup title="Activity Graph">
                                <div className="h-10 flex items-end gap-1 mt-2">
                                  {project.activityBars.map((bar, idx) => (
                                    <div
                                      key={idx}
                                      style={{ height: `${bar.height}%` }}
                                      className="flex-1 bg-primary rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                  ))}
                                </div>
                                <div className="mt-3">
                                  <DetailRow label="Peak Activity" value={project.peakActivity} />
                                </div>
                              </DetailGroup>

                              {/* Export Actions Footer */}
                              <div className="col-span-full border-t border-border pt-4 flex justify-end gap-4">
                                <button
                                  onClick={() => alert(`Generating Full Report PDF for ${project.id}...`)}
                                  className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Full Report (PDF)
                                </button>
                                <button
                                  onClick={() => alert(`Exporting Dataset CSV for ${project.id}...`)}
                                  className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Dataset (CSV)
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 border border-border bg-card rounded-lg disabled:opacity-40 hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 text-xs font-semibold rounded-lg border transition-all ${
                    currentPage === page
                      ? "bg-primary border-primary text-primary-foreground font-bold"
                      : "bg-card border-border text-foreground hover:border-primary"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === 3}
                onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                className="p-2 border border-border bg-card rounded-lg disabled:opacity-40 hover:border-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SummaryCard({
  title,
  value,
  trend,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-card p-5 rounded-xl border border-border shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {icon}
      </div>
      <div className="text-2xl font-black mt-2 text-foreground">
        {value}
      </div>
      <span className="text-xs font-semibold text-primary mt-1 flex items-center gap-1">
        <TrendingUp className="w-3 h-3 inline" />
        {trend}
      </span>
      {/* Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/40" />
    </div>
  );
}

function DetailGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b-2 border-primary pb-1 mb-3 w-fit">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-bold text-foreground ${
          valueClass || ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}