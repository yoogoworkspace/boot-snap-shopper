
import { supabase } from '@/integrations/supabase/client';

// Helper function to get the regular Supabase client
// Since we're using RLS policies that check for authenticated users,
// we just need to ensure the user is signed in to Supabase
export const getAuthenticatedSupabase = () => {
  return supabase;
};

// Helper functions for database operations
export const authenticatedQuery = async (tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', query: string) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).select(query);
};

export const authenticatedInsert = async (tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', data: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).insert(data);
};

export const authenticatedUpdate = async (tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', data: any, filter: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).update(data).match(filter);
};

export const authenticatedDelete = async (tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', filter: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).delete().match(filter);
};
