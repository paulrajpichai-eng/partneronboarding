import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('partners').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};


// Database types
export interface Partner {
  id: string;
  owner_name: string;
  firm_name: string;
  email: string;
  mobile: string;
  country: string;
  brand: string;
  business: 'Sales' | 'Exchange';
  uncoded_spoc_id: string;
  address: string;
  city: string;
  pin_code: string;
  landmark?: string;
  state: string;
  tax_id: string;
  tax_id_type: string;
  gstin?: string;
  payment_modes: string[];
  payment_mode_details: any;
  invoicing_frequency: 'daily' | 'weekly' | 'monthly';
  invoicing_type: 'consolidated' | 'statewise' | 'storewise';
  brand_channel?: string;
  plan_id?: string;
  feature_rights: string[];
  status: 'registration' | 'bos-processing' | 'pricing-setup' | 'user-creation' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  partner_id: string;
  name: string;
  address: string;
  city: string;
  pin_code: string;
  landmark?: string;
  state: string;
  tax_id: string;
  brand_location_code: string;
  is_head_office: boolean;
  created_at: string;
}

export interface User {
  id: string;
  partner_id: string;
  location_id: string;
  username: string;
  email: string;
  mobile: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  partner_id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  started_at?: string;
  completed_at?: string;
  duration?: number;
  notes?: string;
  created_at: string;
}

export interface BOSTask {
  id: string;
  partner_id: string;
  status: 'pending' | 'in-progress' | 'completed';
  plan_id?: string;
  feature_rights: string[];
  assigned_at: string;
  completed_at?: string;
}

export interface PricingTask {
  id: string;
  partner_id: string;
  status: 'pending' | 'in-progress' | 'completed';
  margin_configured: boolean;
  assigned_at: string;
  completed_at?: string;
}

export interface SpocMapping {
  id: string;
  spoc_id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface BrandChannelMapping {
  id: string;
  numeric_value: number;
  brand_channel: string;
  created_at: string;
}