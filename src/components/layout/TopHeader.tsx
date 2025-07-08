import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { mockActivities } from "@/data/mockData";

interface TopHeaderProps {
  className?: string;
}

function NotificationPopover() {
  const recentActivities = mockActivities.slice(0, 5);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'persona_created': return '👤';
      case 'campaign_launched': return '🚀';
      case 'insight_generated': return '💡';
      case 'performance_alert': return '⚠️';
      default: return '📊';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
          <span className="text-lg text-muted-foreground">🔔</span>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {recentActivities.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary-dark">
            View All Activity
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TopHeader({ className }: TopHeaderProps) {
  return (
    <header className={cn("bg-card border-b border-border px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's what's happening with your personas.
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
            <div className="relative">
            <Input
              placeholder="Search personas, campaigns..."
              className="pl-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span className="text-muted-foreground">🔍</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationPopover />

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button size="sm" className="bg-primary hover:bg-primary-dark">
              <span className="mr-2 text-primary-foreground">+</span>
              Create Persona
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}