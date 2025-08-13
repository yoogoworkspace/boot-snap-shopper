
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { CategorySetup } from "@/components/CategorySetup";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { categories, loading, error } = useCategories();

  const getCategoryIcon = (name: string) => {
    if (name.includes('football')) return Zap;
    if (name.includes('running')) return ShoppingBag;
    return Sparkles;
  };

  const getCategoryGradient = (name: string) => {
    if (name.includes('football')) return "from-blue-600 to-purple-600";
    if (name.includes('running')) return "from-green-500 to-teal-500";
    return "from-orange-500 to-red-500";
  };

  if (error) {
    console.error('Categories error:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Category Setup Component - runs silently */}
      <CategorySetup />
      
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom text-center animate-fade-in">
          <h1 className="hero-title mb-6">
            BootBucket
          </h1>
          <p className="hero-subtitle mb-8 max-w-2xl mx-auto">
            Discover premium footwear collections. From professional football boots to elegant formal shoes and high-performance running shoes.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="btn-hero">
              Explore Collection
            </Button>
            {!isAdmin && (
              <Link to="/admin-auth">
                <Button variant="outline">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="pb-16">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 animate-slide-up">
            Shop by Category
          </h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive mb-8">
              <p>Error loading categories: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check the console for more details and ensure your database is properly configured.
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-muted-foreground mb-8">
              <p>No categories available. Categories are being set up automatically...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category.name);
                const gradient = getCategoryGradient(category.name);
                
                return (
                  <Link
                    key={category.id}
                    to={`/sizes/${category.name}`}
                    className="block"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className="category-card animate-slide-up group"
                      onMouseEnter={() => setHoveredCard(category.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                      
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} mr-4`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="category-card-title">
                            {category.name.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </h3>
                        </div>
                        
                        <p className="category-card-description mb-6">
                          {category.description}
                        </p>
                        
                        <Button 
                          className={`btn-outline transition-all duration-300 ${
                            hoveredCard === category.id ? 'bg-primary text-primary-foreground' : ''
                          }`}
                        >
                          Browse Collection
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 animate-slide-up">
            Why Choose BootBucket?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Premium Quality",
                description: "Carefully curated collection of high-quality footwear from trusted brands",
              },
              {
                title: "Fast Delivery",
                description: "Quick and reliable delivery through WhatsApp ordering system",
              },
              {
                title: "Expert Support",
                description: "Professional guidance to help you find the perfect fit for your needs",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="animate-scale-in p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
