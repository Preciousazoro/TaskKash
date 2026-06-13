'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

// YouTube API type declarations
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  ArrowLeft,
  Music,
  Video,
  Coins,
  Shield,
  AlertCircle,
  Loader2,
  Gift,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

/* ─── Types ──────────────────────────────────────────────── */
type TaskStatus = "not_started" | "in_progress" | "completed" | "failed";
type Platform = "youtube" | "spotify" | "soundcloud";

interface TaskData {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  creatorAvatar?: string;
  platform: Platform;
  campaignType: "music" | "video" | "playlist";
  mediaUrl: string;
  embedUrl: string;
  coverArt?: string;
  reward: number;
  completionType: "listen_duration" | "watch_duration" | "listen_percentage" | "watch_percentage";
  requiredDuration?: number;
  requiredPercentage?: number;
  allowSkipping: boolean;
  totalDuration?: number; // total track/video length in seconds
}

/* ─── Mock task data ─────────────────────────────────────── */
const MOCK_TASK: TaskData = {
  id: "2",
  title: "Watch Burna Boy's Latest Video",
  description: "Watch the official music video to completion and earn your reward instantly.",
  creatorName: "Burna Boy",
  platform: "youtube",
  campaignType: "video",
  mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&modestbranding=1",
  reward: 150,
  completionType: "listen_duration",
  requiredDuration: 30,
  allowSkipping: false,
  totalDuration: 212,
};

/* ─── Platform config ────────────────────────────────────── */
const platformConfig: Record<Platform, { label: string; color: string; bg: string; accent: string }> = {
  youtube:    { label: "YouTube",    color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",    accent: "#ef4444" },
  spotify:    { label: "Spotify",    color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20", accent: "#22c55e" },
  soundcloud: { label: "SoundCloud", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", accent: "#f97316" },
};

/* ─── Helpers ────────────────────────────────────────────── */
const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* ─── Verification Step ──────────────────────────────────── */
const VerificationStep = ({ done, active, label }: { done: boolean; active: boolean; label: string }) => (
  <div className={`flex items-center gap-3 transition-all ${done ? "opacity-100" : active ? "opacity-100" : "opacity-40"}`}>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
      done ? "border-teal-500 bg-teal-500" : active ? "border-primary bg-primary/20 animate-pulse" : "border-border"
    }`}>
      {done && <CheckCircle className="w-3 h-3 text-white" />}
      {active && !done && <div className="w-2 h-2 rounded-full bg-primary" />}
    </div>
    <span className={`text-xs font-semibold ${done ? "text-teal-400" : active ? "text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const TaskPlayerPage = () => {
  const router = useRouter();
  const params = useParams();
  const [task, setTask] = useState<TaskData>(MOCK_TASK);
  const [loading, setLoading] = useState(true);

  const [taskStatus, setTaskStatus] = useState<TaskStatus>("not_started");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [percentageWatched, setPercentageWatched] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/user/campaigns/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setTask(data.campaign);
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCampaign();
    }
  }, [params.id]);

  // Load YouTube Player API
  useEffect(() => {
    if (!window.YT && task.platform === 'youtube') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
      };
    }
  }, [task.platform]);

  // Initialize YouTube player
  useEffect(() => {
    if (task.platform === 'youtube' && taskStatus !== 'not_started' && window.YT) {
      let videoId = '';
      if (task.mediaUrl.includes('youtu.be')) {
        videoId = task.mediaUrl.split('/').pop()?.split('?')[0] || '';
      } else {
        videoId = new URL(task.mediaUrl).searchParams.get('v') || '';
      }

      console.log('Extracted video ID:', videoId);

      if (videoId && !playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId,
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready');
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // Sync player state with our state
              if (event.data === window.YT.PlayerState.PLAYING && !isPlaying) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED && isPlaying) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
              }
            },
          },
        });
      }
    }
  }, [task.platform, task.mediaUrl, taskStatus, isPlaying]);

  const isAudio = task.campaignType === "music" || task.campaignType === "playlist";
  const isVideo = task.campaignType === "video";
  const isDuration = task.completionType.includes("duration");
  const required = isDuration ? (task.requiredDuration ?? 60) : (task.requiredPercentage ?? 80);
  const current = isDuration ? secondsElapsed : percentageWatched;
  const progress = Math.min((current / required) * 100, 100);
  const isComplete = current >= required;
  const total = task.totalDuration ?? task.requiredDuration ?? 180;

  const steps = [
    { label: "Playback started",          done: taskStatus !== "not_started",                   active: false },
    { label: "Active listening detected", done: secondsElapsed >= 5 || percentageWatched >= 10, active: taskStatus === "in_progress" },
    { label: "Duration requirement met",  done: isComplete,                                     active: taskStatus === "in_progress" && !isComplete },
  ];

  /* Timer */
  useEffect(() => {
    if (isPlaying && taskStatus === "in_progress" && !isComplete) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((s) => {
          const next = s + 1;
          if (isDuration) setPercentageWatched(Math.min(Math.round((next / total) * 100), 100));
          return next;
        });
        if (!isDuration) setPercentageWatched((p) => Math.min(p + 0.5, 100));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, taskStatus, isComplete, isDuration, total]);

  /* Completion */
  useEffect(() => {
    if (isComplete && taskStatus === "in_progress") {
      setTaskStatus("completed");
      setIsPlaying(false);
      toast.success(`Task complete! +${task.reward} points earned`);
    }
  }, [isComplete, taskStatus, task.reward]);

  const handleStart = () => {
    setTaskStatus("in_progress");
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (taskStatus === "not_started") { handleStart(); return; }

    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);

    // Control YouTube player if available
    if (task.platform === 'youtube' && playerRef.current) {
      if (newPlayingState) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const response = await fetch(`/api/user/campaigns/${params.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secondsElapsed,
          percentageWatched,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `+${task.reward} points added to your balance!`);
        router.push("/user-dashboard/campaign-center");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to claim reward");
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error("Failed to claim reward");
    } finally {
      setClaiming(false);
    }
  };

  const handleContinueListening = () => {
    setTaskStatus("in_progress");
    setIsPlaying(true);
  };

  const platform = platformConfig[task.platform];

  /* ─── LOADING SCREEN ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <UserSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <UserHeader />
          <main className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-muted-foreground">Loading campaign...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }


  

  /* ─── COMPLETION SCREEN ─── */
  if (taskStatus === "completed") {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <UserSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <UserHeader />
          <main className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8 pb-30">
            <div className="max-w-sm w-full text-center">
              {/* <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-teal-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-teal-400" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" style={{ animationDuration: "3s" }} />
              </div> */}
              <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">Task Completed</h2>
              <p className="text-muted-foreground text-sm mb-6">{task.title}</p>
              <div className="bg-card border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Points Earned</p>
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-400" />
                  <span className="text-4xl font-black text-yellow-400">+{task.reward.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Added to your balance on claim</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 mb-6 text-left space-y-3">
                {steps.map((s, i) => (
                  <VerificationStep key={i} done={true} active={false} label={s.label} />
                ))}
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60"
              >
                {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                {claiming ? "Processing…" : `Claim +${task.reward} Points`}
              </button>
              <button
                onClick={handleContinueListening}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-lg bg-green-500 hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Play className="w-4 h-4" />
                Continue Listening
              </button>
              <button
                onClick={() => router.push("/user-dashboard/campaign-center")}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tasks
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }





  /* ─── MAIN PLAYER ─── */
  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-30 lg:pb-0">

          {/* ── Full-width top section ── */}
          <div className="w-full px-4 md:px-8 pt-6 pb-4">
            <button
              onClick={() => router.push("/user-dashboard/campaign-center")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Tasks
            </button>
          </div>




          {/* ── VIDEO PLAYER (full width) ── */}
          {isVideo && (
            <div className="w-full px-4 md:px-8 mb-6">
              <div className="w-full bg-black rounded-2xl overflow-hidden border border-border">

                {/* Video embed area */}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  {taskStatus !== "not_started" ? (
                    task.platform === 'youtube' ? (
                      <div id="youtube-player" className="absolute inset-0 w-full h-full" />
                    ) : (
                      <iframe
                        src={task.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={task.title}
                      />
                    )
                  ) : (
                    /* Pre-start placeholder */
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-[#0d0d14] to-[#111827]">
                      <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                        <Video className="w-9 h-9 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground mb-1">{task.title}</p>
                        <p className="text-xs text-muted-foreground">Press Start Task to begin</p>
                      </div>
                      <button
                        onClick={handleStart}
                        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider transition-all"
                      >
                        <Play className="w-4 h-4" />
                        Start Task
                      </button>
                    </div>
                  )}
                </div>

                {/* Video info bar */}
                <div className="px-5 py-3.5 bg-card border-t border-border flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-black shrink-0">
                      {task.creatorName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none">{task.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{task.creatorName} · {platform.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${platform.bg} ${platform.color}`}>
                      {platform.label}
                    </span>
                    {taskStatus !== "not_started" && (
                      <button
                        onClick={handleTogglePlay}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          isPlaying
                            ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                        }`}
                      >
                        {isPlaying ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Resume</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}





          {/* ── AUDIO PLAYER (card with waveform + art) ── */}
          {isAudio && (
            <div className="w-full px-4 md:px-8 mb-6">
              <div className="w-full bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Cover art / visual */}
                  <div className="md:w-64 shrink-0 aspect-square md:aspect-auto bg-gradient-to-br from-purple-900/80 to-blue-900/80 flex items-center justify-center relative overflow-hidden">
                    {task.coverArt ? (
                      <img src={task.coverArt} alt={task.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        {/* Animated vinyl disc */}
                        <div className={`w-28 h-28 rounded-full border-4 border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative ${isPlaying ? "animate-spin" : ""}`}
                          style={{ animationDuration: "4s" }}>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Music className="w-4 h-4 text-white/40" />
                          </div>
                          <div className="absolute inset-2 rounded-full border border-white/5" />
                          <div className="absolute inset-5 rounded-full border border-white/5" />
                        </div>
                        <div className="text-center px-4">
                          <p className="text-xs font-bold text-white/60 truncate">{task.creatorName}</p>
                        </div>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Track info + embed */}
                  <div className="flex-1 flex flex-col p-5 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${platform.bg} ${platform.color}`}>
                          {platform.label}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
                          <Coins className="w-3 h-3" />+{task.reward} pts
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-foreground leading-tight">{task.title}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{task.creatorName}</p>
                    </div>

                    {/* Platform embed (Spotify iframe etc) */}
                    {taskStatus !== "not_started" && (
                      <div className="rounded-xl overflow-hidden border border-border bg-background/50">
                        <iframe
                          src={task.embedUrl}
                          className="w-full"
                          height="80"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          title={task.title}
                        />
                      </div>
                    )}

                    {/* Start button if not started */}
                    {taskStatus === "not_started" && (
                      <button
                        onClick={handleStart}
                        className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-wider transition-all"
                      >
                        <Play className="w-4 h-4" />
                        Start Listening
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Bottom content: Info + Progress ── */}
          <div className="w-full px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left: description + tags */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">About this task</h3>
                <p className="text-sm text-foreground leading-relaxed">{task.description}</p>
                <div className="flex items-center gap-2 flex-wrap mt-4">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${platform.bg} ${platform.color}`}>
                    {platform.label}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
                    <Coins className="w-3 h-3" />+{task.reward} Points
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {isDuration ? `${required}s required` : `${required}% required`}
                  </span>
                </div>
              </div>

              {/* Anti-skip warning */}
              {!task.allowSkipping && (
                <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400 leading-relaxed">
                    <span className="font-bold">Do not skip ahead</span> — skipping will invalidate this task and forfeit your reward.
                  </p>
                </div>
              )}
            </div>

            {/* Right: progress + verification + reward */}
            <div className="space-y-4">

              {/* Live progress */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {isDuration ? "Listening Progress" : "Watch Progress"}
                  </p>
                  {isPlaying && (
                    <span className="flex items-center gap-1.5 text-[10px] text-teal-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>

                <div className="text-center mb-4">
                  {isDuration ? (
                    <>
                      <span className="text-3xl font-black text-foreground tabular-nums">{secondsElapsed}</span>
                      <span className="text-base text-muted-foreground"> / {required}s</span>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">seconds completed</p>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-foreground tabular-nums">{Math.round(percentageWatched)}</span>
                      <span className="text-base text-muted-foreground">%</span>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">of {required}% target</p>
                    </>
                  )}
                </div>

                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: isComplete
                        ? "linear-gradient(90deg, #14b8a6, #22c55e)"
                        : "linear-gradient(90deg, var(--primary), #a855f7)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">0%</span>
                  <span className="text-[10px] font-bold text-foreground">{Math.round(progress)}%</span>
                  <span className="text-[10px] text-muted-foreground">100%</span>
                </div>
              </div>

              {/* Verification */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Verification</p>
                </div>
                <div className="space-y-3">
                  {steps.map((s, i) => (
                    <VerificationStep key={i} done={s.done} active={s.active} label={s.label} />
                  ))}
                </div>
              </div>

              {/* Reward */}
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Reward</p>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-black text-yellow-400">+{task.reward.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">points</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Awarded automatically once all requirements are met.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskPlayerPage;