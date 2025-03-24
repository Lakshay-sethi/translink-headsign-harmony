import { useState } from "react";
import { useRouteRealtime } from "@/hooks/useRouteRealtime";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RouteOption } from "@/lib/types";
import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { RouteStatus } from "@/components/RouteStatus";
import { cn } from "@/lib/utils";

interface RouteSelectorProps {
  routes: RouteOption[];
  isLoading: boolean;
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
  onVerify: () => void;
  className?: string;
}

const RouteSelector = ({
  routes,
  isLoading,
  selectedRouteId,
  onRouteSelect,
  onVerify,
  className
}: RouteSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { status, isLoading: isStatusLoading } = useRouteRealtime(selectedRouteId);
  
  const filteredRoutes = searchTerm.length > 0
    ? routes.filter(route => 
        route.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : routes;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRouteChange = (value: string) => {
    onRouteSelect(value);
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select a TransLink Route
        </label>
        
        <div className="relative">
          <Select 
            disabled={isLoading} 
            value={selectedRouteId || ""} 
            onValueChange={handleRouteChange}
          >
            <SelectTrigger className="h-12 bg-white/90 backdrop-blur border-muted-foreground/10 shadow-sm">
              <SelectValue placeholder="Select a route" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <div className="py-2 px-3 sticky top-0 bg-white z-10 border-b">
                <div className="relative">
                  <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/50 border-0 rounded-md focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="Search routes..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="max-h-[300px] overflow-auto">
                {filteredRoutes.length === 0 ? (
                  <div className="px-3 py-6 text-center text-muted-foreground">
                    {searchTerm ? "No routes match your search" : "No routes available"}
                  </div>
                ) : (
                  filteredRoutes.map((route) => (
                    <SelectItem 
                      key={route.value} 
                      value={route.value}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      {route.label}
                    </SelectItem>
                  ))
                )}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        size="lg"
        disabled={!selectedRouteId || isLoading} 
        onClick={onVerify}
        className="w-full bg-translink-blue hover:bg-translink-blue/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        Verify Headsigns
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Button>

      {selectedRouteId && (
        <RouteStatus 
          status={status} 
          isLoading={isStatusLoading} 
          className="mt-4"
        />
      )}
    </div>
  );
};

export default RouteSelector;