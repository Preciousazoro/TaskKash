'use client';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import {
  Music,
  Video,
  ListMusic,
  Layers,
  Play,
  Clock,
  CheckCircle,
  CheckCircle2,
  Star,
  Gift,
  Filter,
  Search,
  Coins,
  TrendingUp,
  Zap,
  ChevronRight,
  ListTodo,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
type Platform = "youtube" | "spotify" | "soundcloud" | "audiomack" | "apple_music";
type CampaignType = "music" | "video" | "playlist" | "bundle";
type TaskStatus = "available" | "in_progress" | "completed";

interface Campaign {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  creatorAvatar?: string;
  platform: Platform;
  campaignType: CampaignType;
  thumbnail?: string;
  thumbnailUrl?: string;
  reward: number;
  requiredDuration?: number;
  requiredPercentage?: number;
  completionType: "listen_duration" | "listen_percentage" | "watch_duration" | "watch_percentage";
  status: TaskStatus;
  progress?: number; // 0-100
  secondsCompleted?: number;
}

/* ─── Platform logos ─────────────────────────────────────── */
const platformLogos: Record<Platform, { src: string; label: string; ring: string }> = {
  youtube:     { src: "https://i.postimg.cc/dtmHW4Yf/Youtube.jpg",    label: "YouTube",     ring: "ring-red-500/40" },
  spotify:     { src: "https://i.postimg.cc/6QzM93qN/Spotify.jpg",    label: "Spotify",     ring: "ring-green-500/40" },
  audiomack:   { src: "https://i.postimg.cc/J0s6YLRN/audiomack.jpg",  label: "Audiomack",   ring: "ring-yellow-500/40" },
  apple_music: { src: "https://i.postimg.cc/fLG2PPyP/i-Tunes.jpg",    label: "Apple Music", ring: "ring-pink-500/40" },
  soundcloud:  { src: "https://i.postimg.cc/6QzM93qN/Spotify.jpg",    label: "SoundCloud",  ring: "ring-orange-500/40" },
};

/* ─── Mock data ──────────────────────────────────────────── */
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    title: "Listen to Davido's New Single",
    description: "Stream the new Afrobeats hit and earn points instantly.",
    creatorName: "Davido",
    platform: "spotify",
    campaignType: "music",
    reward: 100,
    requiredDuration: 60,
    completionType: "listen_duration",
    status: "available",
  },
  {
    id: "2",
    title: "Watch Burna Boy's Latest Video",
    description: "Watch the official music video and claim your reward.",
    creatorName: "Burna Boy",
    platform: "youtube",
    campaignType: "video",
    reward: 150,
    requiredPercentage: 80,
    completionType: "watch_percentage",
    status: "in_progress",
    progress: 45,
  },
  {
    id: "3",
    title: "Stream Wizkid's EP Playlist",
    description: "Listen to 3 tracks from the new EP for big rewards.",
    creatorName: "Wizkid",
    platform: "audiomack",
    campaignType: "playlist",
    reward: 250,
    requiredDuration: 120,
    completionType: "listen_duration",
    status: "available",
  },
  {
    id: "4",
    title: "Asake — New Track Promo",
    description: "Give the latest Asake release a proper listen.",
    creatorName: "Asake",
    platform: "spotify",
    campaignType: "music",
    reward: 80,
    requiredDuration: 45,
    completionType: "listen_duration",
    status: "completed",
    progress: 100,
    secondsCompleted: 45,
  },
  {
    id: "5",
    title: "Rema — SoundCloud Exclusive",
    description: "Exclusive pre-release stream. First 1,000 listeners earn double.",
    creatorName: "Rema",
    platform: "soundcloud",
    campaignType: "music",
    reward: 200,
    requiredDuration: 90,
    completionType: "listen_duration",
    status: "available",
  },
  {
    id: "6",
    title: "Ayra Starr — Watch Full Video",
    description: "Complete the visual experience for the new release.",
    creatorName: "Ayra Starr",
    platform: "youtube",
    campaignType: "video",
    reward: 120,
    requiredPercentage: 75,
    completionType: "watch_percentage",
    status: "available",
  },
];

/* ─── Helpers ────────────────────────────────────────────── */
const platformConfig: Record<Platform, { label: string; emoji: string; color: string; bg: string }> = {
  youtube:     { label: "YouTube",     emoji: "▶",  color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
  spotify:     { label: "Spotify",     emoji: "♫",  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  soundcloud:  { label: "SoundCloud",  emoji: "☁",  color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  audiomack:   { label: "Audiomack",   emoji: "♪",  color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  apple_music: { label: "Apple Music", emoji: "♩",  color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/20" },
};

const statusConfig: Record<TaskStatus, { label: string; color: string; dotColor: string }> = {
  available:   { label: "Available",   color: "bg-teal-500/10 text-teal-400 border-teal-500/20",   dotColor: "bg-teal-400" },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border-blue-500/20",   dotColor: "bg-blue-400 animate-pulse" },
  completed:   { label: "Completed",   color: "bg-purple-500/10 text-purple-400 border-purple-500/20", dotColor: "bg-purple-400" },
};

const typeIcon: Record<CampaignType, React.ElementType> = {
  music: Music, video: Video, playlist: ListMusic, bundle: Layers,
};

/* ─── Campaign Card ──────────────────────────────────────── */
const CampaignCard = ({ campaign, onStart }: { campaign: Campaign; onStart: (id: string) => void }) => {
  const platform = platformConfig[campaign.platform];
  const platformLogo = platformLogos[campaign.platform];
  const status = statusConfig[campaign.status];
  const TypeIcon = typeIcon[campaign.campaignType];
  const isDuration = campaign.completionType.includes("duration");

  const shortDesc = campaign.description.length > 50
    ? campaign.description.slice(0, 50) + "…"
    : campaign.description;

  const progressValue = campaign.progress ?? 0;
  const progressLabel = isDuration
    ? `${campaign.secondsCompleted ?? 0} / ${campaign.requiredDuration}s`
    : `${progressValue}%`;

  const progressBarColor =
    campaign.status === "completed"
      ? "bg-green-500"
      : campaign.status === "in_progress"
      ? "bg-blue-500"
      : "bg-primary";

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-900/60 to-blue-900/60 flex items-center justify-center overflow-hidden">
        {campaign.thumbnailUrl ? (
          <img src={campaign.thumbnailUrl} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <TypeIcon className="w-10 h-10" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm bg-black/40 border-white/10">
          <img src={platformLogo.src} alt={platformLogo.label} className="w-5 h-5 rounded-full" />
          {platformLogo.label}
        </div>

        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
          {status.label}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-yellow-500/30">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-black text-yellow-400">+{campaign.reward.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-black">
            {campaign.creatorName[0]}
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{campaign.creatorName}</span>
        </div>

        <h3 className="text-sm font-bold text-foreground mb-1 leading-snug group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1">{shortDesc}</p>

        <div className="bg-background border border-border rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">Requirement: </span>
            {isDuration
              ? `Listen for ${campaign.requiredDuration}s`
              : `Complete ${campaign.requiredPercentage}% of ${campaign.campaignType === "video" ? "video" : "track"}`}
          </span>
        </div>

        {/* Progress bar — shown for ALL statuses */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Progress</span>
            <span className="text-[10px] font-bold text-foreground">{progressLabel}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progressBarColor}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onStart(campaign.id)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
            campaign.status === "completed"
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : campaign.status === "in_progress"
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          <Play className="w-4 h-4" />
          {campaign.status === "completed" ? "Play Again" : campaign.status === "in_progress" ? "Resume Task" : "Start Task"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const UserTasksPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/user/campaigns');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data.campaigns);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.creatorName.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterPlatform !== "all" && c.platform !== filterPlatform) return false;
      if (filterType !== "all" && c.campaignType !== filterType) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      return true;
    });
  }, [search, filterPlatform, filterType, filterStatus, campaigns]);

  const stats = [
    { label: "Total Tasks", value: campaigns.length, icon: ListTodo, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total % Watched", value: `${campaigns.reduce((acc, c) => acc + (c.progress || 0), 0).toFixed(0)}%`, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Seconds", value: campaigns.reduce((acc, c) => acc + (c.secondsCompleted || 0), 0), icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Completed", value: campaigns.filter(c => c.status === "completed").length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
              Available Tasks
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-1">
              <Music className="w-3 h-3 text-primary" />
              Listen, watch, and earn points
            </p>
          </div>




          {/* Stats Grid */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link
              href="#"
              className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <ListTodo className="w-5 h-5 text-primary" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                {stats[0].value}
              </p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                {stats[0].label}
              </p>
            </Link>

            <Link
              href="#"
              className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                {stats[1].value}
              </p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                {stats[1].label}
              </p>
            </Link>

            <Link
              href="#"
              className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                {stats[2].value}
              </p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                {stats[2].label}
              </p>
            </Link>

            <Link
              href="#"
              className="bg-card border border-border px-5 py-3 rounded-2xl group hover:border-primary transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter mb-1">
                {stats[3].value}
              </p>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                {stats[3].label}
              </p>
            </Link>
          </section>




          {/* Filters Container */}
<div className="flex flex-col gap-3 mb-6 w-full">
  
  {/* Row Wrapper - Combines Search & Selectors Adaptively */}
  <div className="flex flex-col lg:flex-row gap-3 w-full">
    
    {/* Search Input Box */}
    <div className="relative flex-1 w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search campaigns or creators…"
        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors shadow-sm"
      />
    </div>

    {/* Selectors Grid: Splits 3-wide on small screens, adjusts cleanly on large desktops */}
    <div className="grid grid-cols-3 lg:flex gap-2 lg:gap-3 w-full lg:w-auto">
      
      {/* Platform Filter */}
      <div className="relative w-full">
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="w-full bg-card border border-border rounded-lg pl-3 pr-8 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none shadow-sm cursor-pointer truncate"
        >
          <option value="all">Platforms</option> {/* Shortened mobile placeholder */}
          <option value="spotify">Spotify</option>
          <option value="youtube">YouTube</option>
          <option value="soundcloud">SoundCloud</option>
          <option value="audiomack">Audiomack</option>
        </select>
        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none opacity-80" />
      </div>

      {/* Type Filter */}
      <div className="relative w-full">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full bg-card border border-border rounded-lg pl-3 pr-8 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none shadow-sm cursor-pointer truncate"
        >
          <option value="all">Types</option> {/* Shortened mobile placeholder */}
          <option value="music">Music</option>
          <option value="video">Video</option>
          <option value="playlist">Playlist</option>
        </select>
        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none opacity-80" />
      </div>

      {/* Status Filter */}
      <div className="relative w-full">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full bg-card border border-border rounded-lg pl-3 pr-8 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none shadow-sm cursor-pointer truncate"
        >
          <option value="all">Status</option> {/* Shortened mobile placeholder */}
          <option value="available">Available</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none opacity-80" />
      </div>

    </div>
  </div>
</div>



          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            Showing <span className="text-foreground font-bold">{filtered.length}</span> of {campaigns.length} campaigns
          </p>

          {/* Campaign grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Music className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm font-black uppercase tracking-tighter mb-2">No campaigns found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((c) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onStart={(id) => router.push(`/user-dashboard/campaign-center/${id}`)}
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default UserTasksPage;