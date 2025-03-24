
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, MapPinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RouteShape } from '@/lib/types';
import L from 'leaflet';
import { RouteStatus as RouteStatusType } from "@/hooks/useRouteRealtime";

// Custom icons
const busIcon = new L.Icon({
  iconUrl: '/bus-icon.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const stopIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -30],
});

interface MapViewProps {
  routeShapes: RouteShape[];
  selectedRouteId: string | null;
  routeStatus: RouteStatusType | null; // Add this line
  className?: string;
}

// Map bounds adjuster component
const BoundsAdjuster = ({ shapes }: { shapes: RouteShape[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (shapes.length > 0) {
      const allPoints = shapes.flatMap(shape => shape.points);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints.map(pt => L.latLng(pt.lat, pt.lng)));
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: true,
          duration: 1
        });
      }
    }
  }, [shapes, map]);
  
  return null;
};

const MapView = (props: MapViewProps) => {
  const { routeShapes, selectedRouteId, className, routeStatus } = props;
  const [showMap, setShowMap] = useState(true);
  const [showAllStops, setShowAllStops] = useState(false);

    
  // Default center (Downtown Vancouver)
  const defaultCenter: L.LatLngExpression = [49.28273, -123.12074];
  
  // Generate colors for each shape
  const shapesWithColors = useMemo(() => {
    return routeShapes.map((shape, index) => {
      // Use TransLink colors
      const color = index % 2 === 0 ? '#0761a5' : '#4a9ed8';
      return { ...shape, color };
    });
  }, [routeShapes]);

  const defaultProps = {
    center: defaultCenter,
    zoom: 11
  };

  if (!selectedRouteId) {
    return (
      <Card className={cn("min-h-[400px] flex items-center justify-center bg-muted/20", className)}>
        <p className="text-muted-foreground text-center max-w-xs">
          Select a route to view the map visualization
        </p>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden relative", className)}>
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => setShowAllStops(!showAllStops)}
        >
          {showAllStops ? "Hide All Stops" : "Show All Stops"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? (
            <>
              <EyeOffIcon className="h-4 w-4 mr-2" /> Hide Map
            </>
          ) : (
            <>
              <EyeIcon className="h-4 w-4 mr-2" /> Show Map
            </>
          )}
        </Button>
      </div>
      
      {showMap ? (
        <div className="h-[500px] w-full animate-fade-in">
          <MapContainer
            center={defaultCenter}
            zoom={11}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {shapesWithColors.map((shape) => (
              <Polyline
                key={shape.shape_id}
                positions={shape.points.map(point => [point.lat, point.lng] as L.LatLngExpression)}
                pathOptions={{
                  color: shape.color,
                  weight: 5,
                  opacity: 0.8
                }}
              />
            ))}
            
            {/* Display stops along the routes */}
            {shapesWithColors.map((shape) => {
              if (shape.points.length === 0) return null;
              
              // Always show first and last stops
              const firstPoint = shape.points[0];
              const lastPoint = shape.points[shape.points.length - 1];
              
              // For intermediate stops, show either all or none based on toggle
              const midPoints = showAllStops 
                ? shape.points.filter((_, index) => 
                    index > 0 && index < shape.points.length - 1 && index % 5 === 0) // Show every 5th point to avoid overcrowding
                : [];
                
              return [
                // First stop
                <Marker 
                  key={`start-${shape.shape_id}`}
                  position={[firstPoint.lat, firstPoint.lng] as L.LatLngExpression}
                  icon={stopIcon}
                >
                  <Popup>
                    <div className="text-sm font-medium">
                      <span className="block text-base text-primary">First Stop</span>
                      <span className="block mt-1">Route {shape.shape_id.split('-')[0]}</span>
                      <span className="block text-xs text-muted-foreground">
                        Location: {firstPoint.lat.toFixed(5)}, {firstPoint.lng.toFixed(5)}
                      </span>
                    </div>
                  </Popup>
                </Marker>,
                
                // Intermediate stops if toggle is on
                ...midPoints.map((point, index) => (
                  <Marker
                    key={`mid-${shape.shape_id}-${index}`}
                    position={[point.lat, point.lng] as L.LatLngExpression}
                    icon={stopIcon}
                  >
                    <Popup>
                      <div className="text-sm font-medium">
                        <span className="block text-base text-primary">Stop #{index + 1}</span>
                        <span className="block mt-1">Route {shape.shape_id.split('-')[0]}</span>
                        <span className="block text-xs text-muted-foreground">
                          Location: {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                )),
                
                // Last stop
                <Marker 
                  key={`end-${shape.shape_id}`}
                  position={[lastPoint.lat, lastPoint.lng] as L.LatLngExpression}
                  icon={stopIcon}
                >
                  <Popup>
                    <div className="text-sm font-medium">
                      <span className="block text-base text-primary">Last Stop</span>
                      <span className="block mt-1">Route {shape.shape_id.split('-')[0]}</span>
                      <span className="block text-xs text-muted-foreground">
                        Location: {lastPoint.lat.toFixed(5)}, {lastPoint.lng.toFixed(5)}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ];
            })}
            
            {routeStatus?.currentPosition && (
              <Marker
                position={[routeStatus.currentPosition.lat, routeStatus.currentPosition.lng]}
                icon={busIcon}
              >
                <Popup>
                  <div className="text-sm font-medium">
                    <span className="block text-base text-primary">Current Bus Location</span>
                    <span className="block text-xs text-muted-foreground">
                      Updated: {new Date(routeStatus.currentPosition.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Location: {routeStatus.currentPosition.lat.toFixed(5)}, {routeStatus.currentPosition.lng.toFixed(5)}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )}
            <BoundsAdjuster shapes={shapesWithColors} />
          </MapContainer>
        </div>
      ) : (
        <div className="h-[120px] w-full flex items-center justify-center bg-muted/10 animate-fade-in">
          <div className="text-center text-muted-foreground">
            <MapPinIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>Map view hidden</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MapView;
