import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function TaskVerificationSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-6xl mx-auto mb-5">
            {/* Context Breadcrumbs Header */}
            <header className="mb-8 space-y-4">
              <div className="space-y-3">
                <div className="h-8 w-64 bg-muted/30 rounded animate-pulse" />
                <div className="h-4 w-96 bg-muted/30 rounded animate-pulse" />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="h-8 w-32 bg-muted/30 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-muted/30 rounded animate-pulse" />
                <div className="h-6 w-20 bg-muted/30 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-muted/30 rounded animate-pulse" />
              </div>

              <div className="h-20 w-full bg-muted/20 rounded-xl animate-pulse" />
            </header>

            {/* Split Screen Dashboard Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMNS: SUBMISSION WORKSPACE */}
              <div className="lg:col-span-2 space-y-6">
                {/* Form Step 1: Proof Context */}
                <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-36 w-full bg-muted/30 rounded-xl animate-pulse" />
                  </div>

                  <div className="flex items-start gap-2.5 bg-muted/20 p-3 rounded-xl">
                    <div className="h-4 w-4 bg-muted/30 rounded animate-pulse shrink-0" />
                    <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                  </div>
                </div>

                {/* Form Step 2: Media Dropzone Box */}
                <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-muted/30 rounded animate-pulse" />
                  </div>

                  {/* Dropzone */}
                  <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center min-h-[180px]">
                    <div className="space-y-4 max-w-md">
                      <div className="h-12 w-12 bg-muted/30 rounded-full mx-auto animate-pulse" />
                      <div className="h-4 w-48 bg-muted/30 rounded animate-pulse mx-auto" />
                      <div className="h-3 w-40 bg-muted/30 rounded animate-pulse mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Submission Trigger */}
                <div className="h-12 w-full bg-muted/30 rounded-xl animate-pulse" />
              </div>

              {/* RIGHT COLUMN: LIVE DATA PREVIEW MOCK CARD */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
                </div>

                <div className="bg-card rounded-2xl overflow-hidden border border-border">
                  {/* Preview Top Aspect Box Container */}
                  <div className="aspect-video bg-muted/30 animate-pulse border-b border-border/40" />

                  {/* Preview Form Content */}
                  <div className="p-5 space-y-3">
                    <div className="h-6 w-3/4 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted/30 rounded animate-pulse" />

                    <div className="pt-2 border-t border-border/40 space-y-2">
                      <div className="h-3 w-40 bg-muted/30 rounded animate-pulse" />
                      <div className="grid grid-cols-5 gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="aspect-square bg-muted/30 rounded animate-pulse" />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <div className="h-5 w-20 bg-muted/30 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-muted/30 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* System Policy Advisory Card */}
                <div className="bg-muted/40 border border-border p-5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-muted/30 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
