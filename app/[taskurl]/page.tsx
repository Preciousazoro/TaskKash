"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TaskUrlPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is authenticated
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // User is authenticated, redirect to overall-tasks with task URL
          const taskurl = params.taskurl as string;
          // Check if it's a fallback URL format (task/{taskId})
          if (taskurl.startsWith('task/')) {
            const taskId = taskurl.replace('task/', '');
            router.push(`/user-dashboard/overall-tasks?taskId=${taskId}`);
          } else {
            router.push(`/user-dashboard/overall-tasks?taskurl=${taskurl}`);
          }
        } else {
          // User is not authenticated, redirect to register
          router.push('/auth/register');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // On error, redirect to register
        router.push('/auth/register');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [router, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading task...</p>
      </div>
    </div>
  );
}
