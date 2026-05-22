import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Welcome & Investment Snapshot */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="h-10 w-64 bg-muted/30 rounded animate-pulse" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-56 bg-muted/30 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="h-10 w-40 bg-muted/30 rounded-lg animate-pulse hidden md:block" />
            </section>

            {/* Quick Stats Summary */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Earned */}
              <div className="bg-card border border-border px-5 py-3 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg w-10 h-10 animate-pulse" />
                  <div className="w-4 h-4 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
              </div>

              {/* Tasks Done */}
              <div className="bg-card border border-border px-5 py-3 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-green-500/10 rounded-lg w-10 h-10 animate-pulse" />
                  <div className="w-4 h-4 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
              </div>

              {/* Withdrawals */}
              <div className="bg-card border border-border px-5 py-3 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg w-10 h-10 animate-pulse" />
                  <div className="w-4 h-4 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
              </div>

              {/* Active Tasks */}
              <div className="bg-card border border-border px-5 py-3 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg w-10 h-10 animate-pulse" />
                  <div className="w-4 h-4 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
              </div>
            </section>

            {/* Pending Tasks Section */}
            <section className="space-y-6 py-5">
              {/* Tasks Section Header */}
              <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 p-1 bg-muted/50 rounded-lg overflow-x-auto w-full sm:w-fit">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-muted/30 rounded-md animate-pulse" />
                ))}
              </div>

              {/* Task Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
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
                <div className="flex items-center gap-1 h-12 w-24 bg-muted/30 rounded-lg animate-pulse" />
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-9 w-9 bg-muted/30 rounded-lg animate-pulse" />
                  ))}
                </div>
                <div className="flex items-center gap-1 h-12 w-24 bg-muted/30 rounded-lg animate-pulse" />
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="pt-10 border-t border-border relative">
              {/* Header */}
              <div className="flex justify-between mb-8 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted/30 rounded animate-pulse" />
                    <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-56 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
                </div>
              </div>

              {/* Activity Table */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] w-full">
                    {/* Header Row */}
                    <div className="flex justify-between items-center bg-muted/50 border-b border-border px-6 py-4">
                      <div className="flex-1 h-4 bg-muted/30 rounded w-16 animate-pulse" />
                      <div className="flex-1 h-4 bg-muted/30 rounded w-16 ml-auto animate-pulse" />
                      <div className="flex-1 h-4 bg-muted/30 rounded w-16 ml-auto animate-pulse" />
                      <div className="flex-1 h-4 bg-muted/30 rounded w-16 mx-auto animate-pulse" />
                    </div>

                    {/* Data Rows */}
                    <div className="divide-y divide-border/50">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center px-6 py-4 animate-pulse"
                        >
                          <div className="flex-1 flex items-center gap-3">
                            <div className="w-9 h-9 bg-muted/30 rounded-xl animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
                            </div>
                          </div>
                          <div className="flex-1 h-4 bg-muted/30 rounded w-16 ml-auto animate-pulse" />
                          <div className="flex-1 h-4 bg-muted/30 rounded w-12 ml-auto animate-pulse" />
                          <div className="flex-1 h-4 bg-muted/30 rounded w-16 mx-auto animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
