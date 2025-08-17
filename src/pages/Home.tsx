import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ShoppingCart, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NativeAd from "../NativeAd";

interface Category {
  id: string;
  name: string;
}

interface Size {
  id: string;
  value: string;
}

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

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [models, setModels] = useState<Model[]>([]);
  const [featuredModel, setFeaturedModel] = useState<Model | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState("");
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
      if (data && data.length > 0) {
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
      const sortedSizes = (data || []).sort((a, b) => {
        const aNum = parseFloat(a.value);
        const bNum = parseFloat(b.value);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.value.localeCompare(b.value);
      });
      setSizes(sortedSizes);
      setSelectedSize("");
      setModels([]);
      setFeaturedModel(null);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('category_id', activeCategory)
        .eq('size_id', selectedSize)
        .eq('is_hidden', false);

      if (error) throw error;
      setModels(data || []);
      if (data && data.length > 0) {
        setFeaturedModel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const addToCart = () => {
    if (!featuredModel || !selectedSize) {
      toast.error("Please select a size and model");
      return;
    }

    const sizeValue = sizes.find(s => s.id === selectedSize)?.value || "";
    const categoryName = categories.find(c => c.id === activeCategory)?.name || "";
    
    const existingItemIndex = cartItems.findIndex(
      item => item.id === featuredModel.id && item.size === sizeValue
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: featuredModel.id,
        name: featuredModel.name,
        price: featuredModel.price,
        image_url: featuredModel.image_url,
        size: sizeValue,
        category: categoryName,
        quantity: quantity
      };
      updatedItems = [...cartItems, newItem];
    }

    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(`${featuredModel.name} added to cart!`);
    setQuantity(1);
  };

  const updateCartQuantity = (id: string, size: string, change: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id && item.size === size) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (id: string, size: string) => {
    const updatedItems = cartItems.filter(item => !(item.id === id && item.size === size));
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = promoCode === "BOOT10" ? subtotal * 0.1 : 0;
  const delivery = subtotal > 1000 ? 0 : 50;
  const total = subtotal - discount + delivery;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black">BOOT BUCKET</h1>
            <div className="flex space-x-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {featuredModel ? (
            <div className="max-w-4xl">
              {/* Featured Product */}
              <Card className="mb-8 overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <div className="flex gap-8">
                    <div className="w-80 h-80 bg-gray-100 rounded-2xl overflow-hidden">
                      <img
                        src={featuredModel.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"}
                        alt={featuredModel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-black mb-2">{featuredModel.name}</h2>
                      <p className="text-gray-600 mb-6">Premium quality footwear with exceptional comfort and durability.</p>
                      
                      {/* Size Selector */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">SIZE</h3>
                        <div className="flex gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size.id}
                              onClick={() => setSelectedSize(size.id)}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                selectedSize === size.id
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {size.value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Model Variations */}
                      {models.length > 1 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">MODELS</h3>
                          <div className="flex gap-3">
                            {models.map((model) => (
                              <button
                                key={model.id}
                                onClick={() => setFeaturedModel(model)}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                  featuredModel.id === model.id
                                    ? 'border-black'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <img
                                  src={model.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop"}
                                  alt={model.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity and Add to Cart */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-2xl font-bold">₹{featuredModel.price}</div>
                        
                        <Button
                          onClick={addToCart}
                          className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg"
                          disabled={!selectedSize}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Products */}
              <div>
                <h3 className="text-xl font-bold mb-4">RECOMMENDED MODELS</h3>
                <div className="grid grid-cols-3 gap-4">
                  {models.slice(0, 3).map((model) => (
                    <Card key={model.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <img
                          src={model.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"}
                          alt={model.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-sm mb-1">{model.name}</h4>
                        <p className="text-red-600 font-bold">₹{model.price}</p>
                        <Button
                          size="sm"
                          className="w-full mt-2 bg-black hover:bg-gray-800 text-white"
                          onClick={() => setFeaturedModel(model)}
                        >
                          Select
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">Select a size to view available models</p>
              {sizes.length > 0 && (
                <div className="flex justify-center gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 font-medium"
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 p-6">
          <div className="sticky top-0">
            <h3 className="text-xl font-bold mb-4">My Order</h3>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">Size {item.size}</p>
                        <p className="text-red-600 font-bold">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.size, -1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.size, 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 ml-2"
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="mb-2"
                  />
                  {promoCode === "BOOT10" && (
                    <Badge className="bg-green-100 text-green-800">10% discount applied!</Badge>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span>DISCOUNT</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DELIVERY</span>
                    <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>TOTAL</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg">
                  Confirm Order
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <NativeAd />
    </div>
  );
};

export default Home;