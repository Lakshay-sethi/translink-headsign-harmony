
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, MapPinIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RouteShape } from '@/lib/types';
import L from 'leaflet';
import { RouteStatus as RouteStatusType } from "@/hooks/useRouteRealtime";
import { LatLngExpression, LatLngTuple, LatLngBoundsExpression } from 'leaflet';

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

// Direction colors
const DIRECTION_COLORS = {
  outbound: '#0761a5', // TransLink blue for outbound (direction_id: 0)
  inbound: '#e05d44',  // Contrasting red/orange for inbound (direction_id: 1)
  default: '#4a9ed8',  // Default blue for unknown direction
};

interface MapViewProps {
  routeShapes: RouteShape[];
  selectedRouteId: string | null;
  routeStatus: RouteStatusType | null;
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
        map.fitBounds(bounds as LatLngBoundsExpression, {
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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Default center (Downtown Vancouver)
  const defaultCenter = useMemo<LatLngTuple>(() => [49.28273, -123.12074], []);
  
  // Generate colors for each shape based on direction_id
  const shapesWithColors = useMemo(() => {
    return routeShapes.map((shape) => {
      const shapeIdParts = shape.shape_id.split('-');
      const directionId = shapeIdParts.length > 1 ? parseInt(shapeIdParts[1]) : null;
      
      let color;
      if (directionId === 0) {
        color = DIRECTION_COLORS.outbound;
      } else if (directionId === 1) {
        color = DIRECTION_COLORS.inbound;
      } else {
        color = DIRECTION_COLORS.default;
      }
      
      return { ...shape, color, directionId };
    });
  }, [routeShapes]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

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
      
      {showMap && (
        <>
          <div className="absolute top-3 left-3 z-10 max-w-xs w-full">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stops..."
                className="pl-9 pr-4 py-2 w-full text-sm rounded-md border border-input bg-white/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="h-[500px] w-full animate-fade-in">
            <MapContainer
              center={defaultCenter}
              zoom={11}
              className="h-full w-full"
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <div className="leaflet-bottom leaflet-left p-4">
                <div className="leaflet-control bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                  <h4 className="font-medium text-sm mb-2">Route Direction</h4>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-2 bg-[#0761a5]"></div>
                      <span>Outbound</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-2 bg-[#e05d44]"></div>
                      <span>Inbound</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {shapesWithColors.map((shape) => (
                <Polyline
                  key={shape.shape_id}
                  positions={shape.points.map(point => [point.lat, point.lng] as LatLngExpression)}
                  pathOptions={{
                    color: shape.color,
                    weight: 5,
                    opacity: 0.8
                  }}
                />
              ))}
              
              {shapesWithColors.map((shape) => {
                if (shape.points.length === 0) return null;
                
                // Always show first and last stops
                const firstPoint = shape.points[0];
                const lastPoint = shape.points[shape.points.length - 1];
                
                // For intermediate stops, show either all or none based on toggle
                const midPoints = showAllStops 
                  ? shape.points.filter((_, index) => 
                      index > 0 && index < shape.points.length - 1 && index % 5 === 0) 
                  : [];
                
                // Filter by search term if available
                const filteredMidPoints = searchTerm 
                  ? midPoints.filter(point => 
                      `Stop ${point.sequence}`.toLowerCase().includes(searchTerm.toLowerCase()))
                  : midPoints;
                  
                return [
                  // First stop
                  <Marker 
                    key={`start-${shape.shape_id}`}
                    position={[firstPoint.lat, firstPoint.lng] as LatLngExpression}
                    icon={stopIcon as any}
                  >
                    <Popup>
                      <div className="text-sm py-1">
                        <div className="font-semibold border-b pb-1 mb-2">First Stop</div>
                        <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                          <span className="text-muted-foreground">Route:</span>
                          <span className="font-medium">{shape.shape_id.split('-')[0]}</span>
                          
                          <span className="text-muted-foreground">Direction:</span>
                          <span className="font-medium">{shape.directionId === 0 ? 'Outbound' : 'Inbound'}</span>
                          
                          <span className="text-muted-foreground">Stop ID:</span>
                          <span>{firstPoint.sequence}</span>
                          
                          <span className="text-muted-foreground">Location:</span>
                          <span className="text-xs">
                            {firstPoint.lat.toFixed(5)}, {firstPoint.lng.toFixed(5)}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>,
                  
                  // Intermediate stops if toggle is on
                  ...filteredMidPoints.map((point, index) => (
                    <Marker
                      key={`mid-${shape.shape_id}-${index}`}
                      position={[point.lat, point.lng] as LatLngExpression}
                      icon={stopIcon as any}
                    >
                      <Popup>
                        <div className="text-sm py-1">
                          <div className="font-semibold border-b pb-1 mb-2">Stop #{point.sequence}</div>
                          <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                            <span className="text-muted-foreground">Route:</span>
                            <span className="font-medium">{shape.shape_id.split('-')[0]}</span>
                            
                            <span className="text-muted-foreground">Direction:</span>
                            <span className="font-medium">{shape.directionId === 0 ? 'Outbound' : 'Inbound'}</span>
                            
                            <span className="text-muted-foreground">Location:</span>
                            <span className="text-xs">
                              {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )),
                  
                  // Last stop
                  <Marker 
                    key={`end-${shape.shape_id}`}
                    position={[lastPoint.lat, lastPoint.lng] as LatLngExpression}
                    icon={stopIcon as any}
                  >
                    <Popup>
                      <div className="text-sm py-1">
                        <div className="font-semibold border-b pb-1 mb-2">Last Stop</div>
                        <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                          <span className="text-muted-foreground">Route:</span>
                          <span className="font-medium">{shape.shape_id.split('-')[0]}</span>
                          
                          <span className="text-muted-foreground">Direction:</span>
                          <span className="font-medium">{shape.directionId === 0 ? 'Outbound' : 'Inbound'}</span>
                          
                          <span className="text-muted-foreground">Stop ID:</span>
                          <span>{lastPoint.sequence}</span>
                          
                          <span className="text-muted-foreground">Location:</span>
                          <span className="text-xs">
                            {lastPoint.lat.toFixed(5)}, {lastPoint.lng.toFixed(5)}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ];
              })}
              
              {routeStatus?.currentPosition && (
                <Marker
                  position={[routeStatus.currentPosition.lat, routeStatus.currentPosition.lng] as LatLngExpression}
                  icon={busIcon as any}
                >
                  <Popup>
                    <div className="text-sm py-1">
                      <div className="font-semibold border-b pb-1 mb-2 flex items-center">
                        <span className="mr-1">Active Bus</span>
                        <div className="ml-auto h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                        <span className="text-muted-foreground">Route:</span>
                        <span className="font-medium">{selectedRouteId}</span>
                        
                        <span className="text-muted-foreground">Updated:</span>
                        <span>{new Date(routeStatus.currentPosition.timestamp).toLocaleTimeString()}</span>
                        
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-xs">
                          {routeStatus.currentPosition.lat.toFixed(5)}, {routeStatus.currentPosition.lng.toFixed(5)}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              <BoundsAdjuster shapes={shapesWithColors} />
            </MapContainer>
          </div>
        </>
      )}
      
      {!showMap && (
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
