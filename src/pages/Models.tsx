
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
    setZoomModal({ isOpen: true, imageUrl, alt });
  };

  const closeZoomModal = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Link to={`/sizes/${category}`} className="mr-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {categoryName}
            </h1>
            <p className="text-slate-600">Size {size}</p>
          </div>
        </div>
      </div>

      {/* Models */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {models.map((model, index) => (
            <Card
              key={model.id}
              className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative group">
                <img
                  src={model.image_url || "fallback.jpg"}
                  alt={model.name}
                  onClick={() => openZoomModal(model.image_url, model.name)}
                  className="cursor-pointer"
                />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75">
                  <ZoomIn className="h-6 w-6 text-slate-800" />
                </div>
              </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{model.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">₹{model.price}</p>
                <Button
                  onClick={() => addToCart(model)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <NativeAd />
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
