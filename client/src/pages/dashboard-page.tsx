import { useAuth } from "@/hooks/use-auth-new";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Loader2, 
  LogOut, 
  Play, 
  Server,
  Settings,
  User
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  // Mock data for initial dashboard
  // In a full implementation, we would fetch this from the API
  const deploymentsData = [
    { environment: "Production", count: 12, successRate: 92 },
    { environment: "Staging", count: 28, successRate: 85 },
    { environment: "Testing", count: 45, successRate: 78 },
    { environment: "Development", count: 67, successRate: 80 },
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">CI/CD Pipeline Monitor</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || user?.username}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active CI/CD pipelines</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments Today</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all environments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Production deployments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deployments" className="mb-8">
        <TabsList>
          <TabsTrigger value="deployments">Recent Deployments</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="deployments" className="bg-background rounded-md border p-4 mt-4">
          <div className="text-xl font-bold mb-4">Recent Deployments</div>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className={`w-2 h-8 mr-4 rounded-full ${i % 2 === 0 ? 'bg-green-500' : i % 3 === 0 ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Deploy #{i} - Project {i % 3 + 1}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {i % 2 === 0 ? 'Success' : i % 3 === 0 ? 'Failed' : 'In Progress'}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i % 4 === 0 ? 'Production' : i % 3 === 0 ? 'Staging' : i % 2 === 0 ? 'Testing' : 'Development'}
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">
                      {Math.floor(i * 10 + 5)} minutes ago
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/deployments/${i}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="environments" className="bg-background rounded-md border p-4 mt-4">
          <div className="text-xl font-bold mb-4">Environments</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deploymentsData.map((env, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{env.environment}</CardTitle>
                  <CardDescription>
                    {env.count} deployments in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${env.successRate > 90 ? 'bg-green-500' : env.successRate > 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${env.successRate}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{env.successRate}%</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Deployments
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="bg-background rounded-md border p-4 mt-4">
          <div className="text-xl font-bold mb-4">Deployment Metrics</div>
          <div className="h-[300px] flex items-center justify-center p-6 border rounded-md">
            <div className="text-center">
              <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Detailed metrics visualization will be available here</p>
              <Button variant="outline" className="mt-4">Add Metrics</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Trigger New Deployment
            </Button>
            <Button variant="outline" className="w-full">
              <GitPullRequest className="mr-2 h-4 w-4" />
              Review Pending Approvals
            </Button>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configure Pipelines
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Recent actions by team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">User {i}</p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 
                        ? 'Deployed to production' 
                        : i === 2 
                          ? 'Approved staging deployment' 
                          : 'Updated pipeline configuration'}
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {i * 15} minutes ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}