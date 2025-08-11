
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Models = () => {
  const { category, size } = useParams();
  
  // Mock data - will be replaced with Supabase data
  const products = [
    {
      id: 1,
      name: "Nike Mercurial Vapor",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=500&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Adidas Predator Elite",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Puma Future Z",
      price: 139.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop",
    },
  ];

  const categoryName = category === "football-boots" ? "Football Boots" : "Running & Formal Shoes";

  const addToCart = (product: any) => {
    // This will be implemented with actual cart state management
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container-custom flex items-center">
          <Link to={`/sizes/${category}`} className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              {categoryName}
            </h1>
            <p className="text-muted-foreground">Size {size}</p>
          </div>
        </div>
      </header>

      {/* Products */}
      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="space-y-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <Button
                    onClick={() => addToCart(product)}
                    className="btn-accent w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Models;
