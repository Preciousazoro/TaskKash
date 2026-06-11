"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Pencil,
  Save,
  User,
  X,
  Upload,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Bell,
  ChevronDown,
} from "lucide-react";
import { toast } from 'react-toastify';

// Import your navigation components
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import { useApi, useApiCall } from "@/hooks/useApi";
import ProfileSkeleton from "@/components/LoadingSkeleton/ProfileSkeleton";

// UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SocialMedia = {
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
  discord?: string | null;
};

type UserProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  image?: string | null;
  avatarPublicId?: string | null;
  points?: number;
  dailyStreak?: number;
  socialMedia?: SocialMedia;
  phone?: string | null;
  telegramUsername?: string | null;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { fetchWithCache } = useApi();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "",
    username: "",
    email: "",
    role: "user",
    image: null,
    avatarPublicId: null,
    points: 0,
    dailyStreak: 0,
    socialMedia: {
      twitter: null,
      instagram: null,
      linkedin: null,
      facebook: null,
      whatsapp: null,
      tiktok: null,
      telegram: null,
      discord: null,
    },
    phone: null,
    telegramUsername: null,
  });

  const [editableUser, setEditableUser] = useState<UserProfile>(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [usernameWarning, setUsernameWarning] = useState<string | null>(null);

  const SOCIAL_PLATFORMS = [
    { key: 'twitter' as const, name: 'X (Twitter)', icon: '/x.jpg', symbol: 'X' },
    { key: 'instagram' as const, name: 'Instagram', icon: '/instagram.jpg', symbol: 'IG' },
    { key: 'linkedin' as const, name: 'LinkedIn', icon: '/linked in.jpg', symbol: 'LI' },
    { key: 'facebook' as const, name: 'Facebook', icon: '/facebook.jpg', symbol: 'FB' },
    { key: 'whatsapp' as const, name: 'WhatsApp', icon: '/whatsapp.jpg', symbol: 'WA' },
    { key: 'tiktok' as const, name: 'TikTok', icon: '/tiktok.jpg', symbol: 'TT' },
    { key: 'telegram' as const, name: 'Telegram', icon: '/telegram.jpg', symbol: 'TG' },
    { key: 'discord' as const, name: 'Discord', icon: '/discord.jpg', symbol: 'DC' },
  ];

  // Generate username helper function
  const generateUsername = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomNum = Math.floor(Math.random() * 9999);
    return `${cleanName}_${randomNum}`;
  };

  // Fetch user profile from API with caching
  const fetchProfile = useApiCall(async () => {
    try {
      const data = await fetchWithCache('/api/profile', {}, { cacheTTL: 300000 }); // 5 minutes cache
      
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        image: data.avatarUrl,
        avatarPublicId: data.avatarPublicId,
        points: data.taskPoints,
        dailyStreak: data.dailyStreak || 0,
        socialMedia: data.socialLinks || {
          twitter: null,
          instagram: null,
          linkedin: null,
          facebook: null,
          whatsapp: null,
          tiktok: null,
          telegram: null,
          discord: null,
        },
        phone: data.phone || null,
        telegramUsername: data.telegramUsername || null,
      };
      
      setUser(userProfile);
      setEditableUser(userProfile);
      setAvatarPreview(data.avatarUrl || null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
      setIsLoading(false);
    }
  }, [], { cacheKey: 'user-profile' });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to server
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setAvatarPreview(data.url);
      setEditableUser({ ...editableUser, image: data.url, avatarPublicId: data.publicId });
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      // Revert to original image on error
      setAvatarPreview(user.image || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Client-side validation - username is optional
      if (editableUser.username && editableUser.username.trim().length > 0) {
        if (editableUser.username.length < 3) {
          throw new Error('Username should be at least 3 characters long');
        }
        
        if (editableUser.username.length > 20) {
          throw new Error('Username cannot be more than 20 characters');
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(editableUser.username)) {
          throw new Error('Username can only contain letters, numbers, and underscores');
        }
        setUsernameWarning(null);
      } else {
        // Username is empty - show warning but allow saving
        setUsernameWarning('Please set a username (required for public profile)');
      }

      // Log what we're sending
      console.log('Saving profile with data:', {
        name: editableUser.name,
        username: editableUser.username,
        socialLinks: editableUser.socialMedia,
        phone: editableUser.phone,
        telegramUsername: editableUser.telegramUsername,
      });

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editableUser.name,
          username: editableUser.username,
          avatarUrl: avatarPreview,
          avatarPublicId: editableUser.avatarPublicId,
          socialLinks: editableUser.socialMedia,
          phone: editableUser.phone,
          telegramUsername: editableUser.telegramUsername,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details ? errorData.details.join(', ') : (errorData.error || 'Failed to update profile');
        throw new Error(errorMessage);
      }
      
      const updatedData = await response.json();
      
      const updatedProfile: UserProfile = {
        id: updatedData.id,
        name: updatedData.name,
        username: updatedData.username,
        email: updatedData.email,
        role: updatedData.role,
        image: updatedData.avatarUrl,
        avatarPublicId: updatedData.avatarPublicId,
        points: updatedData.taskPoints,
        socialMedia: updatedData.socialLinks || {
            twitter: null,
            instagram: null,
            linkedin: null,
            facebook: null,
            whatsapp: null,
            tiktok: null,
            telegram: null,
            discord: null,
          },
        phone: updatedData.phone || null,
        telegramUsername: updatedData.telegramUsername || null,
      };
      
      setUser(updatedProfile);
      setEditableUser(updatedProfile);
      setIsEditing(false);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditableUser(user);
    setAvatarPreview(user.image || null);
    setIsEditing(false);
  };

  const handleSocialLinkChange = (platform: keyof SocialMedia, value: string) => {
    setEditableUser({
      ...editableUser,
      socialMedia: {
        ...editableUser.socialMedia,
        [platform]: value || null,
      },
    });
  };

  const handleSocialLinkClick = (url: string | null) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* 1. SIDEBAR */}
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 2. HEADER */}
        <UserHeader />




        {/* 3. SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-[300px_1fr] gap-8">
              
              {/* PROFILE CARD (LEFT) */}
<aside className="space-y-5">
  <div className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
    
    {/* Avatar Wrapper Container */}
    <div className="relative w-full h-65 mx-auto group">
      
      {/* Image Container Block */}
      <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-green-500 shadow-lg relative">
        {avatarPreview ? (
          <Image
            src={avatarPreview}
            alt="avatar"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500 to-blue-600">
            <User className="text-white w-14 h-14" />
          </div>
        )}
      </div>

      {/* Upload Trigger Button - Positioned exactly at the bottom-right relative to the image */}
      {isEditing && (
        <label className="absolute bottom-2 right-2 z-20 cursor-pointer bg-green-500 p-2 rounded-lg shadow-md hover:scale-110 transition-transform border border-background">
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-white" />
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>

    <div className="flex flex-wrap mt-2 items-center justify-between gap-4 w-full">
      <h3 className="text-xl font-bold">{user.name}</h3>
      <p className="text-sm text-muted-foreground capitalize font-medium">
        Role: {user.role}
      </p>
    </div>

    <div className="mt-5 p-4 bg-muted/50 rounded-xl border border-border">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Task Points
      </p>
      <p className="font-black text-xl text-green-500">{user.points} TP</p>
    </div>

    <div className="flex flex-wrap justify-center gap-2 mt-5">
      {SOCIAL_PLATFORMS.map((platform) => {
        const url = user.socialMedia?.[platform.key] || null;
        return (
          <button
            key={platform.key}
            onClick={() => handleSocialLinkClick(url)}
            className={`transition-all duration-200 cursor-pointer ${
              url
                ? 'opacity-100 text-foreground hover:opacity-80'
                : 'grayscale opacity-35 cursor-not-allowed'
            }`}
            title={url ? `Open ${platform.name}` : `No ${platform.name} link`}
            disabled={!url}
          >
            <img 
              src={platform.icon} 
              alt={platform.name} 
              className="w-10 h-10 rounded-full object-cover" 
            />
          </button>
        );
      })}
    </div>
  </div>
</aside>






              {/* PROFILE FORM (RIGHT) */}
<div className="bg-card border border-border rounded-3xl p-5 lg:p-7 shadow-sm">
  {/* Header Section */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
    <div className="space-y-1">
      <h1 className="text-2xl font-black uppercase tracking-tighter">Profile Settings</h1>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Manage your public profile and account details
      </p>
    </div>

    {!isEditing ? (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full text-base sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-all cursor-pointer hover:bg-green-500/90"
      >
        Edit Profile
      </button>
    ) : (
      <div className="flex w-full sm:w-auto gap-3">
        <button
          onClick={handleCancel}
          className="w-1/2 sm:w-auto px-4 py-2 border border-border rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-muted transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Update
            </>
          )}
        </button>
      </div>
    )}
  </div>

  {/* Form Core Fields */}
  <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
    
    {/* Full Name Section */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        Full Name
      </label>
      {isEditing ? (
        <input
          value={editableUser.name}
          onChange={(e) =>
            setEditableUser({ ...editableUser, name: e.target.value })
          }
          className="w-full p-3 bg-muted/50 border border-border rounded-lg focus:ring-2 ring-green-500/20 outline-none transition-all text-sm font-medium"
        />
      ) : (
        <p className="p-3 bg-muted/30 rounded-lg border border-border font-medium text-sm text-foreground">
          {user.name}
        </p>
      )}
    </div>

    {/* Username Section */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        Username
      </label>
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={editableUser.username}
              onChange={(e) =>
                setEditableUser({ ...editableUser, username: e.target.value })
              }
              placeholder="Enter username (optional)"
              className="flex-1 p-3 bg-muted/50 border border-border rounded-lg focus:ring-2 ring-green-500/20 outline-none transition-all text-sm font-medium"
            />
            {!editableUser.username && (
              <button
                type="button"
                onClick={() => setEditableUser({ ...editableUser, username: generateUsername(editableUser.name) })}
                className="px-3 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-500/90 transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Generate
              </button>
            )}
          </div>
          {usernameWarning && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
              <span>⚠️</span>
              {usernameWarning}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <p className="p-3 bg-muted/30 rounded-lg border border-border font-medium text-sm text-foreground">
            @{user.username || 'Not set'}
          </p>
          {!user.username && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium flex items-center gap-1 ml-1">
              <span>⚠️</span> Username not set - required for public profile
            </p>
          )}
        </div>
      )}
    </div>

    {/* Email Address */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        Email Address
      </label>
      <p className="p-3 bg-muted/10 rounded-lg border border-dashed border-border text-muted-foreground text-sm font-medium">
        {user.email}
      </p>
    </div>

    {/* User ID */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        User ID
      </label>
      <p className="p-3 py-4 bg-muted/10 rounded-lg border border-dashed border-border font-mono text-xs text-muted-foreground">
        {user.id}
      </p>
    </div>

    {/* Phone Number */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        Phone Number
      </label>
      {isEditing ? (
        <input
          value={editableUser.phone || ''}
          onChange={(e) =>
            setEditableUser({ ...editableUser, phone: e.target.value })
          }
          placeholder="+1234567890"
          className="w-full p-3 bg-muted/50 border border-border rounded-lg focus:ring-2 ring-green-500/20 outline-none transition-all text-sm font-medium"
        />
      ) : (
        <p className="p-3 bg-muted/30 rounded-lg border border-border font-medium text-sm text-foreground">
          {user.phone || 'Not set'}
        </p>
      )}
    </div>

    {/* Telegram Username */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        Telegram Username
      </label>
      {isEditing ? (
        <input
          value={editableUser.telegramUsername || ''}
          onChange={(e) =>
            setEditableUser({ ...editableUser, telegramUsername: e.target.value })
          }
          placeholder="@username"
          className="w-full p-3 bg-muted/50 border border-border rounded-lg focus:ring-2 ring-green-500/20 outline-none transition-all text-sm font-medium"
        />
      ) : (
        <p className="p-3 bg-muted/30 rounded-lg border border-border font-medium text-sm text-foreground">
          {user.telegramUsername || 'Not set'}
        </p>
      )}
    </div>

    {/* Social Media Links Section */}
    <div className="md:col-span-2 space-y-6 pt-6 border-t border-border">
      <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
        <Bell className="w-4 h-4 text-green-500" /> Social Media Links
      </h3>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.key} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <img src={platform.icon} alt={platform.name} className="w-5 h-5 rounded-md" /> {platform.name}
              </label>
              <input
                value={editableUser.socialMedia?.[platform.key] || ''}
                onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                placeholder={`https://${platform.name.toLowerCase()}.com/username`}
                className="w-full p-3 bg-muted/50 border border-border rounded-lg focus:ring-2 ring-green-500/20 outline-none transition-all text-sm"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const url = user.socialMedia?.[platform.key] || null;
            return (
              <div key={platform.key} className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4 transition-all hover:bg-muted/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-background border flex items-center justify-center shrink-0">
                    <img src={platform.icon} alt={platform.name} className="w-9 h-9 rounded-lg" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                      {platform.name}
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">({platform.symbol})</span>
                    </div>
                   <div className="font-mono text-[11px] text-muted-foreground truncate max-w-[180px]">
  {url || "No link added"}
</div>
                  </div>
                </div>
                {url && (
                  <button
                    onClick={() => handleSocialLinkClick(url)}
                    className="p-2 text-muted-foreground cursor-pointer hover:text-green-500 transition-colors shrink-0"
                    title={`Open ${platform.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
</div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}