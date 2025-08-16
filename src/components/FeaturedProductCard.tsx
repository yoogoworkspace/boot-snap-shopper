
import { useState } from "react";
import { Plus, Minus, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Model {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_hidden: boolean;
}

interface FeaturedProductCardProps {
  models: Model[];
  selectedSize: string;
  category: string;
  onAddToCart: (model: Model) => void;
  onImageZoom: (imageUrl: string, alt: string) => void;
}

export const FeaturedProductCard = ({ 
  models, 
  selectedSize, 
  category, 
  onAddToCart, 
  onImageZoom 
}: FeaturedProductCardProps) => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(models[0] || null);
  const [quantity, setQuantity] = useState(1);

  if (!selectedModel) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(selectedModel);
    }
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden shadow-xl">
      <div className="relative group">
        <img
          src={selectedModel.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop"}
          alt={selectedModel.name}
          className="w-full h-80 object-cover cursor-pointer"
          onClick={() => onImageZoom(selectedModel.image_url, selectedModel.name)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ZoomIn className="h-6 w-6 text-slate-800" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedModel.name}</h2>
          <p className="text-3xl font-bold text-blue-600">₹{selectedModel.price}</p>
          <Badge variant="secondary" className="mt-2">Size {selectedSize}</Badge>
        </div>

        {/* Model Variations */}
        {models.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Available Models</h3>
            <div className="grid grid-cols-2 gap-3">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedModel.id === model.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <img
                    src={model.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=80&fit=crop"}
                    alt={model.name}
                    className="w-full h-16 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium truncate">{model.name}</p>
                  <p className="text-sm text-blue-600 font-bold">₹{model.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
