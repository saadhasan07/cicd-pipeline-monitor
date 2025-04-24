import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

// Types for metrics data
interface DeploymentMetric {
  date: string;
  count: number;
  successful: number;
  failed: number;
  environment: string;
}

interface BuildTimeMetric {
  date: string;
  environment: string;
  averageBuildTime: number;
}

interface StatusDistributionMetric {
  status: string;
  count: number;
  color: string;
}

interface EnvironmentMetric {
  name: string;
  deployments: number;
  successRate: number;
}

interface MetricsData {
  deploymentsByDate: DeploymentMetric[];
  buildTimes: BuildTimeMetric[];
  statusDistribution: StatusDistributionMetric[];
  environmentStats: EnvironmentMetric[];
  deploymentFrequency: { date: string; count: number }[];
}

export default function MetricsDashboard() {
  const { data: metricsData, isLoading, error } = useQuery<MetricsData>({
    queryKey: ['/api/metrics/dashboard'],
    queryFn: getQueryFn({ on401: "throw" }),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">Loading metrics...</span>
      </div>
    );
  }

  if (error || !metricsData) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Metrics</CardTitle>
          <CardDescription>
            There was an issue loading the metrics data. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="w-full animate-fadeIn">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deployment Success Rate */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Deployment Status Distribution</CardTitle>
                <CardDescription>Distribution of deployment statuses</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metricsData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                      >
                        {metricsData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} deployments`, 'Count']}
                        labelFormatter={(label) => `Status: ${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Deployment Trend */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Deployment Trend</CardTitle>
                <CardDescription>Number of deployments over time</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={metricsData.deploymentsByDate}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} deployments`, 'Count']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="successful" 
                        stackId="1" 
                        stroke="#00C49F" 
                        fill="#00C49F" 
                        name="Successful"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="failed" 
                        stackId="1" 
                        stroke="#FF8042" 
                        fill="#FF8042" 
                        name="Failed"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Average Build Time */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Build Time</CardTitle>
                <CardDescription>Build time by environment (seconds)</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metricsData.buildTimes}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)} seconds`, 'Build Time']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="averageBuildTime" 
                        fill="#8884d8" 
                        name="Avg Build Time" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Environment Stats */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Environment Comparison</CardTitle>
                <CardDescription>Success rates across environments</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={metricsData.environmentStats}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Success Rate']}
                        labelFormatter={(label) => `Environment: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="successRate" 
                        fill="#00C49F" 
                        name="Success Rate %" 
                        radius={[0, 4, 4, 0]}
                        label={{ position: 'right', formatter: (val: number) => `${val}%` }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="mt-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Deployment Frequency</CardTitle>
              <CardDescription>Number of deployments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metricsData.deploymentFrequency}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} deployments`, 'Count']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Deployment Count"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Build Performance</CardTitle>
              <CardDescription>Average build time by environment over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metricsData.buildTimes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} seconds`, 'Build Time']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="averageBuildTime" 
                      stroke="#00C49F" 
                      activeDot={{ r: 8 }}
                      name="Avg Build Time (seconds)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environments" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metricsData.environmentStats.map((env, index) => (
              <Card key={index} className="shadow-md">
                <CardHeader>
                  <CardTitle>{env.name} Environment</CardTitle>
                  <CardDescription>
                    {env.deployments} deployments with {env.successRate}% success rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${env.successRate > 90 ? 'bg-green-500' : env.successRate > 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${env.successRate}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}