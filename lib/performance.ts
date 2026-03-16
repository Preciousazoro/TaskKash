// Performance monitoring utility for API routes

interface PerformanceMetrics {
  route: string;
  method: string;
  duration: number;
  timestamp: Date;
  statusCode?: number;
  error?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  // Make metrics accessible for performance export
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Start timing a request
  startTimer(route: string, method: string): () => PerformanceMetrics {
    const startTime = Date.now();
    
    return (): PerformanceMetrics => {
      const duration = Date.now() - startTime;
      const metric: PerformanceMetrics = {
        route,
        method,
        duration,
        timestamp: new Date()
      };
      
      this.addMetric(metric);
      return metric;
    };
  }

  // Add a metric to the collection
  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // Get metrics for a specific route
  getRouteMetrics(route: string, limit = 50): PerformanceMetrics[] {
    return this.metrics
      .filter(m => m.route === route)
      .slice(-limit);
  }

  // Get slow queries (above threshold)
  getSlowQueries(thresholdMs = 1000): PerformanceMetrics[] {
    return this.metrics
      .filter(m => m.duration > thresholdMs)
      .sort((a, b) => b.duration - a.duration);
  }

  // Get performance summary
  getSummary(): {
    totalRequests: number;
    averageResponseTime: number;
    slowestRequest: PerformanceMetrics | null;
    fastestRequest: PerformanceMetrics | null;
    requestsByRoute: Record<string, number>;
  } {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowestRequest: null,
        fastestRequest: null,
        requestsByRoute: {}
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageResponseTime = totalDuration / this.metrics.length;
    
    const slowestRequest = this.metrics.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
    
    const fastestRequest = this.metrics.reduce((fastest, current) => 
      current.duration < fastest.duration ? current : fastest
    );

    const requestsByRoute = this.metrics.reduce((acc, m) => {
      acc[m.route] = (acc[m.route] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests: this.metrics.length,
      averageResponseTime,
      slowestRequest,
      fastestRequest,
      requestsByRoute
    };
  }

  // Clear all metrics
  clear(): void {
    this.metrics = [];
  }

  // Export metrics for analysis
  export(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Middleware wrapper for API routes
export function withPerformanceMonitoring(
  handler: (req: any) => Promise<any>,
  route: string
) {
  return async (req: any) => {
    const endTimer = performanceMonitor.startTimer(route, req.method || 'GET');
    
    try {
      const result = await handler(req);
      const metric = endTimer();
      metric.statusCode = 200;
      return result;
    } catch (error) {
      const metric = endTimer();
      metric.statusCode = 500;
      metric.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  };
}

// Performance monitoring endpoint (admin only)
export async function getPerformanceMetrics() {
  const summary = performanceMonitor.getSummary();
  const slowQueries = performanceMonitor.getSlowQueries(1000); // Queries over 1 second
  
  return {
    summary,
    slowQueries: slowQueries.slice(0, 20), // Top 20 slowest
    recentMetrics: performanceMonitor.getMetrics().slice(-50) // Last 50 requests
  };
}
