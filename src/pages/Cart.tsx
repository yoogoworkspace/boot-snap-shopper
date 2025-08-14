
import { ArrowLeft, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  size: string;
  category: string;
  quantity: number;
}

interface WhatsAppAccount {
  phone_number: string;
  account_name: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [whatsappAccounts, setWhatsappAccounts] = useState<WhatsAppAccount[]>([]);

  useEffect(() => {
    loadCartItems();
    fetchWhatsAppAccounts();
  }, []);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  };

  const fetchWhatsAppAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_accounts')
        .select('phone_number, account_name')
        .eq('is_active', true);

      if (error) throw error;
      setWhatsappAccounts(data || []);
    } catch (error) {
      console.error('Error fetching WhatsApp accounts:', error);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success("Item removed from cart");
  };

  const requestOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (whatsappAccounts.length === 0) {
      toast.error("No WhatsApp accounts available for orders");
      return;
    }

    try {
      // Create order in database
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
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
      const orderItems = cartItems.map(item => ({
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

      // Get a random WhatsApp account
      const randomAccount = whatsappAccounts[Math.floor(Math.random() * whatsappAccounts.length)];
      
      // Create order URL
      const orderUrl = `${window.location.origin}/bootbucket/order/${order.id}`;
      
      const message = `🛍️ New Order Request:\n\n📋 Order Details:\n${orderUrl}\n\n💰 Total*: ₹${total.toFixed(2)}\n<i>*Delivery charge extra except for pickup.</i>\n\nPlease review the order details and confirm. Thank you!`;
      const encodedMessage = encodeURIComponent(message);
      
      const whatsappUrl = `https://wa.me/${randomAccount.phone_number.replace('+', '')}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success("Order sent via WhatsApp!");
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Shopping Cart
          </h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600 mb-6">Your cart is empty</p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                        <p className="text-slate-600">Size: {item.size}</p>
                        <p className="text-xl font-bold text-blue-600">₹{item.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Order Summary */}
              <Card className="shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-bold text-slate-900">Total:</span>
                    <span className="text-3xl font-bold text-blue-600">₹{total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    onClick={requestOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Request Order via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
