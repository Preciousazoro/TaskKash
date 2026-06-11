import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function ProfileSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[300px_1fr] gap-8">
              
              {/* PROFILE CARD (LEFT) */}
              <aside className="space-y-5">
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                  
                  {/* Avatar Wrapper Container */}
                  <div className="relative w-50 h-50 mx-auto">
                    <div className="w-full h-full rounded-3xl bg-muted/30 animate-pulse" />
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="h-6 w-32 bg-muted/30 rounded mx-auto animate-pulse" />
                    <div className="h-4 w-24 bg-muted/30 rounded mx-auto animate-pulse" />
                  </div>

                  <div className="mt-5 p-4 bg-muted/50 rounded-xl border border-border">
                    <div className="h-3 w-20 bg-muted/30 rounded mx-auto animate-pulse" />
                    <div className="h-8 w-24 bg-muted/30 rounded mx-auto animate-pulse mt-2" />
                  </div>

                  <div className="flex justify-center gap-4 mt-5">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-10 h-10 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </div>
              </aside>

              {/* PROFILE FORM (RIGHT) */}
              <div className="bg-card border border-border rounded-3xl p-6 lg:p-7">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                  <div className="space-y-1">
                    <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted/30 rounded animate-pulse" />
                  </div>
                  <div className="h-10 w-32 bg-muted/30 rounded-lg animate-pulse" />
                </div>

                {/* Form Core Fields */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                  
                  {/* Full Name Section */}
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-muted/30 rounded animate-pulse ml-1" />
                    <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                  </div>

                  {/* Username Section */}
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-muted/30 rounded animate-pulse ml-1" />
                    <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-muted/30 rounded animate-pulse ml-1" />
                    <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                  </div>

                  {/* User ID */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted/30 rounded animate-pulse ml-1" />
                    <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                  </div>


                  {/* Phone Number */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted/30 rounded animate-pulse ml-1" />
                    <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                  </div>


                  {/* Telegram Username */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted/30 rounded animate-pulse ml-1" />
                    <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                  </div>

                  {/* Social Media Links Section */}
                  <div className="md:col-span-2 space-y-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted/30 rounded animate-pulse" />
                      <div className="h-4 w-40 bg-muted/30 rounded animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-muted/30 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
                          </div>
                          <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                        </div>
                      ))}
                    </div>
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
