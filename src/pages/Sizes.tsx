
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Size {
  id: string;
  value: string;
}

const Sizes = () => {
  const { category } = useParams();
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSizes();
  }, [category]);

  const fetchSizes = async () => {
    try {
      const categoryName = category === 'football-boots' ? 'Football Boots' : 'Running & Formal Shoes';
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (categoryError) throw categoryError;

      const { data: sizesData, error: sizesError } = await supabase
        .from('sizes')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('value', { ascending: true });

      if (sizesError) throw sizesError;
      setSizes(sizesData || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryName = category === 'football-boots' ? 'Football Boots' : 'Running & Formal Shoes';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* Sizes Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
          Select Your Size
        </h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
          {sizes.map((size, index) => (
            <Link
              key={size.id}
              to={`/models/${category}/${size.value}`}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-white rounded-xl p-6 text-center font-bold text-xl text-slate-700 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                {size.value}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sizes;
