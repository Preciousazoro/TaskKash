import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { InactivityLogoutProvider } from '@/components/providers/InactivityLogoutProvider';
import { AdminDataProvider } from '@/components/providers/AdminDataProvider';

// Force dynamic rendering for admin routes since they depend on authentication
export const dynamic = 'force-dynamic';


export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // Check if user is authenticated and has admin role
  const adminCheck = await isAdmin();
  
  
  if (!adminCheck) {
    // Redirect to user dashboard if not admin
    redirect('/user-dashboard/dashboard');
  }


  return (
    <InactivityLogoutProvider>
      <AdminDataProvider>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </AdminDataProvider>
    </InactivityLogoutProvider>
  );
}
