import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function TransactionsSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Page Title & Balance */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="h-10 w-64 bg-muted/30 rounded animate-pulse" />
                <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-40 bg-muted/30 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-card border border-border rounded-xl p-4 lg:p-4 flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[180px] relative">
                <div className="h-10 w-full bg-muted/30 rounded-lg animate-pulse" />
              </div>

              {/* Type filters */}
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-muted/30 rounded-lg animate-pulse" />
                ))}
                <div className="h-10 w-10 bg-muted/30 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-5 py-4">
                          <div className="h-4 w-20 bg-muted/30 rounded animate-pulse" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/30">
                        {[...Array(6)].map((_, colIndex) => (
                          <td key={colIndex} className="px-5 py-4">
                            <div className="h-4 w-16 bg-muted/30 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-border/40 px-5 py-4 flex items-center justify-between gap-4">
                <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
                <div className="flex justify-end items-center gap-2">
                  <div className="h-9 w-9 bg-muted/30 rounded-xl animate-pulse" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-9 w-9 bg-muted/30 rounded-xl animate-pulse" />
                  ))}
                  <div className="h-9 w-9 bg-muted/30 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
