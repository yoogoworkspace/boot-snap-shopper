
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ProductDisplay } from "@/components/shop/ProductDisplay";
import { CartSidebar } from "@/components/shop/CartSidebar";

interface Category {
  id: string;
  name: string;
}

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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  size: string;
  quantity: number;
}

const Shop = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    loadCartItems();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchSizes();
    }
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory && selectedSize) {
      fetchModels();
    }
  }, [activeCategory, selectedSize]);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
      if (data?.length) {
        setActiveCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSizes = async () => {
    try {
      const { data, error } = await supabase
        .from('sizes')
        .select('*')
        .eq('category_id', activeCategory)
        .order('value');

      if (error) throw error;
      setSizes(data || []);
      setSelectedSize("");
      setSelectedModel(null);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const sizeData = sizes.find(s => s.value === selectedSize);
      if (!sizeData) return;

      const { data, error } = await supabase
        .from('models')
        .select('id, name, price, image_url, category_id, size_id, is_hidden')
        .eq('category_id', activeCategory)
        .eq('size_id', sizeData.id)
        .eq('is_hidden', false);

      if (error) throw error;
      setModels(data || []);
      if (data?.length) {
        setSelectedModel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const addToCart = (model: Model, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === model.id);
    let updatedItems;

    if (existingItemIndex >= 0) {
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: model.id,
        name: model.name,
        price: model.price,
        image_url: model.image_url,
        size: selectedSize,
        quantity
      };
      updatedItems = [...cartItems, newItem];
    }

    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${model.name} added to cart!`);
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Item removed from cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ShopHeader 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto">
          <ProductDisplay
            sizes={sizes}
            models={models}
            selectedSize={selectedSize}
            selectedModel={selectedModel}
            onSizeSelect={setSelectedSize}
            onModelSelect={setSelectedModel}
            onAddToCart={addToCart}
          />
        </div>
        
        <div className="w-96 border-l bg-background">
          <CartSidebar
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
