import { createClient } from '@supabase/supabase-js';

// Use the correct URL and key from the Supabase project
export const supabase = createClient(
  'https://bflcbfznujnffaixeqby.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbGNiZnpudWpuZmZhaXhlcWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NzM0ODMsImV4cCI6MjA1NjQ0OTQ4M30.7MF9N-UGT4cktY-x_HkZJN_Z6fk_g4Vw_rSlnTvXHRI'
);

/* 
  SQL Schema for Supabase Database:

  -- Routes Table (from routes.txt)
  CREATE TABLE routes (
    route_id TEXT PRIMARY KEY,
    agency_id TEXT,
    route_short_name TEXT,
    route_long_name TEXT,
    route_desc TEXT,
    route_type INTEGER,
    route_url TEXT,
    route_color TEXT,
    route_text_color TEXT
  );

  -- Trips Table (from trips.txt)
  CREATE TABLE trips (
    trip_id TEXT PRIMARY KEY,
    route_id TEXT REFERENCES routes(route_id),
    service_id TEXT,
    trip_headsign TEXT,
    trip_short_name TEXT,
    direction_id INTEGER,
    block_id TEXT,
    shape_id TEXT
  );

  -- Stops Table (from stops.txt)
  CREATE TABLE stops (
    stop_id TEXT PRIMARY KEY,
    stop_code TEXT,
    stop_name TEXT,
    stop_desc TEXT,
    stop_lat NUMERIC,
    stop_lon NUMERIC,
    zone_id TEXT,
    stop_url TEXT,
    location_type INTEGER,
    parent_station TEXT
  );

  -- Stop Times Table (from stop_times.txt) - needed for route shapes
  CREATE TABLE stop_times (
    trip_id TEXT REFERENCES trips(trip_id),
    arrival_time TEXT,
    departure_time TEXT,
    stop_id TEXT REFERENCES stops(stop_id),
    stop_sequence INTEGER,
    stop_headsign TEXT,
    pickup_type INTEGER,
    drop_off_type INTEGER,
    shape_dist_traveled NUMERIC,
    PRIMARY KEY (trip_id, stop_sequence)
  );

  -- Shapes Table (from shapes.txt) - needed for route visualization
  CREATE TABLE shapes (
    shape_id TEXT,
    shape_pt_lat NUMERIC,
    shape_pt_lon NUMERIC,
    shape_pt_sequence INTEGER,
    shape_dist_traveled NUMERIC,
    PRIMARY KEY (shape_id, shape_pt_sequence)
  );
*/
