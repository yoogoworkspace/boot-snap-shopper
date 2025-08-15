
import { supabase } from '@/integrations/supabase/client';

// Helper function to get authenticated Supabase client
export const getAuthenticatedSupabase = () => {
  const adminUser = localStorage.getItem('adminUser');
  
  if (adminUser) {
    const userData = JSON.parse(adminUser);
    
    // Set headers to identify as authenticated admin
    supabase.rest.headers['x-admin-user'] = userData.email;
    supabase.rest.headers['x-admin-id'] = userData.id;
  }
  
  return supabase;
};

// Helper function to make authenticated requests
export const authenticatedQuery = async (tableName: string, query: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).select(query);
};

export const authenticatedInsert = async (tableName: string, data: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).insert(data);
};

export const authenticatedUpdate = async (tableName: string, data: any, filter: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).update(data).match(filter);
};

export const authenticatedDelete = async (tableName: string, filter: any) => {
  const client = getAuthenticatedSupabase();
  return client.from(tableName).delete().match(filter);
};
