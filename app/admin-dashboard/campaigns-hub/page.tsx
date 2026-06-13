'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import {
  Music,
  Video,
  Clapperboard,
  Plus,
  Trash2,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Play,
  Star,
  Gift,
  ChevronDown,
  Link,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Coins,
  Target,
  Zap,
  Layers,
  Package,
  Headphones,
  ListVideo,
} from "lucide-react";
import { toast } from "react-toastify";

/* ─── Types ─────────────────────────────────────────────── */
type CampaignType = "music" | "video";
type Platform = "youtube" | "spotify" | "audiomack" | "apple_music";
type CompletionType = "watch_duration" | "watch_percentage" | "listen_duration" | "listen_percentage";
type CampaignStatus = "draft" | "active" | "paused" | "completed";
type Tab = "info" | "reward" | "preview";

/* ─── Helpers ────────────────────────────────────────────── */
const statusColors: Record<CampaignStatus, string> = {
  draft:     "bg-gray-500/10 text-gray-400 border-gray-500/20",
  active:    "bg-teal-500/10 text-teal-400 border-teal-500/20",
  paused:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const platformLogos: Record<Platform, { src: string; label: string; ring: string }> = {
  youtube:     { src: "https://i.postimg.cc/dtmHW4Yf/Youtube.jpg",    label: "YouTube",     ring: "ring-red-500/40" },
  spotify:     { src: "https://i.postimg.cc/6QzM93qN/Spotify.jpg",    label: "Spotify",     ring: "ring-green-500/40" },
  audiomack:   { src: "https://i.postimg.cc/J0s6YLRN/audiomack.jpg",  label: "Audiomack",   ring: "ring-yellow-500/40" },
  apple_music: { src: "https://i.postimg.cc/fLG2PPyP/i-Tunes.jpg",    label: "Apple Music", ring: "ring-pink-500/40" },
};

/* ─── Sub-components ─────────────────────────────────────── */
const SectionCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-border">
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
    {children}{required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors ${props.className ?? ""}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    rows={3}
    className={`w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none ${props.className ?? ""}`}
  />
);

const Select = ({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors appearance-none pr-10"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
  </div>
);

const Toggle = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) => (
  <div className="inline-flex bg-background border border-border rounded-xl p-1 gap-1">
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${value === o.value ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/* ─── Preview Cards ──────────────────────────────────────── */
const MusicPreviewCard = ({ campaignTitle, description, creatorName, platform, rewardAmount, completionType, requiredDuration, requiredPercentage, thumbnailUrl }: any) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
    <div className="aspect-square bg-gradient-to-br from-violet-900 via-purple-900 to-blue-900 flex items-center justify-center relative">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} className="w-full h-full object-cover" alt="thumbnail" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-white/30">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <Music className="w-10 h-10" />
          </div>
          <span className="text-xs tracking-widest uppercase">Album Art</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
            {creatorName ? creatorName[0].toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-white text-xs font-bold">{creatorName || "Artist Name"}</p>
            <p className="text-white/50 text-[10px]">Music Artist</p>
          </div>
        </div>
      </div>
      {platform && platformLogos[platform as Platform] && (
        <div className="absolute top-3 right-3">
          <img src={platformLogos[platform as Platform].src} alt={platformLogos[platform as Platform].label} className="w-7 h-7 rounded-lg object-cover" />
        </div>
      )}
    </div>
    <div className="p-5">
      <h3 className="font-bold text-foreground text-base mb-1">{campaignTitle || "Track Title"}</h3>
      <p className="text-xs text-muted-foreground mb-4">{description || "Campaign description will appear here."}</p>
      <div className="flex items-end gap-0.5 h-8 mb-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-full bg-primary/30" style={{ height: `${20 + Math.sin(i * 0.8) * 50 + Math.random() * 30}%` }} />
        ))}
      </div>
      <div className="bg-background border border-border rounded-xl p-3 space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Reward</span>
          <span className="text-xs font-bold text-yellow-400">+{rewardAmount?.toLocaleString()} Points</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{completionType?.includes("duration") ? "Listen for" : "Complete"}</span>
          <span className="text-xs font-bold text-foreground">{completionType?.includes("duration") ? `${requiredDuration}s` : `${requiredPercentage}%`}</span>
        </div>
      </div>
      <button className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
        <Headphones className="w-4 h-4" />Start Listening
      </button>
    </div>
  </div>
);

const VideoPreviewCard = ({ campaignTitle, description, creatorName, platform, rewardAmount, completionType, requiredDuration, requiredPercentage, thumbnailUrl }: any) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
    <div className="aspect-video bg-gradient-to-br from-red-950 via-gray-900 to-gray-950 flex items-center justify-center relative">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} className="w-full h-full object-cover" alt="thumbnail" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-white/30">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <Play className="w-8 h-8 ml-1" />
          </div>
          <span className="text-xs tracking-widest uppercase">Video Thumbnail</span>
        </div>
      )}
      {platform && platformLogos[platform as Platform] && (
        <div className="absolute top-3 right-3">
          <img src={platformLogos[platform as Platform].src} alt={platformLogos[platform as Platform].label} className="w-7 h-7 rounded-lg object-cover" />
        </div>
      )}
      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">4:32</div>
    </div>
    <div className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {creatorName ? creatorName[0].toUpperCase() : "?"}
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">{campaignTitle || "Video Title"}</p>
          <p className="text-[10px] text-muted-foreground">{creatorName || "Creator"} · 12K views</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{description || "Campaign description will appear here."}</p>
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>Progress</span><span>0:00 / 4:32</span></div>
        <div className="h-1.5 bg-border rounded-full"><div className="h-full w-0 bg-red-500 rounded-full" /></div>
      </div>
      <div className="bg-background border border-border rounded-xl p-3 space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Reward</span>
          <span className="text-xs font-bold text-yellow-400">+{rewardAmount?.toLocaleString()} Points</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{completionType?.includes("duration") ? "Watch for" : "Complete"}</span>
          <span className="text-xs font-bold text-foreground">{completionType?.includes("duration") ? `${requiredDuration}s` : `${requiredPercentage}%`}</span>
        </div>
      </div>
      <button className="w-full py-3 bg-red-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
        <Play className="w-4 h-4" />Watch Now
      </button>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const CampaignPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ totalMusic: 0, totalVideo: 0, active: 0, completed: 0 });

  /* Campaign meta */
  const [status, setStatus]               = useState<CampaignStatus>("draft");
  const [campaignType, setCampaignType]   = useState<CampaignType>("music");
  const [platform, setPlatform]           = useState<Platform>("spotify");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [description, setDescription]     = useState("");
  const [mediaUrl, setMediaUrl]           = useState("");
  const [thumbnailMode, setThumbnailMode] = useState<"auto" | "upload">("auto");
  const [thumbnailUrl, setThumbnailUrl]   = useState("");
  const [creatorName, setCreatorName]     = useState("");
  const [creatorAvatar, setCreatorAvatar] = useState("");
  const [creatorAvatarFile, setCreatorAvatarFile] = useState<File | null>(null);

  /* Reward */
  const [rewardAmount, setRewardAmount] = useState(100);
  const [totalBudget, setTotalBudget]   = useState(50000);
  const completions = Math.floor(totalBudget / rewardAmount);

  /* Verification */
  const [completionType, setCompletionType]         = useState<CompletionType>("listen_duration");
  const [requiredDuration, setRequiredDuration]     = useState(60);
  const [requiredPercentage, setRequiredPercentage] = useState(80);
  const [allowSkipping, setAllowSkipping]           = useState("no");
  const [countPaused, setCountPaused]               = useState("no");
  const [repeatLimit, setRepeatLimit]               = useState(1);

  /* Fetch stats */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/campaigns/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  /* Stats */
  const statCards = [
    { label: "Total Music",   value: stats.totalMusic.toString(),   icon: Music,       color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Total Video",   value: stats.totalVideo.toString(),   icon: Clapperboard, color: "text-red-400",    bg: "bg-red-500/10" },
    { label: "Active",        value: stats.active.toString(),        icon: Zap,          color: "text-teal-400",   bg: "bg-teal-500/10" },
    { label: "Completed",     value: stats.completed.toString(),     icon: CheckCircle,  color: "text-green-400",  bg: "bg-green-500/10" },
  ];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "info",    label: "Campaign Info",    icon: Layers },
    { id: "reward",  label: "Reward & Rules",   icon: Gift },
    { id: "preview", label: "Preview",          icon: Eye },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', campaignTitle);
      formData.append('description', description);
      formData.append('creatorName', creatorName);
      formData.append('platform', platform);
      formData.append('campaignType', campaignType);
      formData.append('mediaUrl', mediaUrl);
      formData.append('reward', rewardAmount.toString());
      formData.append('totalBudget', totalBudget.toString());
      formData.append('completionType', completionType);
      if (requiredDuration) formData.append('requiredDuration', requiredDuration.toString());
      if (requiredPercentage) formData.append('requiredPercentage', requiredPercentage.toString());
      formData.append('allowSkipping', allowSkipping);
      formData.append('countPaused', countPaused);
      formData.append('repeatLimit', repeatLimit.toString());
      formData.append('status', status);
      if (thumbnailUrl) formData.append('thumbnailUrl', thumbnailUrl);
      if (creatorAvatarFile) {
        formData.append('avatarFile', creatorAvatarFile);
      } else if (creatorAvatar) {
        formData.append('creatorAvatar', creatorAvatar);
      }

      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success("Campaign saved successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save campaign");
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast.error("Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  const previewProps = { campaignTitle, description, creatorName, platform, rewardAmount, completionType, requiredDuration, requiredPercentage, thumbnailUrl };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">

          {/* ── Page Header ── */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                {/* <Zap className="w-5 h-5 text-primary" /> */}
                Campaign Builder
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
                <Layers className="w-3 h-3 text-primary" />
                Create & Manage Engagement Campaigns
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-full border ${statusColors[status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-teal-400 animate-pulse" : "bg-current"}`} />
                {status}
              </span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full lg:w-auto flex justify-center text-center items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Campaign"}
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <div key={i} className="bg-card px-5 py-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                </div>
                <p className="text-2xl font-black text-foreground mb-1">{card.value}</p>
                <h4 className="text-muted-foreground text-xs font-medium">{card.label}</h4>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-2 mb-6 border-b border-border pb-0 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════ TAB: INFO ══════════════ */}
          {activeTab === "info" && (
            <>
              {/* ── Campaign Type: Music / Video only ── */}
              <SectionCard title="Campaign Type" subtitle="Choose the type of content you want to promote">
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  {([
                    { value: "music", label: "Music",  icon: Music,       desc: "Audio tracks & singles" },
                    { value: "video", label: "Video",  icon: Clapperboard, desc: "Music videos & clips" },
                  ] as { value: CampaignType; label: string; icon: any; desc: string }[]).map((ct) => (
                    <button
                      key={ct.value}
                      onClick={() => setCampaignType(ct.value)}
                      className={`flex flex-col items-start gap-3 p-5 rounded-2xl border-2 transition-all text-left ${
                        campaignType === ct.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${campaignType === ct.value ? "bg-primary/20" : "bg-muted"}`}>
                        <ct.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-wider">{ct.label}</p>
                        <p className={`text-[10px] mt-0.5 ${campaignType === ct.value ? "text-primary/70" : "text-muted-foreground"}`}>{ct.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </SectionCard>

              {/* ── Platform: logo images ── */}
              <SectionCard title="Platform" subtitle="Select the streaming platform for this campaign">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(Object.entries(platformLogos) as [Platform, typeof platformLogos[Platform]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setPlatform(key)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${
                        platform === key
                          ? `border-primary bg-primary/5 ring-2 ${cfg.ring}`
                          : "border-border hover:border-primary/30 hover:bg-card"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                        platform === key ? "border-primary/40 scale-105" : "border-border group-hover:border-primary/20"
                      }`}>
                        <img
                          src={cfg.src}
                          alt={cfg.label}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${platform === key ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {cfg.label}
                      </span>
                    </button>
                  ))}
                </div>
              </SectionCard>

              {/* ── Campaign Details + Media Info ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Details */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Campaign Details</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Title and description shown to users</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <Label required>Campaign Title</Label>
                      <Input value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} placeholder="Listen to my new single" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Listen for 60 seconds and earn rewards." />
                    </div>
                    <div>
                      <Label required>Status</Label>
                      <Select value={status} onChange={(v) => setStatus(v as CampaignStatus)}>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Media Information */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Media Information</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Link to the media and creator details</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <Label required>Media URL</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          placeholder={
                            platform === "youtube"   ? "https://www.youtube.com/watch?v=..." :
                            platform === "spotify"   ? "https://open.spotify.com/track/..." :
                            platform === "audiomack" ? "https://audiomack.com/..." :
                            "https://music.apple.com/..."
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Creator / Artist Name</Label>
                      <Input value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="Davido" />
                    </div>

                    <div>
                      <Label>Thumbnail</Label>
                      <Toggle
                        value={thumbnailMode}
                        onChange={(v) => setThumbnailMode(v as "auto" | "upload")}
                        options={[{ label: "Auto-fetch", value: "auto" }, { label: "Upload", value: "upload" }]}
                      />
                      {thumbnailMode === "upload" && (
                        <div className="mt-3 border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 transition-colors">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Click to upload thumbnail</span>
                        </div>
                      )}
                      {thumbnailMode === "auto" && mediaUrl && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-teal-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Thumbnail will be auto-fetched from URL
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Creator Avatar <span className="text-muted-foreground font-normal normal-case">(Optional)</span></Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCreatorAvatarFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCreatorAvatar(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="creator-avatar-input"
                      />
                      <div
                        className="border-2 border-dashed border-border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
                        onClick={() => document.getElementById('creator-avatar-input')?.click()}
                      >
                        {creatorAvatar ? (
                          <img src={creatorAvatar} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">Upload creator photo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════════ TAB: REWARD & RULES ══════════════ */}
          {activeTab === "reward" && (
            <>
              <SectionCard title="Reward Settings" subtitle="Define points per completion and total campaign budget">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label required>Reward Per Completion</Label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                      <Input type="number" value={rewardAmount} onChange={(e) => setRewardAmount(Number(e.target.value))} className="pl-10" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{rewardAmount.toLocaleString()} Points per user</p>
                  </div>

                  <div>
                    <Label required>Total Campaign Budget</Label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <Input type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} className="pl-10" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{totalBudget.toLocaleString()} Points total</p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">System Calculates</p>
                    <p className="text-2xl font-black text-primary">{completions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">completions available</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Verification Rules" subtitle="Define how completions are validated — critical for campaign integrity">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label required>Required Completion Type</Label>
                    <Select value={completionType} onChange={(v) => setCompletionType(v as CompletionType)}>
                      {campaignType === "video" ? (
                        <>
                          <option value="watch_duration">Watch Duration</option>
                          <option value="watch_percentage">Watch Percentage</option>
                        </>
                      ) : (
                        <>
                          <option value="listen_duration">Listen Duration</option>
                          <option value="listen_percentage">Listen Percentage</option>
                        </>
                      )}
                    </Select>
                  </div>

                  {(completionType === "watch_duration" || completionType === "listen_duration") ? (
                    <div>
                      <Label required>Required Duration (seconds)</Label>
                      <Input type="number" value={requiredDuration} onChange={(e) => setRequiredDuration(Number(e.target.value))} placeholder="60" />
                      <p className="text-[10px] text-muted-foreground mt-1">Users must {campaignType === "video" ? "watch" : "listen"} for {requiredDuration}s</p>
                    </div>
                  ) : (
                    <div>
                      <Label required>Required Percentage (%)</Label>
                      <Input type="number" value={requiredPercentage} onChange={(e) => setRequiredPercentage(Number(e.target.value))} placeholder="80" min={1} max={100} />
                      <p className="text-[10px] text-muted-foreground mt-1">Users must complete {requiredPercentage}% of the {campaignType}</p>
                    </div>
                  )}

                  <div>
                    <Label>Allow Skipping</Label>
                    <Toggle value={allowSkipping} onChange={setAllowSkipping} options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
                  </div>

                  <div>
                    <Label>Count Paused Time</Label>
                    <Toggle value={countPaused} onChange={setCountPaused} options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
                  </div>

                  <div>
                    <Label>Repeat Limit (per user)</Label>
                    <Input type="number" value={repeatLimit} onChange={(e) => setRepeatLimit(Number(e.target.value))} min={1} max={10} />
                    <p className="text-[10px] text-muted-foreground mt-1">{repeatLimit} completion{repeatLimit > 1 ? "s" : ""} per user max</p>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-yellow-400 mb-1">Active Rule Summary</p>
                      <p className="text-xs text-muted-foreground">
                        Users must <strong className="text-foreground">{completionType.replace("_", " ")}</strong> of{" "}
                        <strong className="text-foreground">{completionType.includes("duration") ? `${requiredDuration}s` : `${requiredPercentage}%`}</strong>.
                        Skipping is <strong className="text-foreground">{allowSkipping === "yes" ? "allowed" : "not allowed"}</strong>.
                        Paused time <strong className="text-foreground">{countPaused === "yes" ? "counts" : "does not count"}</strong>.
                        Limit: <strong className="text-foreground">{repeatLimit}x per user</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {/* ══════════════ TAB: PREVIEW ══════════════ */}
          {activeTab === "preview" && (
            <>
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">Campaign Preview</h2>
                <p className="text-xs text-muted-foreground">This is exactly what users will see.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-violet-500/10"><Music className="w-3.5 h-3.5 text-violet-400" /></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Music Card</span>
                  </div>
                  <MusicPreviewCard {...previewProps} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-red-500/10"><Clapperboard className="w-3.5 h-3.5 text-red-400" /></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Video Card</span>
                  </div>
                  <VideoPreviewCard {...previewProps} />
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default CampaignPage;