import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth-new';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Code, Server, GitCommit, Clock, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { formatDistance } from 'date-fns';
import BlueGreenDeployment from '@/components/BlueGreenDeployment';
import { Deployment } from '@shared/schema';

export default function DeploymentDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const { data: deployment, isLoading } = useQuery<Deployment>({
    queryKey: [`/api/deployments/${id}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Deployment Not Found</CardTitle>
            <CardDescription>
              The deployment you are looking for does not exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-1 h-4 w-4" />
            <span>Successful</span>
          </div>
        );
      case 'running':
        return (
          <div className="flex items-center text-blue-600">
            <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mr-1"></div>
            <span>Running</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            <span>Failed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-amber-600">
            <Clock className="mr-1 h-4 w-4" />
            <span>Pending</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-600">
            <span>{status}</span>
          </div>
        );
    }
  };

  const isBlueGreenDeployment = deployment.deploymentStrategy === 'blue_green';
  const startedAt = new Date(deployment.startedAt);
  const timeAgo = formatDistance(startedAt, new Date(), { addSuffix: true });

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center">
            <Button asChild variant="ghost" size="sm" className="px-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Deployment Details</h1>
          </div>
          <p className="text-muted-foreground">
            ID: {deployment.id} • Environment: {deployment.environment}
          </p>
        </div>
        <div className="flex space-x-2">
          {deployment.requiresApproval && !deployment.isApproved && (
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Approve Deployment
            </Button>
          )}
        </div>
      </div>

      {/* Deployment Overview Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deployment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Status</span>
              {getStatusBadge(deployment.status)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Environment</span>
              <div className="flex items-center">
                <Server className="mr-1 h-4 w-4 text-primary" />
                <span className="capitalize">{deployment.environment}</span>
                {deployment.isActive && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Deployment Strategy</span>
              <div className="flex items-center">
                <Activity className="mr-1 h-4 w-4 text-primary" />
                <span className="capitalize">{deployment.deploymentStrategy.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Started</span>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-primary" />
                <span>{timeAgo}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Commit</span>
              <div className="flex items-center">
                <GitCommit className="mr-1 h-4 w-4 text-primary" />
                <span className="font-mono text-sm">{deployment.commitSha.substring(0, 7)}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Build Time</span>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-primary" />
                <span>{deployment.buildDuration ? `${deployment.buildDuration}s` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue={isBlueGreenDeployment ? "blue-green" : "logs"} className="mb-6">
        <TabsList>
          {isBlueGreenDeployment && (
            <TabsTrigger value="blue-green">Blue/Green Deployment</TabsTrigger>
          )}
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {isBlueGreenDeployment && (
          <TabsContent value="blue-green" className="mt-4">
            <BlueGreenDeployment 
              deploymentId={deployment.id} 
              environmentName={deployment.environment} 
            />
          </TabsContent>
        )}

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-primary" />
                Build & Deployment Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg p-4 text-white font-mono text-sm overflow-auto max-h-[500px]">
                {deployment.buildLogs ? (
                  <pre className="whitespace-pre-wrap">{deployment.buildLogs}</pre>
                ) : (
                  <div className="text-gray-400 italic">No logs available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Real-time metrics for this deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Metrics data will appear here once the deployment is active</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}