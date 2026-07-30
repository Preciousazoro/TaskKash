'use client';

import { useMemo, useRef, useEffect } from "react";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Percent, Users, Clock } from "lucide-react";

// Mock data - replace with actual API calls
const CAMPAIGNS = [
  {
    id: "1",
    name: "Summer Brand Campaign",
    brand: "Nike",
    reward: 5000,
    participants: 1250,
    conversionRate: 65,
    verificationSuccessRate: 78,
    category: "Web3"
  },
  {
    id: "2", 
    name: "Product Launch Boost",
    brand: "Apple",
    reward: 10000,
    participants: 3420,
    conversionRate: 72,
    verificationSuccessRate: 85,
    category: "AI"
  },
  {
    id: "3",
    name: "Community Growth",
    brand: "Discord",
    reward: 2500,
    participants: 890,
    conversionRate: 58,
    verificationSuccessRate: 70,
    category: "Finance"
  },
  {
    id: "4",
    name: "Brand Awareness",
    brand: "Coca-Cola",
    reward: 7500,
    participants: 2100,
    conversionRate: 68,
    verificationSuccessRate: 82,
    category: "Education"
  },
  {
    id: "5",
    name: "Holiday Special",
    brand: "Amazon",
    reward: 15000,
    participants: 5600,
    conversionRate: 75,
    verificationSuccessRate: 88,
    category: "Finance"
  },
  {
    id: "6",
    name: "Tech Review",
    brand: "Samsung",
    reward: 8000,
    participants: 1800,
    conversionRate: 62,
    verificationSuccessRate: 75,
    category: "AI"
  }
];

// Simple chart component using chart.js
const ChartComponent = ({ data, type }: { data: any; type: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      import("chart.js/auto").then((Chart) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          // Destroy existing chart if it exists
          if (chartRef.current) {
            chartRef.current.destroy();
          }
          // Create new chart
          chartRef.current = new Chart.default(ctx, data);
        }
      });
    }

    // Cleanup function to destroy chart when component unmounts or data changes
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default function CampaignAnalyticsPage() {
  const topByReward = [...CAMPAIGNS].sort((a, b) => b.reward - a.reward).slice(0, 6);
  const topByParticipants = [...CAMPAIGNS].sort((a, b) => b.participants - a.participants).slice(0, 6);

  const conversionTrend = [
    { m: "Feb", rate: 41 }, { m: "Mar", rate: 48 }, { m: "Apr", rate: 52 },
    { m: "May", rate: 57 }, { m: "Jun", rate: 63 }, { m: "Jul", rate: 68 },
  ];

  const categoryDist = [
    { name: "Web3", value: 5, color: "#8B5CF6" },
    { name: "AI", value: 2, color: "#00FFB2" },
    { name: "Finance", value: 2, color: "#3B82F6" },
    { name: "Education", value: 2, color: "#F59E0B" },
    { name: "Other", value: 1, color: "#6B7280" },
  ];

  const avgConversion = Math.round(CAMPAIGNS.reduce((s, c) => s + c.conversionRate, 0) / CAMPAIGNS.length);
  const avgVerification = Math.round(CAMPAIGNS.reduce((s, c) => s + c.verificationSuccessRate, 0) / CAMPAIGNS.length);
  const totalParticipants = CAMPAIGNS.reduce((s, c) => s + c.participants, 0);

  // Chart configurations
  const rewardChartData = useMemo(() => {
    return {
      type: 'bar',
      data: {
        labels: topByReward.map(c => c.brand),
        datasets: [{
          label: 'Reward',
          data: topByReward.map(c => c.reward),
          backgroundColor: '#00FFB2',
          borderRadius: 6,
          barThickness: 16,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#11131A',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            borderRadius: 10,
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B7280', font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#9CA3AF', font: { size: 11 } },
            border: { display: false }
          }
        }
      }
    };
  }, [topByReward]);

  const participantsChartData = useMemo(() => {
    return {
      type: 'bar',
      data: {
        labels: topByParticipants.map(c => c.brand),
        datasets: [{
          label: 'Participants',
          data: topByParticipants.map(c => c.participants),
          backgroundColor: '#8B5CF6',
          borderRadius: 6,
          barThickness: 16,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#11131A',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            borderRadius: 10,
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B7280', font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#9CA3AF', font: { size: 11 } },
            border: { display: false }
          }
        }
      }
    };
  }, [topByParticipants]);

  const conversionTrendData = useMemo(() => {
    return {
      type: 'line',
      data: {
        labels: conversionTrend.map(c => c.m),
        datasets: [{
          label: 'Conversion Rate',
          data: conversionTrend.map(c => c.rate),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.35,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#11131A',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            borderRadius: 10,
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B7280', font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B7280', font: { size: 11 } },
            border: { display: false }
          }
        }
      }
    };
  }, [conversionTrend]);

  const categoryDistData = useMemo(() => {
    return {
      type: 'doughnut',
      data: {
        labels: categoryDist.map(c => c.name),
        datasets: [{
          data: categoryDist.map(c => c.value),
          backgroundColor: categoryDist.map(c => c.color),
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#11131A',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            borderRadius: 10,
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10,
          }
        }
      }
    };
  }, [categoryDist]);

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-30">
          <div className="space-y-6">
            {/* HEADER */}
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                Campaign Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Performance insights across all campaigns.
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <Percent className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                      +5.2%
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{avgConversion}%</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Avg. Conversion Rate</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                      +2.1%
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{avgVerification}%</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Avg. Verification Success</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                      +18%
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">{totalParticipants.toLocaleString()}</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Total Participants</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-amber-500/10">
                      <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-1">2.4 days</p>
                    <h4 className="text-muted-foreground text-xs font-medium">Avg. Time to Complete</h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CHARTS ROW 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Top Campaigns by Reward</CardTitle>
                  <CardDescription className="text-xs">Highest TP payout</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartComponent data={rewardChartData} type="bar" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Most Popular Campaigns</CardTitle>
                  <CardDescription className="text-xs">By participant count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartComponent data={participantsChartData} type="bar" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CHARTS ROW 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="lg:col-span-2 bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Conversion Rate Trend</CardTitle>
                  <CardDescription className="text-xs">Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ChartComponent data={conversionTrendData} type="line" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-44">
                    <ChartComponent data={categoryDistData} type="doughnut" />
                  </div>
                  <div className="space-y-1.5 mt-4">
                    {categoryDist.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                          {c.name}
                        </span>
                        <span className="font-semibold">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}