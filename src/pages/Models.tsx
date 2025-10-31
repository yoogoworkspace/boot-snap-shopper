
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import NativeAd from "../NativeAd";

interface Model {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_hidden: boolean;
}

const Models = () => {
  const { category, size } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomModal, setZoomModal] = useState<{ isOpen: boolean; imageUrl: string; alt: string }>({
    isOpen: false,
    imageUrl: '',
    alt: ''
  });

  useEffect(() => {
    fetchModels();
  }, [category, size]);

  const fetchModels = async () => {
    try {
      const categoryName = category === 'football-boots' ? 'Football Boots' : 'Running & Formal Shoes';
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (categoryError) throw categoryError;

      const { data: sizeData, error: sizeError } = await supabase
        .from('sizes')
        .select('id')
        .eq('category_id', categoryData.id)
        .eq('value', size)
        .single();

      if (sizeError) throw sizeError;

      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('size_id', sizeData.id)
        .eq('is_hidden', false);


      if (modelsError) throw modelsError;
      setModels(modelsData || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (model: Model) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find((item: any) => item.id === model.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: model.id,
        name: model.name,
        price: model.price,
        image_url: model.image_url,
        size: size,
        category: category,
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(`${model.name} added to cart!`);
  };

  const openZoomModal = (imageUrl: string, alt: string) => {
    console.log("Opening modal with:", imageUrl, alt);
    setZoomModal({ isOpen: true, imageUrl, alt });
  };

  const closeZoomModal = () => {
    console.log("Closing modal");
    setZoomModal({ isOpen: false, imageUrl: '', alt: '' });
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-44 md:h-60 bg-slate-900 flex items-center justify-center">
        <img
          src={category === "football-boots" 
            ? "/images/football-hero.jpg" 
            : "/images/formal-hero.jpg"}
          alt={categoryName}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative text-center text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold">{categoryName}</h1>
          <p className="mt-1 text-sm md:text-base italic">
            Find your perfect pair — Size {size}
          </p>
        </div>
      </div>

      {/* Models */}
      <div className="container mx-auto px-4 py-12">
        {models.length === 0 ? (
          <div className="text-center text-slate-600 py-12">
            <p className="text-lg">No models available in this size right now.</p>
            <p className="text-sm mt-2">Check back soon or explore other categories.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {models.map((model, index) => (
              <Card
                key={model.id}
                className="overflow-hidden border border-slate-200 hover:border-blue-500/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl group"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Image with zoom overlay */}
                <div className="relative">
                  <img
                    src={model.image_url || "fallback.jpg"}
                    alt={model.name}
                    onClick={() => openZoomModal(model.image_url, model.name)}
                    className="cursor-pointer w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all pointer-events-none">
                    <ZoomIn className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>

                {/* Info */}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{model.name}</h3>
                  <p className="text-lg font-semibold text-slate-700 mb-4">₹{model.price}</p>
                  <Button
                    onClick={() => addToCart(model)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}



      </div>

      {/* Zoom Modal */}
      <ImageZoomModal
        isOpen={zoomModal.isOpen}
        onClose={closeZoomModal}
        imageUrl={zoomModal.imageUrl}
        alt={zoomModal.alt}
      />
    </div>
  );

};

export default Models;
