import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Route, Trip, RouteOption, HeadsignData, RouteShape, VerificationResult } from '@/lib/types';
import { toast } from 'sonner';

// Dummy data for development
const dummyRoutes: RouteOption[] = [
  { value: '1', label: '1 - Downtown' },
  { value: '2', label: '2 - Burrard' },
  { value: '3', label: '3 - Main Street' },
  { value: '4', label: '4 - UBC' },
  { value: '5', label: '5 - Robson' },
];

const dummyHeadsigns: HeadsignData[] = [
  { headsign: 'Downtown', direction_id: 0, trips: 150 },
  { headsign: 'UBC', direction_id: 1, trips: 148 },
  { headsign: 'Arbutus', direction_id: 0, trips: 45 },
];

const dummyShapes: RouteShape[] = [
  {
    shape_id: 'shape_1',
    points: [
      { lat: 49.28273, lng: -123.12074, sequence: 1 },
      { lat: 49.27, lng: -123.15, sequence: 2 },
      { lat: 49.26, lng: -123.18, sequence: 3 },
    ]
  },
  {
    shape_id: 'shape_2',
    points: [
      { lat: 49.26, lng: -123.18, sequence: 1 },
      { lat: 49.27, lng: -123.15, sequence: 2 },
      { lat: 49.28273, lng: -123.12074, sequence: 3 },
    ]
  }
];

export function useTranslinkData() {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Fetch all routes for dropdown
  const routesQuery = useQuery({
    queryKey: ['routes'],
    queryFn: async (): Promise<RouteOption[]> => {
      try {
        console.log('Fetching routes from Supabase...');
        const { data, error } = await supabase
          .from('routes')
          .select('route_id, route_short_name, route_long_name')
          .order('route_short_name', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        return data.map((route: Route) => ({
          value: route.route_id,
          label: `${route.route_short_name} - ${route.route_long_name}`
        }));
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast.error('Failed to load routes from database, using demo data');
        
        // Return dummy data if the API call fails
        return dummyRoutes;
      }
    },
  });

  // Fetch headsigns and shape data for selected route
  const verificationQuery = useQuery({
    queryKey: ['verification', selectedRouteId],
    queryFn: async (): Promise<VerificationResult> => {
      if (!selectedRouteId) {
        return {
          headsignsData: [],
          routeShapes: [],
          isLoading: false,
          error: null
        };
      }

      try {
        console.log('Fetching verification data for route:', selectedRouteId);
        // Try to fetch from Supabase
        const { data: tripsData, error: tripsError } = await supabase
          .from('trips')
          .select('trip_id, trip_headsign, direction_id, shape_id')
          .eq('route_id', selectedRouteId);

        if (tripsError) {
          throw tripsError;
        }

        // Process shapes and headsigns from actual data
        const uniqueShapeIds = [...new Set(tripsData.map((trip: Trip) => trip.shape_id))];
        const shapesPromises = uniqueShapeIds.map(async (shapeId) => {
          const { data: shapePoints, error: shapeError } = await supabase
            .from('shapes')
            .select('shape_pt_lat, shape_pt_lon, shape_pt_sequence')
            .eq('shape_id', shapeId)
            .order('shape_pt_sequence', { ascending: true });
            
          if (shapeError) throw shapeError;
          
          return {
            shape_id: shapeId,
            points: shapePoints.map((point: any) => ({
              lat: point.shape_pt_lat,
              lng: point.shape_pt_lon,
              sequence: point.shape_pt_sequence
            }))
          };
        });

        const routeShapes = await Promise.all(shapesPromises);

        // Process headsign data
        const headsignCounts: Record<string, { count: number, direction_id: number }> = {};
        
        tripsData.forEach((trip: Trip) => {
          if (!trip.trip_headsign) return;
          
          const key = trip.trip_headsign;
          if (!headsignCounts[key]) {
            headsignCounts[key] = { count: 0, direction_id: trip.direction_id };
          }
          headsignCounts[key].count++;
        });
        
        const headsignsData: HeadsignData[] = Object.entries(headsignCounts).map(([headsign, data]) => ({
          headsign,
          direction_id: data.direction_id,
          trips: data.count
        }));

        // Sort by direction_id first, then by number of trips (descending)
        headsignsData.sort((a, b) => {
          if (a.direction_id !== b.direction_id) {
            return a.direction_id - b.direction_id;
          }
          return b.trips - a.trips;
        });

        return {
          headsignsData,
          routeShapes,
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Error verifying headsigns:', error);
        toast.info('Using demo data for verification');
        
        // Return dummy data if the API call fails
        return {
          headsignsData: dummyHeadsigns,
          routeShapes: dummyShapes,
          isLoading: false,
          error: null
        };
      }
    },
    enabled: !!selectedRouteId,
  });

  return {
    routes: routesQuery.data || [],
    isRoutesLoading: routesQuery.isLoading,
    routesError: routesQuery.error,
    selectedRouteId,
    setSelectedRouteId,
    verificationResult: {
      headsignsData: verificationQuery.data?.headsignsData || [],
      routeShapes: verificationQuery.data?.routeShapes || [],
      isLoading: verificationQuery.isLoading,
      error: verificationQuery.error ? String(verificationQuery.error) : verificationQuery.data?.error
    }
  };
}
