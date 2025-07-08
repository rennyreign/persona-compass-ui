import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  className?: string;
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
              placeholder="Search personas, campaigns, insights..."
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
          <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
            <span className="text-lg">🔔</span>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary hover:text-primary-foreground">
              <span className="mr-2">🤖</span>
              Generate Insight
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary-dark">
              <span className="mr-2">+</span>
              Create Persona
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}