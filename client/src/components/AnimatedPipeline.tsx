import React, { useState, useEffect } from 'react';
import { 
  Code, 
  GitBranch, 
  Package, 
  Server, 
  Database, 
  CheckCircle, 
  AlertCircle,
  ChevronsRight
} from 'lucide-react';

type PipelineStage = {
  id: number;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'success' | 'failed';
  timeElapsed?: string;
};

export default function AnimatedPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([
    { 
      id: 1, 
      name: 'Code Check', 
      icon: <Code size={22} />, 
      status: 'success',
      timeElapsed: '1m 24s'
    },
    { 
      id: 2, 
      name: 'Build', 
      icon: <Package size={22} />, 
      status: 'success',
      timeElapsed: '3m 12s'
    },
    { 
      id: 3, 
      name: 'Test', 
      icon: <GitBranch size={22} />, 
      status: 'running'
    },
    { 
      id: 4, 
      name: 'Deploy', 
      icon: <Server size={22} />, 
      status: 'pending'
    },
    { 
      id: 5, 
      name: 'Database', 
      icon: <Database size={22} />, 
      status: 'pending'
    }
  ]);

  // Simulate pipeline progression
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStages(prevStages => {
        // Find the currently running stage
        const runningIndex = prevStages.findIndex(s => s.status === 'running');
        
        // If we have a running stage and it's not the last one
        if (runningIndex !== -1 && runningIndex < prevStages.length - 1) {
          // Create a copy of the stages
          const newStages = [...prevStages];
          
          // Mark current stage as success (95% of the time) or failed (5% of the time)
          newStages[runningIndex] = {
            ...newStages[runningIndex],
            status: Math.random() > 0.05 ? 'success' : 'failed',
            timeElapsed: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 59) + 1}s`
          };
          
          // If it succeeded, start the next stage
          if (newStages[runningIndex].status === 'success') {
            newStages[runningIndex + 1] = {
              ...newStages[runningIndex + 1],
              status: 'running'
            };
          }
          
          return newStages;
        }
        
        // If the last stage completes or any stage fails, reset after a delay
        if ((runningIndex === prevStages.length - 1 && prevStages[runningIndex].status === 'success') || 
            prevStages.some(s => s.status === 'failed')) {
          setTimeout(() => {
            setStages(originalStages => 
              originalStages.map((stage, index) => ({
                ...stage,
                status: index === 0 ? 'running' : 'pending',
                timeElapsed: undefined
              }))
            );
          }, 3000);
          
          return prevStages;
        }
        
        // If no running stage is found and none have failed, start the first stage
        if (runningIndex === -1 && !prevStages.some(s => s.status === 'failed')) {
          const newStages = [...prevStages];
          newStages[0] = { ...newStages[0], status: 'running' };
          return newStages;
        }
        
        return prevStages;
      });
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'running':
        return (
          <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        );
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border border-gray-300" />;
    }
  };

  return (
    <div className="w-full overflow-hidden p-4 rounded-lg bg-white shadow-md border">
      <h3 className="font-semibold text-lg mb-4 gradient-text">Pipeline Execution</h3>
      
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex-1 flex flex-col items-center">
            <div className="flex flex-col items-center justify-center">
              <div 
                className={`flex items-center justify-center p-3 rounded-full mb-2 border ${getStatusStyles(stage.status)}`}
              >
                {stage.icon}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{stage.name}</div>
                <div className="mt-1 flex items-center justify-center">
                  {getStatusIcon(stage.status)}
                  {stage.timeElapsed && (
                    <span className="text-xs text-muted-foreground ml-1">{stage.timeElapsed}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Connector lines between stages */}
            {i < stages.length - 1 && (
              <div className="flex-1 mx-1 flex items-center justify-center mt-2 w-full">
                <div 
                  className={`h-0.5 w-full ${
                    stages[i].status === 'success' ? 'bg-green-400' : 'bg-gray-200'
                  } relative overflow-hidden`}
                >
                  {stages[i].status === 'success' && stages[i+1].status === 'running' && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
                      <ChevronsRight className="text-blue-600 animate-bounce-horizontal" size={16} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce-horizontal {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }
          .animate-bounce-horizontal {
            animation: bounce-horizontal 1s infinite;
          }
        `
      }} />
    </div>
  );
}