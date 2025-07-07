import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (to be expanded based on your schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone_number: string;
          full_name: string | null;
          avatar_url: string | null;
          user_type: 'family' | 'volunteer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone_number: string;
          full_name?: string | null;
          avatar_url?: string | null;
          user_type: 'family' | 'volunteer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          user_type?: 'family' | 'volunteer';
          created_at?: string;
          updated_at?: string;
        };
      };
      missing_persons: {
        Row: {
          id: string;
          reporter_id: string;
          full_name: string;
          age: number | null;
          description: string | null;
          last_seen_location: string | null;
          last_seen_date: string | null;
          photo_url: string | null;
          status: 'active' | 'found' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          full_name: string;
          age?: number | null;
          description?: string | null;
          last_seen_location?: string | null;
          last_seen_date?: string | null;
          photo_url?: string | null;
          status?: 'active' | 'found' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          full_name?: string;
          age?: number | null;
          description?: string | null;
          last_seen_location?: string | null;
          last_seen_date?: string | null;
          photo_url?: string | null;
          status?: 'active' | 'found' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_type: 'family' | 'volunteer';
      missing_person_status: 'active' | 'found' | 'closed';
    };
  };
}

// Type helpers
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type MissingPerson = Database['public']['Tables']['missing_persons']['Row'];
export type UserType = Database['public']['Enums']['user_type'];
export type MissingPersonStatus = Database['public']['Enums']['missing_person_status'];
