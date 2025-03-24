import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RouteSelector from "@/components/RouteSelector";
import HeadsignDisplay from "@/components/HeadsignDisplay";
import MapView from "@/components/MapView";
import { useTranslinkData } from "@/hooks/useTranslinkData";
import { useRouteRealtime, RouteStatus as RouteStatusType } from "@/hooks/useRouteRealtime";
import { toast } from "sonner";

const Index = () => {
  const {
    routes,
    isRoutesLoading,
    selectedRouteId,
    setSelectedRouteId,
    verificationResult
  } = useTranslinkData();
  
  const [hasVerified, setHasVerified] = useState(false);
  console.log(selectedRouteId);
  // Fetch real-time route status
  const { status, isLoading: isStatusLoading }= useRouteRealtime(selectedRouteId);
  console.log(status);
  // Handle route selection
  const handleRouteSelect = (routeId: string) => {
    setSelectedRouteId(routeId);
    setHasVerified(false);
  };

  // Handle verify button click
  const handleVerify = () => {
    setHasVerified(true);
    toast.success(`Verifying headsigns for route ${selectedRouteId}`);
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (verificationResult.error && hasVerified) {
      toast.error(`Error: ${verificationResult.error}`);
    }
  }, [verificationResult.error, hasVerified]);

  // Show toast when data loads successfully
  useEffect(() => {
    if (hasVerified && !verificationResult.isLoading && verificationResult.headsignsData.length > 0) {
      const count = verificationResult.headsignsData.length;
      toast.success(`Found ${count} headsign${count !== 1 ? 's' : ''}`);
    }
  }, [hasVerified, verificationResult.isLoading, verificationResult.headsignsData]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="flex-1 container py-8 px-4 md:px-6 max-w-6xl animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-8">
          {/* Sidebar - Route Selection */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <RouteSelector
                routes={routes}
                isLoading={isRoutesLoading}
                selectedRouteId={selectedRouteId}
                onRouteSelect={handleRouteSelect}
                onVerify={handleVerify}
                className="glass-panel p-6 rounded-xl"
              />
              
              {hasVerified && !verificationResult.isLoading && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {verificationResult.headsignsData.length} headsigns found
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content - Headsigns & Map */}
          <div className="lg:col-span-6 space-y-8">
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Headsign Verification Results</h2>
              <HeadsignDisplay
                headsignsData={hasVerified ? verificationResult.headsignsData : []}
                isLoading={hasVerified && verificationResult.isLoading}
                error={hasVerified ? verificationResult.error : null}
              />
            </div>
            
            <MapView
              routeShapes={hasVerified ? verificationResult.routeShapes : []}
              selectedRouteId={selectedRouteId}
              routeStatus={status} // Pass the real-time route status
              className="rounded-xl overflow-hidden"
            />
            
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold">About This Tool</h2>
              <p className="text-muted-foreground">
                This tool allows TransLink operators and planners to verify the headsigns used in the GTFS data against actual 
                route information. Select a route and click "Verify Headsigns" to see all headsigns used for that route.
              </p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">How to use this tool:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Select a route from the dropdown menu</li>
                  <li>Click the "Verify Headsigns" button</li>
                  <li>Review the headsigns used for each direction</li>
                  <li>Examine the route paths displayed on the map</li>
                  <li>Compare with external TransLink route information for accuracy</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>TransLink Headsign Verification Tool</p>
          <p className="text-xs mt-1">
            Built with data from TransLink GTFS feeds. Not affiliated with TransLink.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;