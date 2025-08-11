
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Size {
  id: string;
  value: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Sizes = () => {
  const { category } = useParams();
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchSizesAndCategory();
    }
  }, [category]);

  const fetchSizesAndCategory = async () => {
    try {
      // First get category data
      const { data: categoryResult, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('name', category)
        .single();

      if (categoryError) throw categoryError;
      setCategoryData(categoryResult);

      // Then get sizes for this category
      const { data: sizesResult, error: sizesError } = await supabase
        .from('sizes')
        .select('*')
        .eq('category_id', categoryResult.id)
        .order('value', { ascending: true });

      if (sizesError) throw sizesError;
      setSizes(sizesResult || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryName = categoryData?.name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container-custom flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-card-foreground">
            {categoryName}
          </h1>
        </div>
      </header>

      {/* Sizes Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-xl font-semibold mb-8 text-center animate-fade-in">
            Select Your Size
          </h2>
          
          {sizes.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No sizes available for this category.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
              {sizes.map((size, index) => (
                <Link
                  key={size.id}
                  to={`/models/${category}/${size.value}`}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="size-card hover:scale-105">
                    {size.value}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sizes;
