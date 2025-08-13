
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching categories:', fetchError);
        setError(fetchError.message);
        return;
      }

      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (err) {
      console.error('Unexpected error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}
