
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Model {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_hidden: boolean;
}

interface RecommendedProductsProps {
  models: Model[];
  currentModelId: string;
  size: string;
  onAddToCart: (model: Model) => void;
}

export const RecommendedProducts = ({ 
  models, 
  currentModelId, 
  size, 
  onAddToCart 
}: RecommendedProductsProps) => {
  const recommendations = models
    .filter(model => model.id !== currentModelId)
    .slice(0, 3);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-900 mb-4">You might also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((model) => (
          <Card key={model.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={model.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop"}
                alt={model.name}
                className="w-full h-32 object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-1 truncate">{model.name}</h4>
              <p className="text-xs text-slate-600 mb-2">Size {size}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-600">₹{model.price}</span>
                <Button
                  size="sm"
                  onClick={() => onAddToCart(model)}
                  className="bg-black hover:bg-gray-800 text-white px-3 py-1 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
