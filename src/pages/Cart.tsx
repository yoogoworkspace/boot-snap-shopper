
import { ArrowLeft, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Cart = () => {
  // Mock cart data - will be replaced with actual cart state
  const cartItems = [
    {
      id: 1,
      name: "Nike Mercurial Vapor",
      size: "9",
      price: 129.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      name: "Adidas Predator Elite",
      size: "9.5",
      price: 159.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id: number, change: number) => {
    // This will be implemented with actual cart state management
    console.log(`Update item ${id} quantity by ${change}`);
  };

  const removeItem = (id: number) => {
    // This will be implemented with actual cart state management
    console.log(`Remove item ${id}`);
  };

  const requestOrder = () => {
    // This will implement the WhatsApp order routing
    console.log("Requesting order via WhatsApp");
  };

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
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        <p className="text-lg font-bold text-primary">${item.price}</p>
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
