
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
// import fetch from "node-fetch";

import { TRANSLINK_API_KEY, GTFS_API_URL } from './config';

export async function fetchRouteRealtime(routeId: string) {
  try {
    // using serverless function
    const response = await fetch("/api/gtfs", {
      headers: {
        "Accept": "application/x-protobuf",
      },
    });

    if (!response.ok) {
      throw new Error(`${response.url}: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );
    
    // Filter and transform the feed data for the specific route
    const routeUpdates = feed.entity
      .filter(entity => entity.vehicle?.trip?.routeId === routeId)
      .map(entity => ({
        routeId: entity.vehicle?.trip?.routeId,
        isActive: true,
        currentPosition: entity.vehicle?.position ? {
          lat: entity.vehicle.position.latitude,
          lng: entity.vehicle.position.longitude,
          timestamp: new Date(entity.vehicle.timestamp * 1000).toISOString(),
          heading: entity.vehicle.position.bearing,
          speed: entity.vehicle.position.speed,
        } : undefined,
        vehicleId: entity.vehicle?.vehicle?.id,
        vehicleLabel: entity.vehicle?.vehicle?.label,
        currentStopSequence: entity.vehicle?.currentStopSequence,
        currentStatus: entity.vehicle?.currentStatus,
        stopId: entity.vehicle?.stopId,
      }));
    
    return routeUpdates[0] || {
      routeId,
      isActive: false,
    };
  } catch (error) {
    console.error('Error fetching GTFS realtime data:', error);
    throw error;
  }
}
