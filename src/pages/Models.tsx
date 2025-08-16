
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { CategoryTabs } from "@/components/CategoryTabs";
import { FeaturedProductCard } from "@/components/FeaturedProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import NativeAd from "../NativeAd";

interface Model {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_hidden: boolean;
}

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

const Models = () => {
  const { category, size } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [whatsappAccounts, setWhatsappAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomModal, setZoomModal] = useState<{ isOpen: boolean; imageUrl: string; alt: string }>({
    isOpen: false,
    imageUrl: '',
    alt: ''
  });

  useEffect(() => {
    fetchModels();
    fetchWhatsAppAccounts();
    loadCartItems();
    
    // Listen for cart updates
    const handleCartUpdate = () => loadCartItems();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [category, size]);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  };

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
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${model.name} added to cart!`);
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
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
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

      const randomAccount = whatsappAccounts[Math.floor(Math.random() * whatsappAccounts.length)];
      const orderUrl = `${window.location.origin}/bootbucket/order/${order.id}`;
      const message = `🛍️ New Order Request:\n\n📋 Order Details:\n${orderUrl}\n\n💰 Total*: ₹${total.toFixed(2)}\n<i>*Delivery charge extra except for pickup.</i>\n\nPlease review the order details and confirm. Thank you!`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${randomAccount.phone_number.replace('+', '')}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      setCartItems([]);
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Order sent via WhatsApp!");
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
    }
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
        <div className="container mx-auto">
          <div className="flex items-center mb-4">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Boot Bucket</h1>
              <p className="text-slate-600">Size {size}</p>
            </div>
          </div>
          
          {/* Category Tabs */}
          <CategoryTabs />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Featured Product & Recommendations */}
          <div className="lg:col-span-2">
            {models.length > 0 ? (
              <>
                <FeaturedProductCard
                  models={models}
                  selectedSize={size || ''}
                  category={category || ''}
                  onAddToCart={addToCart}
                  onImageZoom={openZoomModal}
                />
                
                <RecommendedProducts
                  models={models}
                  currentModelId={models[0]?.id || ''}
                  size={size || ''}
                  onAddToCart={addToCart}
                />
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-slate-600 mb-6">No models available for this size</p>
                <Link to={`/sizes/${category}`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold">
                    Choose Another Size
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Section - Cart Sidebar */}
          <div className="lg:col-span-1">
            <CartSidebar
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onRequestOrder={requestOrder}
            />
          </div>
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
