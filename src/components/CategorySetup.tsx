
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CategorySetup() {
  useEffect(() => {
    setupCategories();
  }, []);

  const setupCategories = async () => {
    try {
      // Check if categories already exist
      const { data: existingCategories, error: fetchError } = await supabase
        .from('categories')
        .select('*');

      if (fetchError) {
        console.error('Error fetching categories:', fetchError);
        return;
      }

      // If we have categories, don't create duplicates
      if (existingCategories && existingCategories.length > 0) {
        console.log('Categories already exist:', existingCategories);
        return;
      }

      // Create default categories
      const defaultCategories = [
        {
          name: 'football-boots',
          description: 'Premium football boots for professional and amateur players. Enhance your performance on the field.'
        },
        {
          name: 'formal-shoes',
          description: 'Elegant formal shoes for business meetings, weddings, and special occasions.'
        },
        {
          name: 'running-shoes',
          description: 'High-performance running shoes designed for comfort, durability, and speed.'
        }
      ];

      const { error: insertError } = await supabase
        .from('categories')
        .insert(defaultCategories);

      if (insertError) {
        console.error('Error creating categories:', insertError);
        toast.error('Failed to setup categories');
      } else {
        console.log('Categories created successfully');
        toast.success('Categories setup completed');
      }
    } catch (error) {
      console.error('Error in category setup:', error);
    }
  };

  return null; // This is a utility component with no UI
}
