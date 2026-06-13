export default function KYCVerificationSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-64 bg-muted rounded-xl animate-pulse"></div>
                </div>
                <div className="h-10 w-32 bg-muted rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-[1rem] px-5 py-3 shadow-sm">
                  <div className="w-10 h-10 bg-muted rounded-xl animate-pulse mb-4"></div>
                  <div className="h-8 w-12 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Content Table Skeleton */}
            <div className="bg-card border border-border rounded-[1rem] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-black border-b border-border">
                      <th className="px-6 py-5">
                        <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-5">
                        <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-5">
                        <div className="h-3 w-28 bg-muted rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-5">
                        <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-5 text-right">
                        <div className="h-3 w-24 bg-muted rounded animate-pulse ml-auto"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[...Array(20)].map((_, index) => (
                      <tr key={index} className="group hover:bg-muted/30 transition-colors">
                        {/* User Profile Skeleton */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                            <div className="flex flex-col gap-1">
                              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                            </div>
                          </div>
                        </td>

                        {/* Document Skeleton */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted rounded-lg animate-pulse"></div>
                            <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                          </div>
                        </td>

                        {/* Date Skeleton */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-muted rounded animate-pulse"></div>
                            <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                          </div>
                        </td>

                        {/* Status Badge Skeleton */}
                        <td className="px-6 py-4">
                          <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                        </td>

                        {/* Actions Skeleton */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
  );
}
