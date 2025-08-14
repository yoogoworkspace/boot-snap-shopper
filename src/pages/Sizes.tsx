
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Sizes = () => {
  const { category } = useParams();
  const [sizes, setSizes] = useState<string[]>([]);
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
        .select('value')
        .eq('category_id', categoryData.id);

      if (sizesError) throw sizesError;
      
      // Sort sizes numerically
      const sortedSizes = (sizesData || [])
        .map(size => size.value)
        .sort((a, b) => {
          const aNum = parseFloat(a);
          const bNum = parseFloat(b);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
          }
          return a.localeCompare(b);
        });
      
      setSizes(sortedSizes);
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
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {categoryName}
            </h1>
            <p className="text-slate-600">Select your size</p>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {sizes.map((size, index) => (
            <Link
              key={size}
              to={`/models/${category}/${size}`}
              className="block"
            >
              <Card
                className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {size}
                  </div>
                  <div className="text-sm text-slate-600">Size</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sizes;
