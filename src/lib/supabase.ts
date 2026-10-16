import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nagvpqtshsbvkdleckhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZ3ZwcXRzaHNidmtkbGVja2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ4NTYsImV4cCI6MjEwNzcxMDg1Nn0.X_iFD-fmBb8daPaVSYrTvYT-l9_9wKBoen0aMg8N7Gg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  genre: string | null;
  image_url: string | null;
  steam_appid: string | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  publisher: string | null;
  rating: number | null;
  os: string | null;
  cpu: string | null;
  ram: string | null;
  gpu: string | null;
  storage: string | null;
  created_at: string;
  updated_at: string;
}
