
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const categories = [
    {
      id: "football-boots",
      title: "Football Boots",
      description: "Professional football boots for all levels",
      icon: Zap,
      gradient: "from-blue-600 to-purple-600",
    },
    {
      id: "running-formal",
      title: "Running & Formal",
      description: "Comfortable running shoes and elegant formal wear",
      icon: Sparkles,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom text-center animate-fade-in">
          <h1 className="hero-title mb-6">
            BootBucket
          </h1>
          <p className="hero-subtitle mb-8 max-w-2xl mx-auto">
            Discover premium footwear collections. From professional football boots to elegant formal shoes.
          </p>
          <Button className="btn-hero">
            Explore Collection
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="pb-16">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 animate-slide-up">
            Shop by Category
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/sizes/${category.id}`}
                  className="block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="category-card animate-slide-up group"
                    onMouseEnter={() => setHoveredCard(category.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} mr-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="category-card-title">
                          {category.title}
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
                description: "Carefully curated collection of high-quality footwear",
              },
              {
                title: "Fast Delivery",
                description: "Quick and reliable delivery through WhatsApp ordering",
              },
              {
                title: "Expert Support",
                description: "Professional guidance to help you find the perfect fit",
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
