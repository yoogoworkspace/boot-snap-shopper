
import { supabase } from '@/integrations/supabase/client';

// Create a service role client for admin operations
// This bypasses RLS by using elevated permissions
const createServiceRoleClient = () => {
  // For now, we'll use the regular client but with a different approach
  // In production, you would use a service role key
  return supabase;
};

// Helper function to get authenticated Supabase client
export const getAuthenticatedSupabase = () => {
  const adminUser = localStorage.getItem('adminUser');
  if (!adminUser) {
    throw new Error('No authenticated admin user found');
  }
  
  // Return the regular supabase client
  // The RLS policies should allow operations for authenticated users
  return supabase;
};

// Helper functions for database operations with admin privileges
export const authenticatedQuery = async (
  tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', 
  query: string
) => {
  // For admin_users table, we need to handle it specially since it might have stricter RLS
  if (tableName === 'admin_users') {
    return supabase.from(tableName).select(query);
  }
  
  const client = getAuthenticatedSupabase();
  return client.from(tableName).select(query);
};

export const authenticatedInsert = async (
  tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', 
  data: any
) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).insert(data);
};

export const authenticatedUpdate = async (
  tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', 
  data: any, 
  filter: any
) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).update(data).match(filter);
};

export const authenticatedDelete = async (
  tableName: 'admin_users' | 'categories' | 'models' | 'sizes' | 'order_items' | 'orders' | 'whatsapp_accounts', 
  filter: any
) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).delete().match(filter);
};

// Helper for storage operations
export const authenticatedStorage = () => {
  const adminUser = localStorage.getItem('adminUser');
  if (!adminUser) {
    throw new Error('No authenticated admin user found');
  }
  
  return supabase.storage;
};
