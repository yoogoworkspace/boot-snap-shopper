
import { ArrowLeft, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartItem {
  id: string;
  quantity: number;
  model: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
  size: {
    value: string;
  };
}

interface WhatsAppAccount {
  phone_number: string;
  account_name: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [whatsappAccounts, setWhatsappAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = 'demo-session'; // In a real app, this would be from auth or local storage

  useEffect(() => {
    fetchCartItems();
    fetchWhatsAppAccounts();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          model:models (
            id,
            name,
            price,
            image_url
          ),
          size:sizes (
            value
          )
        `)
        .eq('session_id', sessionId);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhatsAppAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_accounts')
        .select('phone_number, account_name')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWhatsappAccounts(data || []);
    } catch (error) {
      console.error('Error fetching WhatsApp accounts:', error);
    }
  };

  const updateQuantity = async (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchCartItems();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCartItems();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const requestOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (whatsappAccounts.length === 0) {
      toast.error("No WhatsApp accounts available for orders");
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.model.price * item.quantity), 0);
    const orderDetails = cartItems.map(item => 
      `${item.model.name} - Size ${item.size.value} - Qty: ${item.quantity} - $${(item.model.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `New Order Request:\n\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nPlease confirm this order.`;
    const encodedMessage = encodeURIComponent(message);
    
    // Use the first active WhatsApp account
    const whatsappUrl = `https://wa.me/${whatsappAccounts[0].phone_number.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success("Order sent to WhatsApp!");
  };

  const total = cartItems.reduce((sum, item) => sum + (item.model.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container-custom flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-card-foreground">
            Shopping Cart
          </h1>
        </div>
      </header>

      {/* Cart Content */}
      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
              <Link to="/">
                <Button className="btn-hero">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.model.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop"}
                        alt={item.model.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{item.model.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size.value}</p>
                        <p className="text-lg font-bold text-primary">${item.model.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Order Summary */}
              <Card className="animate-scale-in">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    onClick={requestOrder}
                    className="btn-accent w-full text-lg py-3"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Request Order via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
