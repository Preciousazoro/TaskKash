'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: 'task_submission' | 'booking' | 'contact_message' | 'new_user' | 'task_approved' | 'task_rejected' | 'system';
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: 'task' | 'booking' | 'user' | 'contact' | 'submission' | 'activity';
  link?: string;
  createdAt: string;
  read: boolean;
}

interface AdminDataContextType {
  admin: AdminUser | null;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshAdmin: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};

interface AdminDataProviderProps {
  children: React.ReactNode;
}

export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<{ admin: number; notifications: number }>({ admin: 0, notifications: 0 });

  // Fetch admin data
  const refreshAdmin = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current.admin < 5000) return; // Throttle to 5 seconds
    
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setError(null);
      } else {
        throw new Error('Failed to fetch admin data');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch admin data');
    } finally {
      lastFetchRef.current.admin = now;
    }
  }, []);

  // Fetch notifications
  const refreshNotifications = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current.notifications < 3000) return; // Throttle to 3 seconds
    
    try {
      const response = await fetch('/api/admin/notifications?limit=10');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setError(null);
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      lastFetchRef.current.notifications = now;
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications?id=${id}`, {
        method: 'PATCH'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications?readAll=true', {
        method: 'PATCH'
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        refreshAdmin(),
        refreshNotifications()
      ]);
      setLoading(false);
    };

    initializeData();
  }, [refreshAdmin, refreshNotifications]);

  // Set up notifications polling (reduced frequency)
  useEffect(() => {
    notificationIntervalRef.current = setInterval(() => {
      refreshNotifications();
    }, 120000); // 2 minutes instead of 30 seconds

    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, [refreshNotifications]);

  const value: AdminDataContextType = {
    admin,
    notifications,
    unreadCount,
    loading,
    error,
    refreshAdmin,
    refreshNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
