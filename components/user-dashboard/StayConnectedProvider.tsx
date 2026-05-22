"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import StayConnected from "./StayConnected";

export default function StayConnectedProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const searchParams = useSearchParams();

  // Check if current page is a user-dashboard page
  const isUserDashboardPage = pathname?.startsWith("/user-dashboard");

  // Show popup when user logs in
  useEffect(() => {
    if (status === "authenticated" && isUserDashboardPage) {
      // Show popup immediately on login
      const hasShownOnLogin = localStorage.getItem("stayConnectedShownOnLogin");
      if (!hasShownOnLogin) {
        setIsOpen(true);
        localStorage.setItem("stayConnectedShownOnLogin", "true");
      }
    }
  }, [status, isUserDashboardPage]);

  // Show popup every 10 minutes on user-dashboard pages
  useEffect(() => {
    if (!isUserDashboardPage) {
      setIsOpen(false);
      return;
    }

    // Initial popup after 2 seconds
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    // Show popup every 10 minutes (600000 milliseconds)
    const interval = setInterval(() => {
      setIsOpen(true);
    }, 600000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isUserDashboardPage]);

  // Close popup when navigating away from user-dashboard
  useEffect(() => {
    if (!isUserDashboardPage) {
      setIsOpen(false);
    }
  }, [isUserDashboardPage]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isUserDashboardPage || status !== "authenticated") {
    return null;
  }

  return <StayConnected isOpen={isOpen} onClose={handleClose} />;
}
