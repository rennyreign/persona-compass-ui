import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'persona_created':
        return '👤';
      case 'campaign_launched':
        return '🚀';
      case 'insight_generated':
        return '💡';
      case 'performance_alert':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getActivityBadgeVariant = (type: Activity['type']) => {
    switch (type) {
      case 'persona_created':
        return 'default';
      case 'campaign_launched':
        return 'secondary';
      case 'insight_generated':
        return 'outline';
      case 'performance_alert':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatActivityType = (type: Activity['type']) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className={cn("p-6 bg-card border-0 shadow-md rounded-2xl", className)}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-200">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={getActivityBadgeVariant(activity.type)}
                    className="text-xs"
                  >
                    {formatActivityType(activity.type)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full text-sm text-primary hover:text-primary-dark font-medium py-2 hover:bg-primary/5 rounded-lg transition-colors duration-200">
          View All Activity
        </button>
      </div>
    </Card>
  );
}