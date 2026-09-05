"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/shells/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, BarChart3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching analytics data
    const timer = setTimeout(() => {
      // setData([]); // Uncomment to test empty state
      // setError("Failed to load analytics data."); // Uncomment to test error state
      setData([
        { name: "Jan", students: 400, revenue: 2400 },
        { name: "Feb", students: 300, revenue: 1398 },
        { name: "Mar", students: 200, revenue: 9800 },
        { name: "Apr", students: 278, revenue: 3908 },
        { name: "May", students: 189, revenue: 4800 },
        { name: "Jun", students: 239, revenue: 3800 },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AdminShell title="Analytics">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="School Analytics" 
          description="Detailed insights into student enrollment and revenue."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Enrollment & Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <EmptyState 
                    icon={AlertTriangle} 
                    title="Data Unavailable" 
                    description={error}
                    action={<Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>}
                  />
                </div>
              ) : data.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <EmptyState 
                    icon={BarChart3} 
                    title="No Analytics Data" 
                    description="There is not enough data to generate reports yet."
                  />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} className="opacity-50" />
                      <YAxis yAxisId="left" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} className="opacity-50" />
                      <YAxis yAxisId="right" orientation="right" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} className="opacity-50" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar yAxisId="left" dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--chart-2, 160 60% 45%))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
