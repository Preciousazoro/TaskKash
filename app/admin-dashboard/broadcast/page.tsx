"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mail, 
  Bell, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  MessageSquare,
  Calendar,
  BarChart3
} from "lucide-react";
import { toast } from 'react-toastify';
import AdminHeader from "../../../components/admin-dashboard/AdminHeader";
import AdminSidebar from "../../../components/admin-dashboard/AdminSidebar";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { SafeHTMLRenderer } from "@/components/ui/SafeHTMLRenderer";

interface BroadcastHistory {
  _id: string;
  title: string;
  message: string;
  sentViaEmail: boolean;
  sentViaInApp: boolean;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface BroadcastStats {
  totalBroadcasts: number;
  emailBroadcasts: number;
  inAppBroadcasts: number;
  recentBroadcasts: number;
}

const BroadcastPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sendViaEmail: false,
    sendViaInApp: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<BroadcastHistory[]>([]);
  const [stats, setStats] = useState<BroadcastStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBroadcastData();
  }, []);

  const fetchBroadcastData = async () => {
    try {
      console.log('Fetching broadcast data...');
      
      const [historyResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/broadcasts?page=1&limit=5'),
        fetch('/api/admin/broadcasts?action=stats')
      ]);

      console.log('History response status:', historyResponse.status);
      console.log('Stats response status:', statsResponse.status);

      // Check history response
      if (historyResponse.ok) {
        const historyContentType = historyResponse.headers.get('content-type');
        if (historyContentType?.includes('application/json')) {
          const historyData = await historyResponse.json();
          console.log('History data:', historyData);
          setHistory(historyData.data.broadcasts || []);
        } else {
          const text = await historyResponse.text();
          console.error('History endpoint returned non-JSON:', text);
        }
      } else {
        console.error('History endpoint failed:', historyResponse.status);
      }

      // Check stats response
      if (statsResponse.ok) {
        const statsContentType = statsResponse.headers.get('content-type');
        if (statsContentType?.includes('application/json')) {
          const statsData = await statsResponse.json();
          console.log('Stats data:', statsData);
          setStats(statsData.data);
        } else {
          const text = await statsResponse.text();
          console.error('Stats endpoint returned non-JSON:', text);
        }
      } else {
        console.error('Stats endpoint failed:', statsResponse.status);
      }
    } catch (error) {
      console.error('Error fetching broadcast data:', error);
      toast.error('Failed to load broadcast data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    const type = target.type;
    const checked = target.type === 'checkbox' ? (target as HTMLInputElement).checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a broadcast title');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter a broadcast message');
      return false;
    }
    if (!formData.sendViaEmail && !formData.sendViaInApp) {
      toast.error('Please select at least one delivery method');
      return false;
    }
    if (formData.title.length > 200) {
      toast.error('Title cannot be more than 200 characters');
      return false;
    }
    if (formData.message.length > 2000) {
      toast.error('Message cannot be more than 2000 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Sending broadcast to:', '/api/admin/broadcasts');
      console.log('Broadcast data:', formData);
      
      const response = await fetch('/api/admin/broadcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 200)}...`);
      }

      const result = await response.json();
      console.log('Parsed result:', result);

      if (result.success) {
        toast.success(`Broadcast sent successfully! ${result.data.emailsSent} emails sent, ${result.data.notificationsCreated} notifications created`);
        
        // Reset form
        setFormData({
          title: "",
          message: "",
          sendViaEmail: false,
          sendViaInApp: false
        });

        // Refresh history and stats
        fetchBroadcastData();
      } else {
        toast.error(result.error || result.message || 'Failed to send broadcast');
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error: string) => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error(`Failed to send broadcast: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
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

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Broadcast Message</h1>
                <p className="text-muted-foreground mt-2">Send announcements to all users via email and in-app notifications</p>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {showHistory ? 'Hide' : 'Show'} History
              </button>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Broadcasts</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalBroadcasts}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Email Broadcasts</p>
                      <p className="text-2xl font-bold text-foreground">{stats.emailBroadcasts}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In-App Broadcasts</p>
                      <p className="text-2xl font-bold text-foreground">{stats.inAppBroadcasts}</p>
                    </div>
                    <Bell className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recent (30 days)</p>
                      <p className="text-2xl font-bold text-foreground">{stats.recentBroadcasts}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Broadcast Form */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Broadcast Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={200}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-foreground placeholder-muted-foreground"
                    placeholder="Enter broadcast title..."
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <RichTextEditor
                    content={formData.message}
                    onChange={(content) => setFormData(prev => ({ ...prev, message: content }))}
                    placeholder="Enter your broadcast message..."
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.message.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Delivery Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="checkbox"
                        name="sendViaEmail"
                        checked={formData.sendViaEmail}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-border rounded focus:ring-purple-500"
                        disabled={isSubmitting}
                      />
                      <Mail className="w-5 h-5 text-blue-500 ml-3 mr-2" />
                      <div>
                        <span className="font-medium text-foreground">Send via Email</span>
                        <p className="text-sm text-muted-foreground">Deliver to all verified user email addresses</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="checkbox"
                        name="sendViaInApp"
                        checked={formData.sendViaInApp}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-border rounded focus:ring-purple-500"
                        disabled={isSubmitting}
                      />
                      <Bell className="w-5 h-5 text-green-500 ml-3 mr-2" />
                      <div>
                        <span className="font-medium text-foreground">Send via In-App Notification</span>
                        <p className="text-sm text-muted-foreground">Create notifications for all active users</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      title: "",
                      message: "",
                      sendViaEmail: false,
                      sendViaInApp: false
                    })}
                    className="px-6 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Broadcast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Broadcast History */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Recent Broadcasts</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {history.length > 0 ? (
                      history.map((broadcast) => (
                        <div key={broadcast._id} className="p-6 hover:bg-muted transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{broadcast.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                By {broadcast.createdBy.name} • {formatDate(broadcast.createdAt)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {broadcast.sentViaEmail && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  <Mail className="w-3 h-3" />
                                  Email
                                </span>
                              )}
                              {broadcast.sentViaInApp && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  <Bell className="w-3 h-3" />
                                  In-App
                                </span>
                              )}
                            </div>
                          </div>
                          <SafeHTMLRenderer 
                            content={broadcast.message}
                            className="text-muted-foreground"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No broadcasts sent yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BroadcastPage;
