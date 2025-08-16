
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

interface Size {
  id: string;
  value: string;
  category_id: string;
}

interface Model {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
  size_id: string;
  is_hidden: boolean;
}

interface ProductDisplayProps {
  sizes: Size[];
  models: Model[];
  selectedSize: string;
  selectedModel: Model | null;
  onSizeSelect: (size: string) => void;
  onModelSelect: (model: Model) => void;
  onAddToCart: (model: Model, quantity: number) => void;
}

export const ProductDisplay = ({
  sizes,
  models,
  selectedSize,
  selectedModel,
  onSizeSelect,
  onModelSelect,
  onAddToCart,
}: ProductDisplayProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (selectedModel) {
      onAddToCart(selectedModel, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Featured Product */}
      {selectedModel && (
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedModel.image_url || "/placeholder.svg"}
                alt={selectedModel.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedModel.name}
                </h1>
                <p className="text-2xl font-semibold text-primary">
                  ₹{selectedModel.price}
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <h3 className="text-lg font-medium mb-3">Select Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size.id}
                      variant={selectedSize === size.value ? "default" : "outline"}
                      className="h-12 text-base"
                      onClick={() => onSizeSelect(size.value)}
                    >
                      {size.value}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              {selectedSize && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium">Quantity</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 text-lg font-semibold"
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Model Variations */}
      {selectedSize && models.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Models</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <Card
                key={model.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedModel?.id === model.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onModelSelect(model)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                    <img
                      src={model.image_url || "/placeholder.svg"}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {model.name}
                  </h3>
                  <p className="text-primary font-semibold">₹{model.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedSize && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            Select a size to view available models
          </h2>
          <p className="text-muted-foreground">
            Choose from the available sizes above to see our collection
          </p>
        </div>
      )}
    </div>
  );
};
