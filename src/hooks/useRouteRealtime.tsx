import { useQuery } from '@tanstack/react-query';
import { fetchRouteRealtime } from '@/lib/gtfs';
import { toast } from 'sonner';

export interface RouteStatus {
  routeId: string;
  isActive: boolean;
  currentPosition?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  nextScheduledTime?: string;
}

export function useRouteRealtime(routeId: string | null) {
  // No need for subscription as we'll poll the GTFS API

  const statusQuery = useQuery({
    queryKey: ['route-status', routeId],
    queryFn: async (): Promise<RouteStatus | null> => {
      if (!routeId) return null;

      try {
        // Fetch realtime data from GTFS API
        return await fetchRouteRealtime(routeId);
      } catch (error) {
        console.error('Error fetching route status:', error);
        toast.error('Failed to fetch route status');
        return null;
      }
    },
    enabled: !!routeId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    status: statusQuery.data,
    isLoading: statusQuery.isLoading,
    error: statusQuery.error,
  };
}