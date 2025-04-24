import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, Activity, Server, Gauge, ChevronRightSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Deployment } from '@shared/schema';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlueGreenDeploymentProps {
  deploymentId?: number;
  environmentName: string;
  onComplete?: () => void;
}

export default function BlueGreenDeployment({ 
  deploymentId, 
  environmentName,
  onComplete,
}: BlueGreenDeploymentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [previousDeployment, setPreviousDeployment] = useState<Deployment | null>(null);
  const [trafficPercentage, setTrafficPercentage] = useState(0);
  const [blueStatus, setBlueStatus] = useState<'active' | 'standby' | 'failed'>('active');
  const [greenStatus, setGreenStatus] = useState<'deploying' | 'ready' | 'standby' | 'active' | 'failed'>('deploying');
  const [healthChecks, setHealthChecks] = useState<Array<{ slot: string, status: 'pending' | 'running' | 'success' | 'failed' }>>([
    { slot: 'blue', status: 'success' },
    { slot: 'green', status: 'running' },
  ]);
  const [showSwitchConfirmation, setShowSwitchConfirmation] = useState(false);
  
  // Fetch deployment data
  useEffect(() => {
    if (deploymentId) {
      fetchDeployment(deploymentId);
    }
  }, [deploymentId]);
  
  const fetchDeployment = async (id: number) => {
    try {
      const response = await apiRequest('GET', `/api/deployments/${id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setDeployment(result.data);
        setTrafficPercentage(result.data.trafficPercentage || 0);
        
        // Set statuses based on deployment data
        const isGreen = result.data.slot === 'green';
        
        if (isGreen) {
          // This is the green deployment
          setGreenStatus(result.data.isActive ? 'active' : (result.data.status === 'success' ? 'ready' : 'deploying'));
          setBlueStatus(result.data.isActive ? 'standby' : 'active');
        } else {
          // This is the blue deployment or a direct deployment
          setBlueStatus(result.data.isActive ? 'active' : 'standby');
          setGreenStatus('deploying');
        }
        
        // If there's a previous deployment, fetch it
        if (result.data.previousDeploymentId) {
          fetchPreviousDeployment(result.data.previousDeploymentId);
        }
      }
    } catch (error) {
      console.error('Error fetching deployment:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deployment details',
        variant: 'destructive',
      });
    }
  };
  
  const fetchPreviousDeployment = async (id: number) => {
    try {
      const response = await apiRequest('GET', `/api/deployments/${id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setPreviousDeployment(result.data);
      }
    } catch (error) {
      console.error('Error fetching previous deployment:', error);
    }
  };

  // Mutation for updating traffic percentage
  const updateTrafficMutation = useMutation({
    mutationFn: async (data: { trafficPercentage: number, isActive?: boolean }) => {
      if (!deploymentId) throw new Error('No deployment ID provided');
      
      const response = await apiRequest('PATCH', `/api/deployments/${deploymentId}/traffic`, data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [`/api/deployments/${deploymentId}`] });
        
        // If there's a previous deployment, invalidate its data too
        if (deployment?.previousDeploymentId) {
          queryClient.invalidateQueries({ 
            queryKey: [`/api/deployments/${deployment.previousDeploymentId}`] 
          });
        }
      }
    },
    onError: (error) => {
      toast({
        title: 'Error updating traffic',
        description: error.message || 'Failed to update traffic distribution',
        variant: 'destructive',
      });
    }
  });

  const incrementTraffic = async () => {
    if (!deployment || trafficPercentage >= 100) return;
    
    const newPercentage = Math.min(trafficPercentage + 25, 100);
    setTrafficPercentage(newPercentage); // Optimistic update
    
    try {
      // Prepare update data
      const updateData: { trafficPercentage: number, isActive?: boolean } = {
        trafficPercentage: newPercentage
      };
      
      // If percentage reaches 100%, mark as active
      if (newPercentage === 100) {
        updateData.isActive = true;
        setBlueStatus('standby');
        setGreenStatus('active');
      }
      
      await updateTrafficMutation.mutateAsync(updateData);
      
      toast({
        title: 'Traffic shifted',
        description: `${newPercentage}% of traffic now routed to green deployment`,
      });
    } catch (error) {
      // Revert optimistic update on error
      setTrafficPercentage(trafficPercentage);
      console.error('Error increasing traffic:', error);
    }
  };

  const decrementTraffic = async () => {
    if (!deployment || trafficPercentage <= 0) return;
    
    const newPercentage = Math.max(trafficPercentage - 25, 0);
    setTrafficPercentage(newPercentage); // Optimistic update
    
    try {
      // Prepare update data
      const updateData: { trafficPercentage: number, isActive?: boolean } = {
        trafficPercentage: newPercentage
      };
      
      // If percentage reaches 0%, mark blue as active
      if (newPercentage === 0 && deployment.previousDeploymentId) {
        // Mark the previous (blue) deployment as active
        const blueResponse = await apiRequest(
          'PATCH', 
          `/api/deployments/${deployment.previousDeploymentId}/traffic`, 
          { trafficPercentage: 100, isActive: true }
        );
        
        setBlueStatus('active');
        setGreenStatus('standby');
      }
      
      await updateTrafficMutation.mutateAsync(updateData);
      
      toast({
        title: 'Traffic shifted',
        description: `${newPercentage}% of traffic now routed to green deployment`,
      });
    } catch (error) {
      // Revert optimistic update on error
      setTrafficPercentage(trafficPercentage);
      console.error('Error decreasing traffic:', error);
    }
  };

  const completeDeployment = async () => {
    if (!deployment) return;
    
    if (trafficPercentage === 100) {
      try {
        // Mark the deployment as completed and fully active
        await updateTrafficMutation.mutateAsync({ 
          trafficPercentage: 100,
          isActive: true 
        });
        
        toast({
          title: 'Deployment completed',
          description: 'Green slot is now the active environment',
          variant: 'default',
        });
        
        // Call the onComplete callback if provided
        onComplete?.();
      } catch (error) {
        console.error('Error completing deployment:', error);
      }
    } else {
      toast({
        title: 'Cannot complete',
        description: 'You must migrate 100% of traffic before completing',
        variant: 'destructive',
      });
    }
  };

  const switchEnvironments = async () => {
    setShowSwitchConfirmation(false);
    
    if (!deployment || !deployment.previousDeploymentId) return;
    
    try {
      // Determine which deployment should be active
      const makeGreenActive = blueStatus === 'active';
      
      // Update green deployment
      await updateTrafficMutation.mutateAsync({ 
        trafficPercentage: makeGreenActive ? 100 : 0,
        isActive: makeGreenActive
      });
      
      // Update blue deployment (previous deployment)
      await apiRequest(
        'PATCH', 
        `/api/deployments/${deployment.previousDeploymentId}/traffic`, 
        { 
          trafficPercentage: makeGreenActive ? 0 : 100,
          isActive: !makeGreenActive 
        }
      );
      
      // Update UI
      const prevBlueStatus = blueStatus;
      setBlueStatus(greenStatus === 'active' ? 'standby' : 'active');
      setGreenStatus(prevBlueStatus === 'active' ? 'standby' : 'active');
      setTrafficPercentage(prevBlueStatus === 'active' ? 100 : 0);
      
      toast({
        title: 'Environments switched',
        description: `Active slot is now ${prevBlueStatus === 'active' ? 'green' : 'blue'}`,
      });
    } catch (error) {
      console.error('Error switching environments:', error);
      toast({
        title: 'Error',
        description: 'Failed to switch environments',
        variant: 'destructive',
      });
    }
  };

  const rollbackDeployment = async () => {
    if (!deployment || !deployment.previousDeploymentId) return;
    
    try {
      // Set green deployment to 0% traffic and not active
      await updateTrafficMutation.mutateAsync({ 
        trafficPercentage: 0,
        isActive: false
      });
      
      // Set blue deployment to 100% traffic and active
      await apiRequest(
        'PATCH', 
        `/api/deployments/${deployment.previousDeploymentId}/traffic`, 
        { 
          trafficPercentage: 100,
          isActive: true 
        }
      );
      
      // Update UI state
      setTrafficPercentage(0);
      setBlueStatus('active');
      setGreenStatus('failed');
      
      toast({
        title: 'Deployment rolled back',
        description: 'All traffic returned to blue environment',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error rolling back deployment:', error);
      toast({
        title: 'Error',
        description: 'Failed to rollback deployment',
        variant: 'destructive',
      });
    }
  };

  const getSlotColor = (slot: 'blue' | 'green', status: string) => {
    if (slot === 'blue') {
      return status === 'active' ? 'bg-blue-500' : 
             status === 'standby' ? 'bg-blue-300' : 'bg-red-400';
    } else {
      return status === 'active' ? 'bg-green-500' : 
             status === 'ready' ? 'bg-green-400' :
             status === 'standby' ? 'bg-green-300' : 
             status === 'deploying' ? 'bg-amber-400' : 'bg-red-400';
    }
  };

  const runHealthCheck = () => {
    // Simulate health check
    setHealthChecks(checks => checks.map(check => {
      if (check.slot === 'green' && check.status === 'running') {
        return { ...check, status: Math.random() > 0.2 ? 'success' : 'failed' };
      }
      return check;
    }));
    
    // If successful, update green status
    setTimeout(() => {
      const greenHealthCheck = healthChecks.find(c => c.slot === 'green');
      if (greenHealthCheck?.status === 'success') {
        setGreenStatus('ready');
        toast({
          title: 'Health check passed',
          description: 'Green environment is ready for traffic',
        });
      } else if (greenHealthCheck?.status === 'failed') {
        setGreenStatus('failed');
        toast({
          title: 'Health check failed',
          description: 'Green environment is not healthy',
          variant: 'destructive',
        });
      }
    }, 500);
  };

  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold">
            <ArrowRightLeft className="mr-2 h-5 w-5 text-primary" />
            Blue/Green Deployment: {environmentName}
          </CardTitle>
          <CardDescription>
            Manage traffic between Blue (current) and Green (new) environments to minimize downtime
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Health Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className={`border-l-4 border-l-blue-500`}>
                <CardHeader className="py-3">
                  <CardTitle className="text-md flex items-center">
                    <Server className="mr-2 h-4 w-4 text-blue-500" />
                    Blue Environment (Current)
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getSlotColor('blue', blueStatus)}`}></div>
                    <span className="text-sm font-medium">{blueStatus.charAt(0).toUpperCase() + blueStatus.slice(1)}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      Traffic: {100 - trafficPercentage}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Health Check: </span>
                    {healthChecks.find(c => c.slot === 'blue')?.status === 'success' ? (
                      <CheckCircle className="ml-1 h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="ml-1 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 border-l-green-500`}>
                <CardHeader className="py-3">
                  <CardTitle className="text-md flex items-center">
                    <Server className="mr-2 h-4 w-4 text-green-500" />
                    Green Environment (New)
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getSlotColor('green', greenStatus)}`}></div>
                    <span className="text-sm font-medium">{greenStatus.charAt(0).toUpperCase() + greenStatus.slice(1)}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      Traffic: {trafficPercentage}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Health Check: </span>
                    {healthChecks.find(c => c.slot === 'green')?.status === 'success' ? (
                      <CheckCircle className="ml-1 h-4 w-4 text-green-500" />
                    ) : healthChecks.find(c => c.slot === 'green')?.status === 'failed' ? (
                      <AlertCircle className="ml-1 h-4 w-4 text-red-500" />
                    ) : (
                      <span className="ml-1 text-xs text-amber-500">Running...</span>
                    )}
                    {greenStatus === 'deploying' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto text-xs px-2 py-1 h-7"
                        onClick={runHealthCheck}
                      >
                        Run Check
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Slider */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-medium">Traffic Distribution</span>
                <span className="text-sm font-semibold">{trafficPercentage}% to Green</span>
              </div>
              <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${trafficPercentage}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                <span>Blue: {100 - trafficPercentage}%</span>
                <span>Green: {trafficPercentage}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                variant="outline"
                onClick={decrementTraffic}
                disabled={trafficPercentage === 0 || greenStatus === 'deploying' || greenStatus === 'failed'}
                className="flex items-center justify-center"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                -25% to Green
              </Button>
              <Button
                variant="outline"
                onClick={incrementTraffic}
                disabled={trafficPercentage === 100 || greenStatus === 'deploying' || greenStatus === 'failed'}
                className="flex items-center justify-center"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                +25% to Green
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <AlertDialog open={showSwitchConfirmation} onOpenChange={setShowSwitchConfirmation}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto flex items-center"
                disabled={greenStatus === 'deploying' || greenStatus === 'failed'}
              >
                <ChevronRightSquare className="mr-2 h-4 w-4" />
                Swap Active/Standby
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Swap Active and Standby Environments?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will instantly shift all traffic between environments. 
                  Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={switchEnvironments}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Based on status, show either complete or rollback */}
          {greenStatus !== 'failed' ? (
            <Button 
              variant="default" 
              className="w-full sm:w-auto flex items-center"
              disabled={trafficPercentage !== 100 || greenStatus !== 'active'}
              onClick={completeDeployment}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Deployment
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto flex items-center"
              onClick={rollbackDeployment}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Rollback Deployment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}