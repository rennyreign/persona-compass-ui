import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockInsights } from "@/data/mockData";

interface TopHeaderProps {
  className?: string;
}

function NotificationPopover() {
  const recentInsights = mockInsights.slice(0, 5);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return '📈';
      case 'opportunity': return '💡';
      case 'warning': return '⚠️';
      case 'trend': return '📊';
      default: return '🔍';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {recentInsights.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Insights</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {recentInsights.map((insight) => (
            <div key={insight.id} className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {insight.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {insight.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(insight.generatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground hover:bg-muted">
            View All Insights
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
            <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationPopover />

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* Button removed as requested */}
          </div>
        </div>
      </div>
    </header>
  );
}