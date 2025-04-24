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
    <div className="container mx-auto p-6 animate-fadeIn">
      <header className="flex justify-between items-center mb-10 bg-muted/30 p-6 rounded-xl shadow-sm animate-slideInUp">
        <div>
          <h1 className="text-4xl font-bold gradient-text">CI/CD Pipeline Monitor</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, <span className="font-semibold text-primary">{user?.fullName || user?.username}</span>
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => logout()}
          disabled={isLoading}
          className="button-hover-effect px-6 py-6 rounded-lg flex items-center"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-5 w-5" />
          )}
          <span className="font-medium">Logout</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-slideInUp" style={{animationDelay: "0.1s"}}>
        <Card className="card-hover-effect border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Projects</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">
              <GitBranch className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground mt-1">Active CI/CD pipelines</p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Deployments Today</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">
              <Server className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">Across all environments</p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect border-t-4 border-t-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Success Rate</CardTitle>
            <div className="bg-secondary/10 p-2 rounded-full">
              <GitCommit className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect border-t-4 border-t-secondary animate-pulse-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Approvals</CardTitle>
            <div className="bg-secondary/10 p-2 rounded-full">
              <GitPullRequest className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-1">Production deployments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deployments" className="mb-10 animate-slideInUp" style={{animationDelay: "0.2s"}}>
        <TabsList className="bg-muted/30 p-1 rounded-full overflow-hidden shadow-sm">
          <TabsTrigger value="deployments" className="rounded-full py-2.5 px-4 button-hover-effect">
            Recent Deployments
          </TabsTrigger>
          <TabsTrigger value="environments" className="rounded-full py-2.5 px-4 button-hover-effect">
            Environments
          </TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-full py-2.5 px-4 button-hover-effect">
            Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deployments" className="bg-background rounded-xl border shadow-sm p-6 mt-5 animate-fadeIn">
          <div className="text-2xl font-bold mb-6 gradient-text">Recent Deployments</div>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="card-hover-effect overflow-hidden border-0 shadow-md animate-slideInUp" style={{animationDelay: `${0.1 * i}s`}}>
                <CardContent className="p-0">
                  <div className="flex items-center p-5">
                    <div 
                      className={`w-2 h-12 mr-5 rounded-full shadow-md ${
                        i % 2 === 0 
                          ? 'bg-green-500' 
                          : i % 3 === 0 
                            ? 'bg-red-500' 
                            : 'bg-amber-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="text-md font-semibold">
                        Deploy #{i} - Project {i % 3 + 1}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {i % 2 === 0 
                          ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Success
                            </span>
                          ) 
                          : i % 3 === 0 
                            ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Failed
                              </span>
                            ) 
                            : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                In Progress
                              </span>
                            )
                        }
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-muted/50">
                      {i % 4 === 0 ? 'Production' : i % 3 === 0 ? 'Staging' : i % 2 === 0 ? 'Testing' : 'Development'}
                    </div>
                    <div className="text-sm text-muted-foreground ml-6">
                      {Math.floor(i * 10 + 5)} minutes ago
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-5 rounded-full button-hover-effect"
                      asChild
                    >
                      <Link href={`/deployments/${i}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="environments" className="bg-background rounded-xl border shadow-sm p-6 mt-5 animate-fadeIn">
          <div className="text-2xl font-bold mb-6 gradient-text">Environments</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deploymentsData.map((env, i) => (
              <Card key={i} className="card-hover-effect shadow-md animate-slideInUp" style={{animationDelay: `${0.1 * i}s`}}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold">{env.environment}</CardTitle>
                  <CardDescription className="text-md">
                    {env.count} deployments in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-3">
                    <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-3 rounded-full ${
                          env.successRate > 90 
                            ? 'bg-green-500' 
                            : env.successRate > 80 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${env.successRate}%`,
                          transition: 'width 1s ease-in-out'
                        }}
                      ></div>
                    </div>
                    <span className="ml-3 text-lg font-semibold">{env.successRate}%</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full button-hover-effect rounded-lg"
                  >
                    View Deployments
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="bg-background rounded-xl border shadow-sm p-6 mt-5 animate-fadeIn">
          <div className="text-2xl font-bold mb-6 gradient-text">Deployment Metrics</div>
          <div className="h-[300px] flex items-center justify-center p-8 border rounded-xl bg-muted/20 animate-slideInUp">
            <div className="text-center">
              <div className="bg-secondary/10 p-5 rounded-full inline-block mb-5">
                <BarChart className="h-16 w-16 text-secondary animate-pulse-subtle" />
              </div>
              <p className="text-muted-foreground text-lg">Detailed metrics visualization will be available here</p>
              <Button 
                variant="outline" 
                className="mt-6 px-6 py-2.5 rounded-lg button-hover-effect shadow-sm"
              >
                <span className="mr-2">+</span> Add Metrics
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInUp" style={{animationDelay: "0.3s"}}>
        <Card className="card-hover-effect shadow-md border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-xl gradient-text">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
              className="w-full py-5 rounded-lg font-medium button-hover-effect animate-pulse-subtle"
            >
              <Play className="mr-3 h-5 w-5" />
              Trigger New Deployment
            </Button>
            <Button 
              variant="outline" 
              className="w-full py-5 rounded-lg font-medium button-hover-effect"
            >
              <GitPullRequest className="mr-3 h-5 w-5 text-primary" />
              Review Pending Approvals
            </Button>
            <Button 
              variant="outline" 
              className="w-full py-5 rounded-lg font-medium button-hover-effect"
            >
              <Settings className="mr-3 h-5 w-5 text-primary" />
              Configure Pipelines
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-2 card-hover-effect shadow-md border-t-4 border-t-secondary">
          <CardHeader>
            <CardTitle className="text-xl gradient-text">Team Activity</CardTitle>
            <CardDescription className="text-md">
              Recent actions by team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center p-3 rounded-lg hover:bg-muted/40 transition-colors animate-slideInUp" style={{animationDelay: `${0.4 + (0.1 * i)}s`}}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-4 shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-md font-medium">User {i}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {i === 1 
                        ? 'Deployed to production' 
                        : i === 2 
                          ? 'Approved staging deployment' 
                          : 'Updated pipeline configuration'}
                    </p>
                  </div>
                  <div className="ml-auto text-sm bg-muted/40 px-4 py-1 rounded-full">
                    {i * 15} minutes ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full py-5 rounded-lg font-medium button-hover-effect"
            >
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}