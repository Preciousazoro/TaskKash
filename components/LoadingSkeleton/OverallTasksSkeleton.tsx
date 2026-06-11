import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function OverallTasksSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Page Title */}
            <div className="space-y-3">
              <div className="h-10 w-64 bg-muted/30 rounded animate-pulse" />
              <div className="h-4 w-96 bg-muted/30 rounded animate-pulse" />
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border px-5 py-3 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-muted/30 rounded-lg w-10 h-10 animate-pulse" />
                    <div className="w-4 h-4 bg-muted/30 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mb-1" />
                  <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
                </div>
              ))}
            </section>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-4 h-4 bg-muted/30 rounded animate-pulse" />
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-10 w-20 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-6 w-3/4 bg-muted/30 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted/30 rounded animate-pulse" />
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="h-5 w-20 bg-muted/30 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-muted/30 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-10 w-24 bg-muted/30 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
              <div className="h-10 w-24 bg-muted/30 rounded-lg animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
