import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RouteStatus as RouteStatusType } from "@/hooks/useRouteRealtime";
import { MapPin, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteStatusProps {
  status: RouteStatusType | null;
  isLoading: boolean;
  className?: string;
}

export function RouteStatus({ status, isLoading, className }: RouteStatusProps) {
  if (isLoading) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="h-6 bg-muted rounded w-24 mb-2" />
        <div className="h-4 bg-muted rounded w-32" />
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <Badge
          variant={status.isActive ? "success" : "secondary"}
          className="w-fit"
        >
          {status.isActive ? "Active" : "Inactive"}
        </Badge>

        {status.isActive && (
          <div className="space-y-2">
            {status.currentPosition && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  Last seen at {new Date(status.currentPosition.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
            {/* {status.currentPosition && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  Next scheduled: {status.currentPosition.lat}, {status.currentPosition.lng}
                </span>
              </div>
            )} */}
          </div>
        )}
        
        {!status.isActive && (
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Route currently not in service</span>
          </div>
        )}
      </div>
    </Card>
  );
}