'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import {
  Layers,
  Gift,
  Eye,
  Save,
  Upload,
  CheckCircle,
  Edit,
  Music,
  Video,
  Coins,
} from "lucide-react";

type Platform = "youtube" | "spotify" | "audiomack" | "apple_music";
type CampaignType = "music" | "video";
type CompletionType = "watch_duration" | "watch_percentage" | "listen_duration" | "listen_percentage";
type CampaignStatus = "draft" | "active" | "paused" | "completed";
type Tab = "info" | "reward" | "preview";

interface CampaignData {
  title: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  platform: Platform;
  campaignType: CampaignType;
  mediaUrl: string;
  thumbnailMode: "auto" | "upload";
  thumbnailUrl: string;
  reward: number;
  totalBudget: number;
  completionType: CompletionType;
  requiredDuration: number;
  requiredPercentage: number;
  allowSkipping: string;
  countPaused: string;
  repeatLimit: number;
  status: CampaignStatus;
}

const EditCampaignPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const [campaign, setCampaign] = useState<CampaignData>({
    title: "",
    description: "",
    creatorName: "",
    creatorAvatar: "",
    platform: "youtube",
    campaignType: "video",
    mediaUrl: "",
    thumbnailMode: "auto",
    thumbnailUrl: "",
    reward: 100,
    totalBudget: 50000,
    completionType: "watch_duration",
    requiredDuration: 60,
    requiredPercentage: 80,
    allowSkipping: "no",
    countPaused: "no",
    repeatLimit: 1,
    status: "draft",
  });

  const [creatorAvatarFile, setCreatorAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/admin/campaigns/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCampaign({
            title: data.campaign.title,
            description: data.campaign.description,
            creatorName: data.campaign.creatorName,
            creatorAvatar: data.campaign.creatorAvatar || "",
            platform: data.campaign.platform,
            campaignType: data.campaign.campaignType,
            mediaUrl: data.campaign.mediaUrl,
            thumbnailMode: "auto",
            thumbnailUrl: data.campaign.thumbnailUrl || "",
            reward: data.campaign.reward,
            totalBudget: data.campaign.totalBudget,
            completionType: data.campaign.completionType,
            requiredDuration: data.campaign.requiredDuration || 60,
            requiredPercentage: data.campaign.requiredPercentage || 80,
            allowSkipping: data.campaign.allowSkipping ? "yes" : "no",
            countPaused: data.campaign.countPaused ? "yes" : "no",
            repeatLimit: data.campaign.repeatLimit || 1,
            status: data.campaign.status,
          });
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', campaign.title);
      formData.append('description', campaign.description);
      formData.append('creatorName', campaign.creatorName);
      formData.append('platform', campaign.platform);
      formData.append('campaignType', campaign.campaignType);
      formData.append('mediaUrl', campaign.mediaUrl);
      formData.append('reward', campaign.reward.toString());
      formData.append('totalBudget', campaign.totalBudget.toString());
      formData.append('completionType', campaign.completionType);
      formData.append('requiredDuration', campaign.requiredDuration.toString());
      formData.append('requiredPercentage', campaign.requiredPercentage.toString());
      formData.append('allowSkipping', campaign.allowSkipping);
      formData.append('countPaused', campaign.countPaused);
      formData.append('repeatLimit', campaign.repeatLimit.toString());
      formData.append('status', campaign.status);
      if (campaign.thumbnailUrl) formData.append('thumbnailUrl', campaign.thumbnailUrl);
      if (creatorAvatarFile) {
        formData.append('avatarFile', creatorAvatarFile);
      } else if (campaign.creatorAvatar) {
        formData.append('creatorAvatar', campaign.creatorAvatar);
      }

      const response = await fetch(`/api/admin/campaigns/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Campaign updated successfully!');
        router.push('/admin-dashboard/edit-campaigns');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update campaign');
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading campaign...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
                <Edit className="w-5 h-5 text-primary" />
                Edit Campaign
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Update campaign details and settings
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "info" as Tab, label: "Campaign Info", icon: Layers },
              { id: "reward" as Tab, label: "Reward & Rules", icon: Gift },
              { id: "preview" as Tab, label: "Preview", icon: Eye },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-card border border-border rounded-2xl p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Campaign Title</label>
                  <input
                    type="text"
                    value={campaign.title}
                    onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    placeholder="Enter campaign title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={campaign.description}
                    onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none min-h-[120px]"
                    placeholder="Enter campaign description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Platform</label>
                    <select
                      value={campaign.platform}
                      onChange={(e) => setCampaign({ ...campaign, platform: e.target.value as Platform })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="spotify">Spotify</option>
                      <option value="audiomack">Audiomack</option>
                      <option value="apple_music">Apple Music</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Campaign Type</label>
                    <select
                      value={campaign.campaignType}
                      onChange={(e) => setCampaign({ ...campaign, campaignType: e.target.value as CampaignType })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    >
                      <option value="music">Music</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Media URL</label>
                  <input
                    type="text"
                    value={campaign.mediaUrl}
                    onChange={(e) => setCampaign({ ...campaign, mediaUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    placeholder="Enter YouTube, Spotify, or other platform URL"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Creator Name</label>
                    <input
                      type="text"
                      value={campaign.creatorName}
                      onChange={(e) => setCampaign({ ...campaign, creatorName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                      placeholder="Enter creator name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Creator Avatar (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCreatorAvatarFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCampaign({ ...campaign, creatorAvatar: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select
                    value={campaign.status}
                    onChange={(e) => setCampaign({ ...campaign, status: e.target.value as CampaignStatus })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "reward" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Reward Per Completion</label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
                      <input
                        type="number"
                        value={campaign.reward}
                        onChange={(e) => setCampaign({ ...campaign, reward: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Total Budget</label>
                    <input
                      type="number"
                      value={campaign.totalBudget}
                      onChange={(e) => setCampaign({ ...campaign, totalBudget: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Completion Type</label>
                  <select
                    value={campaign.completionType}
                    onChange={(e) => setCampaign({ ...campaign, completionType: e.target.value as CompletionType })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    <option value="watch_duration">Watch Duration</option>
                    <option value="watch_percentage">Watch Percentage</option>
                    <option value="listen_duration">Listen Duration</option>
                    <option value="listen_percentage">Listen Percentage</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Required Duration (seconds)</label>
                    <input
                      type="number"
                      value={campaign.requiredDuration}
                      onChange={(e) => setCampaign({ ...campaign, requiredDuration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Required Percentage (%)</label>
                    <input
                      type="number"
                      value={campaign.requiredPercentage}
                      onChange={(e) => setCampaign({ ...campaign, requiredPercentage: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Allow Skipping</label>
                    <select
                      value={campaign.allowSkipping}
                      onChange={(e) => setCampaign({ ...campaign, allowSkipping: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Count Paused Time</label>
                    <select
                      value={campaign.countPaused}
                      onChange={(e) => setCampaign({ ...campaign, countPaused: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Repeat Limit</label>
                    <input
                      type="number"
                      value={campaign.repeatLimit}
                      onChange={(e) => setCampaign({ ...campaign, repeatLimit: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="space-y-6">
                <div className="bg-background border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Campaign Preview</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Title:</span>
                      <p className="text-sm font-semibold">{campaign.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Description:</span>
                      <p className="text-sm">{campaign.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Creator:</span>
                      <p className="text-sm font-semibold">{campaign.creatorName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Platform:</span>
                      <p className="text-sm font-semibold capitalize">{campaign.platform}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Reward:</span>
                      <p className="text-sm font-semibold">+{campaign.reward} points</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <p className="text-sm font-semibold capitalize">{campaign.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCampaignPage;
