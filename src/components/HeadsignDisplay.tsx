
import { HeadsignData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface HeadsignDisplayProps {
  headsignsData: HeadsignData[];
  isLoading: boolean;
  error: string | null;
  className?: string;
}

const HeadsignDisplay = ({
  headsignsData,
  isLoading,
  error,
  className
}: HeadsignDisplayProps) => {
  // Group headsigns by direction
  const groupedHeadsigns = headsignsData.reduce((acc, item) => {
    const direction = item.direction_id === 0 ? "Outbound" : "Inbound";
    if (!acc[direction]) {
      acc[direction] = [];
    }
    acc[direction].push(item);
    return acc;
  }, {} as Record<string, HeadsignData[]>);

  // Function to render skeletons during loading
  const renderSkeletons = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-7 w-36" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="border-l-8 h-full" style={{ borderColor: '#e2e8f0' }}>
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Function to render error state
  const renderError = () => (
    <Card className="p-6 border-destructive/20 bg-destructive/5">
      <div className="flex gap-3">
        <InfoIcon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <CardTitle className="text-destructive text-lg mb-2">Error Loading Headsigns</CardTitle>
          <CardDescription className="text-destructive/70">{error}</CardDescription>
        </div>
      </div>
    </Card>
  );

  // Function to render empty state
  const renderEmpty = () => (
    <Card className="p-6 text-center border-muted-foreground/20 bg-muted/10">
      <CardDescription className="text-muted-foreground">
        Select a route and click "Verify Headsigns" to view the headsign data.
      </CardDescription>
    </Card>
  );

  // Function to render headsign cards
  const renderHeadsigns = () => (
    <div className="space-y-6 animate-fade-in">
      {Object.entries(groupedHeadsigns).map(([direction, headsigns]) => (
        <div key={direction} className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {direction} Direction
            <Badge variant="outline" className="font-normal text-xs">
              {headsigns.length} headsign{headsigns.length !== 1 ? 's' : ''}
            </Badge>
          </h3>
          
          <div className="space-y-4">
            {headsigns.map((item, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]">
                <div className={cn(
                  "border-l-8 h-full",
                  direction === "Outbound" ? "border-translink-blue" : "border-translink-lightBlue"
                )}>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-medium text-lg leading-tight">{item.headsign}</h4>
                      <CircleCheck 
                        className={cn(
                          "h-5 w-5 shrink-0",
                          direction === "Outbound" ? "text-translink-blue" : "text-translink-lightBlue"
                        )} 
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-normal">
                        {item.trips} trip{item.trips !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        Direction ID: {item.direction_id}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("min-h-[200px]", className)}>
      {isLoading ? (
        renderSkeletons()
      ) : error ? (
        renderError()
      ) : headsignsData.length === 0 ? (
        renderEmpty()
      ) : (
        renderHeadsigns()
      )}
    </div>
  );
};

export default HeadsignDisplay;
