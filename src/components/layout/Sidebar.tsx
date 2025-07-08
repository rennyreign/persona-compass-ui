import { useState } from "react";
import { Home, Users, Megaphone, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      isActive: true
    },
    {
      name: 'Personas',
      href: '/personas',
      icon: Users,
      isActive: false
    },
    {
      name: 'Campaigns',
      href: '/campaigns',
      icon: Megaphone,
      isActive: false
    },
    {
      name: 'Insights',
      href: '/insights',
      icon: Lightbulb,
      isActive: false
    },
  ];

  const quickActions = [
    {
      name: 'Create Persona',
      icon: '👤',
      action: () => console.log('Create persona')
    },
    {
      name: 'Launch Campaign',
      icon: '🚀',
      action: () => console.log('Launch campaign')
    },
    {
      name: 'Generate Insights',
      icon: '🤖',
      action: () => console.log('Generate insights')
    }
  ];

  return (
    <div className={cn(
      "flex flex-col bg-card border-r border-border h-screen transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/89175e4f-021a-4be2-a013-b97ccb4af0c3.png" 
                alt="MSU Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">MSU Persona</h1>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <span className="text-lg">{isCollapsed ? '→' : '←'}</span>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200",
                item.isActive
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-primary" />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </a>
          ))}
        </nav>

      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200 cursor-pointer",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-semibold text-sm">U</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Marketing Team</p>
              <p className="text-xs text-muted-foreground truncate">team@msu.edu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}