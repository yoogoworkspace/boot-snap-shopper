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
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center px-4 py-4">
          <Link to="/" className="mr-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-black"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {categoryName}
            </h1>
            <p className="text-sm text-gray-500">Select your size</p>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {sizes.map((size) => (
            <Link key={size} to={`/models/${category}/${size}`} className="block">
              <Card className="hover:shadow-md border border-gray-200 transition duration-200">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="text-lg font-medium text-gray-900">{size}</div>
                  <div className="text-xs text-gray-500 mt-1">Size</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <NativeAd />
        </div>
      </div>
    </div>
  );
};

export default Sizes;
