import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function RewardsSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <UserSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <UserHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
          
          {/* HERO SECTION: USER PROGRESS */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border p-8 md:p-12">
            {/* Abstract Background Glows */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              {/* Left: Level Info */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="h-8 w-40 bg-muted/30 rounded-full animate-pulse mx-auto lg:mx-0" />
                <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                  <div className="h-6 w-48 bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted/30 rounded-full animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted/30 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Right: Stats Grid */}
              <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                <div className="bg-muted/30 border border-border/50 p-6 rounded-[2rem] min-w-[160px] text-center lg:text-left">
                  <div className="mb-4 h-12 w-12 bg-muted/30 rounded-xl animate-pulse mx-auto lg:mx-0" />
                  <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mx-auto lg:mx-0" />
                  <div className="h-3 w-16 bg-muted/30 rounded animate-pulse mt-2 mx-auto lg:mx-0" />
                </div>
                <div className="bg-muted/30 border border-border/50 p-6 rounded-[2rem] min-w-[160px] text-center lg:text-left">
                  <div className="mb-4 h-12 w-12 bg-muted/30 rounded-xl animate-pulse mx-auto lg:mx-0" />
                  <div className="h-8 w-20 bg-muted/30 rounded animate-pulse mx-auto lg:mx-0" />
                  <div className="h-3 w-16 bg-muted/30 rounded animate-pulse mt-2 mx-auto lg:mx-0" />
                </div>
              </div>
            </div>
          </section>

          {/* REWARDS GRID */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-muted/30 w-10 h-10 animate-pulse" />
                <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-[2.5rem] p-6">
                  {/* Tier Tag */}
                  <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse mb-6" />
                  
                  {/* Reward Icon/Art Placeholder */}
                  <div className="aspect-4/3 rounded-3xl bg-muted/30 mb-6 animate-pulse" />

                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted/30 rounded animate-pulse" />
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-muted/30 rounded animate-pulse mt-1" />
                    </div>
                    <div className="h-10 w-28 bg-muted/30 rounded-2xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
