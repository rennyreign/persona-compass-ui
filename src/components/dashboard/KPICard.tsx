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
    <Card className={cn("p-6 bg-card border-0 shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-200", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-semibold text-foreground">
              {formatValue(value)}
            </h3>
            {change && (
              <span className={cn("text-xs font-medium", getTrendColor())}>
                {change.value > 0 ? '+' : ''}{change.value}% {change.period}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-xl">
            <div className="w-6 h-6 text-muted-foreground">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}