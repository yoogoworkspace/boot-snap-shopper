
import { useState } from "react";
import { Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  size: string;
  category: string;
  quantity: number;
}

interface CartSidebarProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onRequestOrder: () => void;
}

export const CartSidebar = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onRequestOrder 
}: CartSidebarProps) => {
  const [promoCode, setPromoCode] = useState("");
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 1000 ? 0 : 50; // Free delivery over ₹1000
  const discount = promoCode === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + delivery - discount;

  return (
    <Card className="sticky top-4 shadow-xl h-fit">
      <CardHeader className="bg-slate-50">
        <CardTitle className="text-xl">Your Cart ({cartItems.length})</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 max-h-96 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-slate-600">Size {item.size}</p>
                  <p className="text-sm font-bold text-blue-600">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {cartItems.length > 0 && (
        <CardContent className="p-4 pt-0">
          <Separator className="mb-4" />
          
          {/* Promo Code */}
          <div className="mb-4">
            <Input
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={onRequestOrder}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Confirm Order
          </Button>
        </CardContent>
      )}
    </Card>
  );
};
