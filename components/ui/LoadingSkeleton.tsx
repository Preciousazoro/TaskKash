export function AuthSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo/Brand skeleton */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/30 rounded-2xl mx-auto animate-pulse" />
            <div className="h-8 w-48 bg-muted/30 rounded mx-auto animate-pulse" />
          </div>

          {/* Form skeleton */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
              <div className="h-12 bg-muted/30 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
              <div className="h-12 bg-muted/30 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 bg-muted/30 rounded-xl animate-pulse" />
          </div>

          {/* Footer links skeleton */}
          <div className="flex justify-center gap-4">
            <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
