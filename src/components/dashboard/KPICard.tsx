import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function KPICard({ title, value, change, icon, trend = 'neutral', className }: KPICardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={cn("pill-card p-4 bg-gradient-to-br from-card to-muted/20 border-0", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-foreground">
              {formatValue(value)}
            </h3>
            {change && (
              <span className={cn("text-xs font-medium", getTrendColor())}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <div className="w-5 h-5 text-primary/70">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}