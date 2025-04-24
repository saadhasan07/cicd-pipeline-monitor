import React, { useState } from 'react';
import { Bell, X, Check, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

// Types for our notifications
export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionPath?: string;
  deploymentId?: number;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Fetch notifications 
  const { data: notificationsData } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    // If API is not yet implemented, provide fallback data
    placeholderData: {
      success: true,
      data: [
        {
          id: 1,
          type: 'success',
          title: 'Deployment Completed',
          message: 'Deployment to production completed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          read: false,
          deploymentId: 12
        },
        {
          id: 2,
          type: 'warning',
          title: 'Approval Required',
          message: 'Production deployment #15 requires your approval',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          read: false,
          deploymentId: 15
        },
        {
          id: 3,
          type: 'error',
          title: 'Deployment Failed',
          message: 'Staging deployment failed due to test errors',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: true,
          deploymentId: 14
        },
        {
          id: 4,
          type: 'info',
          title: 'New Pipeline Created',
          message: 'User Alex created a new pipeline for Project B',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          read: true
        }
      ] as Notification[]
    }
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Helper function to format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get the icon for each notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative rounded-full button-hover-effect"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <Card className="border-0 shadow-none">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Mark all as read
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Bell className="h-10 w-10 mb-2 opacity-20" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-start gap-3",
                      !notification.read && "bg-muted/20"
                    )}
                  >
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      {notification.deploymentId && (
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-xs mt-2 text-primary"
                        >
                          View Deployment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
}