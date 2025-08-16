
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { CartItem } from "@/pages/Shop";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const CartSidebar = ({ items, onUpdateQuantity, onRemoveItem }: CartSidebarProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 50 : 0; // Free delivery over certain amount
  const total = subtotal - discount + delivery;

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo code applied! 10% discount");
    } else if (promoCode.toLowerCase() === "flat50") {
      setDiscount(50);
      toast.success("Promo code applied! ₹50 off");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const confirmOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          total_amount: total,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        model_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size_value: item.size
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Get WhatsApp accounts
      const { data: whatsappAccounts } = await supabase
        .from('whatsapp_accounts')
        .select('phone_number, account_name')
        .eq('is_active', true);

      if (whatsappAccounts && whatsappAccounts.length > 0) {
        const randomAccount = whatsappAccounts[Math.floor(Math.random() * whatsappAccounts.length)];
        const orderUrl = `${window.location.origin}/bootbucket/order/${order.id}`;
        
        const message = `🛍️ New Order Request:\n\n📋 Order Details:\n${orderUrl}\n\n💰 Total*: ₹${total.toFixed(2)}\n<i>*Delivery charge extra except for pickup.</i>\n\nPlease review the order details and confirm. Thank you!`;
        const encodedMessage = encodeURIComponent(message);
        
        const whatsappUrl = `https://wa.me/${randomAccount.phone_number.replace('+', '')}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Clear cart
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event('cartUpdated'));
        
        toast.success("Order sent via WhatsApp!");
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Your Cart ({items.length})</CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-6">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-3">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-muted"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Size: {item.size}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      ₹{item.price}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-6 border-t">
          {/* Promo Code */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-sm"
              />
              <Button
                variant="outline"
                onClick={applyPromoCode}
                className="text-sm"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>₹{delivery.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={confirmOrder}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 text-lg font-semibold"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Confirm Order
          </Button>
        </div>
      )}
    </div>
  );
};
