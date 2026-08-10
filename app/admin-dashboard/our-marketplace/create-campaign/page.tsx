'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateCampaignRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Generate a temporary ID for new campaign creation
    // The actual page will handle both creation and editing
    const tempId = 'new';
    router.replace(`/admin-dashboard/our-marketplace/create-campaign/${tempId}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
