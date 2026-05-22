"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import {
  User,
  Lock,
  Palette,
  Moon,
  Sun,
  ChevronDown,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  Loader2,
  Mail,
  Camera,
  Globe,
  Phone,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";

// Navigation
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserNav from "@/components/user-dashboard/UserNav";

// UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    userId: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Profile image
  const [profileImage, setProfileImage] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Member since
  const [memberSince, setMemberSince] = useState("");
  // User role
  const [userRole, setUserRole] = useState<string[]>([]);

  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    productUpdates: true,
    securityAlerts: true,
    taskNotifications: true,
    paymentNotifications: true,
  });

  // Social Media Links
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    instagram: "",
    linkedin: "",
    facebook: "",
  });
  const [showAddSocialForm, setShowAddSocialForm] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<keyof typeof socialLinks | null>(null);
  const [socialLinkValue, setSocialLinkValue] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  const SOCIAL_PLATFORMS = [
    { key: 'twitter' as const, name: 'X (Twitter)', icon: '/x.jpg', symbol: 'X' },
    { key: 'instagram' as const, name: 'Instagram', icon: '/instagram.jpg', symbol: 'IG' },
    { key: 'linkedin' as const, name: 'LinkedIn', icon: '/linked in.jpg', symbol: 'LI' },
    { key: 'facebook' as const, name: 'Facebook', icon: '/facebook.jpg', symbol: 'FB' },
  ];

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data) {
          setPersonalInfo({
            username: data.username || "",
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            country: data.country || "",
            userId: data.id || "",
          });
          setProfileImage(data.avatarUrl || "");
          setUserRole(data.role ? [data.role] : ["user"]);
          setSocialLinks(data.socialLinks || {
            twitter: "",
            instagram: "",
            linkedin: "",
            facebook: "",
          });
          setMemberSince(new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).toUpperCase());
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Save the avatarUrl to the user profile
        const profileResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avatarUrl: data.url,
            avatarPublicId: data.publicId || null,
          }),
        });

        const profileData = await profileResponse.json();

        if (profileData) {
          setProfileImage(data.url);
          toast.success('Profile image uploaded successfully');
        } else {
          toast.error('Failed to save profile image');
        }
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: personalInfo.username,
          name: personalInfo.name,
          phone: personalInfo.phone,
          country: personalInfo.country,
        }),
      });

      const data = await response.json();

      if (data) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };

  // Password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors([]);

    // Frontend validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErrors(['Please fill all fields']);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordErrors(['New password and confirmation do not match']);
      return;
    }

    const passwordValidationErrors = validatePassword(newPassword);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          setPasswordErrors([data.error]);
        } else {
          setPasswordErrors(['Failed to update password']);
        }
        return;
      }

      // Success
      toast.success('Password updated successfully');
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Log user out for security
      setTimeout(() => {
        signOut({ callbackUrl: '/auth/login' });
      }, 2000);
      
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordErrors(['Network error. Please try again.']);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Notification preferences update
  const handleNotificationToggle = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preference updated (local only)');
  };

  // Social Media Links functions
  const handleAddNewSocial = () => {
    setEditingPlatform(null);
    setSocialLinkValue("");
    setShowAddSocialForm(true);
  };

  const handleEditSocial = (platform: keyof typeof socialLinks) => {
    setEditingPlatform(platform);
    setSocialLinkValue(socialLinks[platform] || "");
    setShowAddSocialForm(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlatform) return;

    setIsSavingSocial(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialLinks: {
            ...socialLinks,
            [editingPlatform]: socialLinkValue || null,
          },
        }),
      });

      const data = await response.json();

      if (data) {
        setSocialLinks({
          ...socialLinks,
          [editingPlatform]: socialLinkValue || "",
        });
        toast.success('Social link saved successfully');
        setShowAddSocialForm(false);
        setEditingPlatform(null);
        setSocialLinkValue("");
      } else {
        toast.error('Failed to save social link');
      }
    } catch (error) {
      console.error('Error saving social link:', error);
      toast.error('Failed to save social link');
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleDeleteSocial = async (platform: keyof typeof socialLinks) => {
    setIsSavingSocial(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialLinks: {
            ...socialLinks,
            [platform]: null,
          },
        }),
      });

      const data = await response.json();

      if (data) {
        setSocialLinks({
          ...socialLinks,
          [platform]: "",
        });
        toast.success('Social link deleted successfully');
      } else {
        toast.error('Failed to delete social link');
      }
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Failed to delete social link');
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleCancelSocial = () => {
    setShowAddSocialForm(false);
    setEditingPlatform(null);
    setSocialLinkValue("");
  };

  const getExistingSocialLinks = () => {
    return SOCIAL_PLATFORMS.filter(platform => socialLinks[platform.key]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground">
                Profile & Settings
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
                  Manage your identity and preferences
                </p>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Identity */}
                {isLoading ? (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-2xl bg-muted animate-pulse" />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-muted rounded-xl animate-pulse" />
                      </div>
                      <div className="h-5 w-24 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-500" /> Identity
                    </h3>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-green-500 bg-muted shadow-2xl">
                          <img 
                            src={profileImage || "https://github.com/shadcn.png"} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2.5 rounded-xl cursor-pointer hover:bg-green-500/90 transition-colors shadow-lg">
                          {isUploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Camera className="w-5 h-5" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={isUploadingImage}
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-sm font-black uppercase">{personalInfo.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Legal Task Kash Member</p>
                    </div>
                  </div>
                )}

                {/* Account Status */}
                {isLoading ? (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 opacity-5">
                      <Shield className="w-24 h-24" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">Account Status</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Role</span>
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase border border-green-500/20">
                          {userRole.join(", ").toUpperCase() || "USER"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Verification</span>
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase border border-green-500/20">Verified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Member Since</span>
                        <span className="text-xs font-black">{memberSince || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-green-500" /> Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Dark Mode</p>
                    {mounted ? (
                      <button
                        onClick={toggleTheme}
                        className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${darkMode ? "bg-green-500" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${darkMode ? "translate-x-6" : "translate-x-1"}`}>
                          {darkMode ? <Moon className="w-3.5 h-3.5 text-black" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
                        </div>
                      </button>
                    ) : (
                      <div className="relative w-14 h-8 rounded-full border border-border bg-muted">
                        <div className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center translate-x-1">
                          <Sun className="w-3.5 h-3.5 text-yellow-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                {isLoading ? (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-1">
                          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                          <div className="h-10 w-full bg-muted rounded animate-pulse" />
                        </div>
                      ))}
                      <div className="md:col-span-2 pt-2">
                        <div className="h-11 w-full bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="bg-card rounded-2xl shadow-lg border border-border p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-500" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            name="username"
                            type="text"
                            value={personalInfo.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            name="name"
                            type="text"
                            value={personalInfo.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            name="email"
                            type="email"
                            value={personalInfo.email}
                            readOnly
                            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm cursor-not-allowed opacity-70"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            name="country"
                            type="text"
                            value={personalInfo.country}
                            onChange={handleInputChange}
                            placeholder="Enter your country"
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            name="phone"
                            type="tel"
                            value={personalInfo.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">User ID</label>
                        <div className="relative">
                          <input
                            name="userId"
                            type="text"
                            value={personalInfo.userId}
                            readOnly
                            placeholder="User ID"
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm cursor-not-allowed opacity-70 font-mono"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full md:w-full cursor-pointer bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-500/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                            </>
                          ) : (
                            "Update Profile"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Notifications */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Bell className="w-4 h-4 text-green-500" /> Notifications
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'productUpdates' as const, title: "Product updates", desc: "Emails about new features and tips" },
                      // { key: 'securityAlerts' as const, title: "Security alerts", desc: "Important account activity" },
                      { key: 'taskNotifications' as const, title: "Task notifications", desc: "Updates about your task submissions" },
                      // { key: 'paymentNotifications' as const, title: "Payment notifications", desc: "Updates about withdrawals and earnings" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4"
                      >
                        <div>
                          <div className="font-bold text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.desc}
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(item.key)}
                          className={`relative w-12 h-6 rounded-full cursor-pointer border transition-colors ${
                            notificationPreferences[item.key]
                              ? "bg-green-500 border-green-500"
                              : "bg-muted border-border"
                          }`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                            notificationPreferences[item.key] ? "translate-x-5" : "translate-x-0.5"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Bell className="w-4 h-4 text-green-500" /> Social Media Links
                    </h3>
                    {getExistingSocialLinks().length > 0 && (
                      <button
                        onClick={handleAddNewSocial}
                        className="flex items-center cursor-pointer gap-2 text-sm font-bold text-green-500 hover:text-green-500/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add New
                      </button>
                    )}
                  </div>

                  {/* Saved Social Links - Always Visible Icons */}
                  {getExistingSocialLinks().length > 0 && (
                    <div className="space-y-3 mb-8">
                      {getExistingSocialLinks().map((item) => (
                        <div key={item.key} className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center">
                              <img src={item.icon} alt={item.name} className="w-10 h-10 rounded-lg" />
                            </div>
                            <div>
                              <div className="font-bold text-sm flex items-center gap-2">
                                {item.name}
                                <span className="text-xs text-muted-foreground font-mono">({item.symbol})</span>
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">
                                {socialLinks[item.key]
                                  ? `${new URL(socialLinks[item.key]).origin}.....`
                                  : "No link added"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditSocial(item.key)}
                              className="p-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSocial(item.key)}
                              className="p-2 text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add / Edit Form */}
                  {showAddSocialForm && (
                    <form onSubmit={handleSaveSocial} className="space-y-5 border-t border-border pt-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Social Platform</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="w-full flex cursor-pointer items-center justify-between gap-3 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
                                  {editingPlatform ? (
                                    <img src={SOCIAL_PLATFORMS.find(p => p.key === editingPlatform)?.icon} alt="platform" className="w-7 h-7 rounded-lg" />
                                  ) : (
                                    <Bell className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <span className="font-bold">
                                  {editingPlatform ? SOCIAL_PLATFORMS.find(p => p.key === editingPlatform)?.name : 'Select a platform'}
                                </span>
                                {editingPlatform && (
                                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                                    ({SOCIAL_PLATFORMS.find(p => p.key === editingPlatform)?.symbol})
                                  </span>
                                )}
                              </div>
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full min-w-[240px]">
                            {SOCIAL_PLATFORMS.map((platform) => (
                              <DropdownMenuItem key={platform.key} onClick={() => setEditingPlatform(platform.key)} className="flex items-center gap-3 cursor-pointer">
                                <img src={platform.icon} alt={platform.name} className="w-7 h-7 rounded-lg" />
                                <span className="font-bold">{platform.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">({platform.symbol})</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {editingPlatform ? SOCIAL_PLATFORMS.find(p => p.key === editingPlatform)?.name : 'Platform'} URL
                        </label>
                        <div className="relative">
                          <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={socialLinkValue}
                            onChange={(e) => setSocialLinkValue(e.target.value)}
                            placeholder={`Enter ${editingPlatform ? SOCIAL_PLATFORMS.find(p => p.key === editingPlatform)?.name : 'platform'} URL`}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Make sure to double-check your URL. Links must be valid social media profile URLs.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isSavingSocial || !editingPlatform}
                          className="flex-1 bg-green-500 cursor-pointer text-white py-3 rounded-xl font-bold text-sm hover:bg-green-500/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSavingSocial ? (
                            <>
                              <Loader2 className="w-4 h-4 cursor-pointer animate-spin" /> Saving...
                            </>
                          ) : (
                            "Save Link"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelSocial}
                          className="flex-1 border border-border cursor-pointer py-3 rounded-xl font-bold text-sm hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {!showAddSocialForm && getExistingSocialLinks().length === 0 && (
                    <button
                      onClick={handleAddNewSocial}
                      className="w-full py-6 border border-dashed border-border rounded-2xl text-muted-foreground hover:text-foreground hover:border-green-500 transition-colors flex flex-col items-center gap-2"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="font-bold">Add your first social link</span>
                    </button>
                  )}
                </div>

                {/* Security */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" /> Security
                  </h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setPasswordErrors([]);
                          }}
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                          placeholder="Enter current password"
                          required
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordsMatch(e.target.value === confirmPassword);
                              setPasswordErrors([]);
                            }}
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none"
                            placeholder="Enter new password"
                            required
                            minLength={8}
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Min 8 chars with at least one number</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordsMatch(newPassword === e.target.value);
                              setPasswordErrors([]);
                            }}
                            className={`w-full bg-muted/30 border ${confirmPassword ? (passwordsMatch ? "border-border" : "border-destructive") : "border-border"} rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none`}
                            placeholder="Confirm new password"
                            required
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                          <p className="text-[10px] font-bold text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> Passwords don&apos;t match
                          </p>
                        )}
                      </div>
                    </div>

                    {passwordErrors.length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                        {passwordErrors.map((error, index) => (
                          <div key={index} className="text-[10px] font-bold text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {error}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword || !passwordsMatch}
                      className="bg-green-500 w-full md:w-full text-white cursor-pointer px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-green-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        "Update Security"
                      )}
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative border-destructive/20">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-destructive">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        toast.success("Logged out successfully");
                        signOut({ callbackUrl: '/auth/login' });
                      }}
                      className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border border-destructive text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    >
                      Log out everywhere
                    </button>
                    <button 
                      onClick={() => router.push('/user-dashboard/profile')}
                      className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl bg-destructive text-white hover:opacity-90 transition-all cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}
