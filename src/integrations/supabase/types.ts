export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string
          file_type: string | null
          file_url: string | null
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          agency_id: string | null
          route_color: string | null
          route_desc: string | null
          route_id: string
          route_long_name: string | null
          route_short_name: string | null
          route_text_color: string | null
          route_type: number | null
          route_url: string | null
        }
        Insert: {
          agency_id?: string | null
          route_color?: string | null
          route_desc?: string | null
          route_id: string
          route_long_name?: string | null
          route_short_name?: string | null
          route_text_color?: string | null
          route_type?: number | null
          route_url?: string | null
        }
        Update: {
          agency_id?: string | null
          route_color?: string | null
          route_desc?: string | null
          route_id?: string
          route_long_name?: string | null
          route_short_name?: string | null
          route_text_color?: string | null
          route_type?: number | null
          route_url?: string | null
        }
        Relationships: []
      }
      shapes: {
        Row: {
          shape_dist_traveled: number | null
          shape_id: string
          shape_pt_lat: number | null
          shape_pt_lon: number | null
          shape_pt_sequence: number
        }
        Insert: {
          shape_dist_traveled?: number | null
          shape_id: string
          shape_pt_lat?: number | null
          shape_pt_lon?: number | null
          shape_pt_sequence: number
        }
        Update: {
          shape_dist_traveled?: number | null
          shape_id?: string
          shape_pt_lat?: number | null
          shape_pt_lon?: number | null
          shape_pt_sequence?: number
        }
        Relationships: []
      }
      stop_times: {
        Row: {
          arrival_time: string | null
          departure_time: string | null
          drop_off_type: number | null
          pickup_type: number | null
          shape_dist_traveled: number | null
          stop_headsign: string | null
          stop_id: string | null
          stop_sequence: number
          timepoint: string | null
          trip_id: string
        }
        Insert: {
          arrival_time?: string | null
          departure_time?: string | null
          drop_off_type?: number | null
          pickup_type?: number | null
          shape_dist_traveled?: number | null
          stop_headsign?: string | null
          stop_id?: string | null
          stop_sequence: number
          timepoint?: string | null
          trip_id: string
        }
        Update: {
          arrival_time?: string | null
          departure_time?: string | null
          drop_off_type?: number | null
          pickup_type?: number | null
          shape_dist_traveled?: number | null
          stop_headsign?: string | null
          stop_id?: string | null
          stop_sequence?: number
          timepoint?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stop_times_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["stop_id"]
          },
          {
            foreignKeyName: "stop_times_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["stop_id"]
          },
          {
            foreignKeyName: "stop_times_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "route_paths"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "stop_times_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "stop_times_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["trip_id"]
          },
        ]
      }
      stops: {
        Row: {
          location_type: number | null
          parent_station: string | null
          stop_code: string | null
          stop_desc: string | null
          stop_id: string
          stop_lat: number | null
          stop_lon: number | null
          stop_name: string | null
          stop_url: string | null
          wheelchair_boarding: number | null
          zone_id: string | null
        }
        Insert: {
          location_type?: number | null
          parent_station?: string | null
          stop_code?: string | null
          stop_desc?: string | null
          stop_id: string
          stop_lat?: number | null
          stop_lon?: number | null
          stop_name?: string | null
          stop_url?: string | null
          wheelchair_boarding?: number | null
          zone_id?: string | null
        }
        Update: {
          location_type?: number | null
          parent_station?: string | null
          stop_code?: string | null
          stop_desc?: string | null
          stop_id?: string
          stop_lat?: number | null
          stop_lon?: number | null
          stop_name?: string | null
          stop_url?: string | null
          wheelchair_boarding?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          bikes_allowed: number | null
          block_id: string | null
          direction_id: number | null
          route_id: string | null
          service_id: string | null
          shape_id: string | null
          trip_headsign: string | null
          trip_id: string
          trip_short_name: string | null
          wheelchair_accessible: number | null
        }
        Insert: {
          bikes_allowed?: number | null
          block_id?: string | null
          direction_id?: number | null
          route_id?: string | null
          service_id?: string | null
          shape_id?: string | null
          trip_headsign?: string | null
          trip_id: string
          trip_short_name?: string | null
          wheelchair_accessible?: number | null
        }
        Update: {
          bikes_allowed?: number | null
          block_id?: string | null
          direction_id?: number | null
          route_id?: string | null
          service_id?: string | null
          shape_id?: string | null
          trip_headsign?: string | null
          trip_id?: string
          trip_short_name?: string | null
          wheelchair_accessible?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "route_paths"
            referencedColumns: ["route_id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["route_id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["route_id"]
          },
        ]
      }
    }
    Views: {
      route_paths: {
        Row: {
          direction_id: number | null
          route_id: string | null
          route_long_name: string | null
          route_short_name: string | null
          shape_id: string | null
          shape_pt_lat: number | null
          shape_pt_lon: number | null
          shape_pt_sequence: number | null
          trip_headsign: string | null
          trip_id: string | null
        }
        Relationships: []
      }
      route_stops: {
        Row: {
          direction_id: number | null
          route_id: string | null
          route_short_name: string | null
          stop_id: string | null
          stop_lat: number | null
          stop_lon: number | null
          stop_name: string | null
          stop_sequence: number | null
          trip_headsign: string | null
          trip_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
