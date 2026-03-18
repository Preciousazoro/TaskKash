import useSWR, { useSWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/profile', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    dedupingInterval: 10 * 60 * 1000, // 10 minutes
  });

  return {
    profile: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useNotifications(limit: number = 5) {
  const { data, error, isLoading, mutate } = useSWR(`/api/notifications?limit=${limit}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 3 * 60 * 1000, // 3 minutes
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    isError: error,
    mutate
  };
}

export function useMarkNotificationsRead() {
  const { mutate } = useSWRConfig();
  
  const markAsRead = async (notificationId?: string) => {
    try {
      const url = notificationId 
        ? `/api/notifications?id=${notificationId}`
        : '/api/notifications?readAll=true';
      
      await fetch(url, { method: 'PATCH' });
      
      // Trigger revalidation of notifications
      mutate('/api/notifications?limit=5');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return { markAsRead };
}
