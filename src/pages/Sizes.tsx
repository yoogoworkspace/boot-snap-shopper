import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import NativeAd from "../NativeAd";

const Sizes = () => {
  const { category } = useParams();
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSizes();
  }, [category]);

  const fetchSizes = async () => {
    try {
      const categoryName =
        category === "football-boots"
          ? "Football Boots"
          : "Running & Formal Shoes";

      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", categoryName)
        .single();

      if (categoryError) throw categoryError;

      const { data: sizesData, error: sizesError } = await supabase
        .from("sizes")
        .select("value")
        .eq("category_id", categoryData.id);

      if (sizesError) throw sizesError;

      const sortedSizes = (sizesData || [])
        .map((size) => size.value)
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
      console.error("Error fetching sizes:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryName =
    category === "football-boots" ? "Football Boots" : "Running & Formal Shoes";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative w-full h-40 md:h-56 bg-slate-900 flex items-center justify-center">
        <img 
          src={category === "football-boots" 
            ? "/images/football-hero.jpg" 
            : "/images/formal-hero.jpg"} 
          alt={categoryName}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative text-center text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold">{categoryName}</h1>
          <p className="mt-1 text-sm md:text-base italic">
            Performance starts with the perfect fit
          </p>
        </div>
      </div>

      {/* Sizes */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {sizes.map((size, index) => (
            <Link key={size} to={`/models/${category}/${size}`} className="block">
              <Card
                className="group text-center cursor-pointer border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600">
                    {size}
                  </div>
                  <div className="text-sm text-slate-500 group-hover:text-slate-700">
                    Size
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Inspiration / NativeAd */}
        <div className="mt-12">
          
          <NativeAd />
        </div>
      </div>
    </div>
  );
};

export default Sizes;
