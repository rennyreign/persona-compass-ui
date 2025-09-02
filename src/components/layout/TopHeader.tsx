import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Bell, Search, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TopHeaderProps {
  className?: string;
}

interface Notification {
  id: string;
  type: 'campaign' | 'persona' | 'performance' | 'system';
  title: string;
  content: string;
  created_at: string;
  read: boolean;
}

function NotificationPopover() {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Fetch recent campaign activities
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, description, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent personas
      const { data: personas } = await supabase
        .from('personas')
        .select('id, name, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(2);

      const recentNotifications: Notification[] = [];

      // Add campaign notifications
      campaigns?.forEach(campaign => {
        recentNotifications.push({
          id: `campaign-${campaign.id}`,
          type: 'campaign',
          title: `New campaign created`,
          content: campaign.description || 'Campaign is ready for launch',
          created_at: campaign.created_at,
          read: false
        });
      });

      // Add persona notifications
      personas?.forEach(persona => {
        recentNotifications.push({
          id: `persona-${persona.id}`,
          type: 'persona',
          title: `New persona created: ${persona.name}`,
          content: 'Persona is ready for campaign targeting',
          created_at: persona.created_at,
          read: false
        });
      });

      // Sort by date
      recentNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(recentNotifications.slice(0, 5));
      setHasUnreadNotifications(recentNotifications.length > 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handlePopoverOpen = () => {
    // Mark notifications as read when popover opens
    setHasUnreadNotifications(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'campaign': return '🚀';
      case 'persona': return '👤';
      case 'performance': return '📈';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  return (
    <Popover onOpenChange={(open) => open && handlePopoverOpen()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {hasUnreadNotifications && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? notifications.map((notification) => (
            <div key={notification.id} className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(notification.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent notifications</p>
              <p className="text-xs mt-1">Create personas and campaigns to see updates</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border">
          <Link to="/insights">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground hover:bg-muted">
              View All Insights
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.email ? getInitials(user.email) : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}