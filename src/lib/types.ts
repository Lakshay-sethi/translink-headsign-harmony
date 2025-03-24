
// TransLink GTFS data types
export interface Route {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: number;
  route_url: string;
  route_color: string;
  route_text_color: string;
}

export interface Trip {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign: string;
  trip_short_name: string;
  direction_id: number;
  block_id: string;
  shape_id: string;
}

export interface Stop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  zone_id: string;
  stop_url: string;
  location_type: number;
  parent_station: string;
}

export interface StopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  stop_headsign: string;
  pickup_type: number;
  drop_off_type: number;
  shape_dist_traveled: number;
}

export interface Shape {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled: number;
}

// Derived/computed types
export interface RouteOption {
  value: string;
  label: string;
}

export interface HeadsignData {
  headsign: string;
  direction_id: number;
  trips: number;
}

export interface RouteShapePoint {
  lat: number;
  lng: number;
  sequence: number;
}

export interface RouteShape {
  shape_id: string;
  points: RouteShapePoint[];
}

export interface VerificationResult {
  headsignsData: HeadsignData[];
  routeShapes: RouteShape[];
  isLoading: boolean;
  error: string | null;
}
